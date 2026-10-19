import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

import {
  EMPTY_MATERIALS,
  getMaterialErrors,
  getMaterials,
  putMaterials,
  type MaterialDocumentInput,
  type MaterialError,
  type Materials,
  type MaterialSupplement,
} from "@/features/my-page/api/materials";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import {
  getGithubRule,
  getJobRole,
  type JobCategory,
  type JobRoleCode,
} from "@/shared/constants/job/jobRoles";
import {
  MATERIAL_MESSAGES,
  MAX_DOCUMENTS,
  MAX_FILE_BYTES,
  MAX_GITHUB_URLS,
  MAX_SUPPLEMENTS,
  MAX_TOTAL_NEW_FILE_BYTES,
  getGithubKey,
  getMaterialErrorMessage,
  getRequiredDocumentMessage,
  isPdfFile,
  isValidGithubUrl,
} from "./materialRules";

export interface DocumentRow {
  id: string;
  type: string;
  // 저장된 문서는 fileUrl, 새로 첨부한 문서는 file을 가진다. 둘 다 없으면 아직 비어 있는 행이다.
  fileUrl: string | null;
  fileName: string | null;
  pageCount: number | null;
  file: File | null;
}

export interface SupplementRow {
  id: string;
  title: string;
  documentId: string;
  goal: string;
  role: string;
  decision: string;
  outcome: string;
}

export type SupplementField = "title" | "goal" | "role" | "decision" | "outcome";

export interface MaterialFormErrors {
  job?: string;
  documents?: string;
  github?: string;
  supplements?: string;
  documentRows: Record<string, string>;
  githubRows: Record<string, string>;
  supplementRows: Record<string, string>;
}

export interface SaveStatus {
  tone: "info" | "success" | "warning" | "error";
  text: string;
  // 저장은 됐지만 분석 요청이 실패했을 때 "다시 분석"을 띄운다(Web 수정 사항 4.1).
  canReanalyze?: boolean;
}

interface UseMaterialsFormOptions {
  isSaveBlocked?: boolean;
  requiresChangeConfirmation?: boolean;
  onAnalysisStarted?: (jobId: string | null) => void;
  onAnalysisInvalidated?: () => void;
}

interface FormSnapshot {
  job: JobRoleCode | null;
  documents: DocumentRow[];
  gitUrls: string[];
  supplements: SupplementRow[];
}

const EMPTY_ERRORS: MaterialFormErrors = { documentRows: {}, githubRows: {}, supplementRows: {} };

let rowSequence = 0;
const nextRowId = (prefix: string) => `${prefix}-${++rowSequence}`;

const blankDocument = (): DocumentRow => ({
  id: nextRowId("doc"), type: "", fileUrl: null, fileName: null, pageCount: null, file: null,
});

const blankSupplement = (): SupplementRow => ({
  id: nextRowId("supp"), title: "", documentId: "", goal: "", role: "", decision: "", outcome: "",
});

const isDevelopmentJob = (job: string | null) => !job || getJobRole(job)?.category === "DEVELOPMENT";
const isFilledDocument = (row: DocumentRow) => Boolean(row.file || row.fileUrl);
const isFilledSupplement = (row: SupplementRow) =>
  Boolean(row.title || row.documentId || row.goal || row.role || row.decision || row.outcome);

// 자료가 없어도 첫 입력 행은 보여 준다. 첨부는 직무를 선택한 뒤에 활성화된다.
const toSnapshot = (materials: Materials): FormSnapshot => {
  const documents = materials.documents.map((document) => ({
    id: nextRowId("doc"),
    type: document.type,
    fileUrl: document.fileUrl,
    fileName: document.fileName,
    pageCount: document.pageCount,
    file: null,
  }));
  const supplements = materials.supplements.map((supplement) => ({
    id: nextRowId("supp"),
    title: supplement.title ?? "",
    documentId: supplement.documentIndex === null ? "" : documents[supplement.documentIndex]?.id ?? "",
    goal: supplement.goal ?? "",
    role: supplement.role ?? "",
    decision: supplement.decision ?? "",
    outcome: supplement.outcome ?? "",
  }));
  return {
    job: materials.jobRole,
    documents: documents.length ? documents : [blankDocument()],
    gitUrls: materials.gitUrls,
    supplements: supplements.length || !getJobRole(materials.jobRole)?.hasSupplement
      ? supplements
      : [blankSupplement()],
  };
};

const EMPTY_SNAPSHOT: FormSnapshot = { job: null, documents: [], gitUrls: [], supplements: [] };

export const useMaterialsForm = (options: UseMaterialsFormOptions = {}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const gitInputRef = useRef<HTMLInputElement | null>(null);
  const documentSectionRef = useRef<HTMLElement | null>(null);
  const attachingRowIdRef = useRef<string | null>(null);
  const savingRef = useRef(false);
  const loadRequestRef = useRef<AbortController | null>(null);
  // 저장 요청 중에 고친 내용이 있는지 알기 위해 수정할 때마다 올린다.
  const editVersionRef = useRef(0);

  const [server, setServer] = useState<Materials | null>(null);
  const [syncedServer, setSyncedServer] = useState<Materials | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<FormSnapshot>(EMPTY_SNAPSHOT);
  const [category, setCategory] = useState<JobCategory>("DEVELOPMENT");
  const [job, setJob] = useState<JobRoleCode | null>(null);
  const [documents, setDocuments] = useState<DocumentRow[]>(() => [blankDocument()]);
  const [gitUrls, setGitUrls] = useState<string[]>([]);
  const [gitInput, setGitInput] = useState("");
  const [supplements, setSupplements] = useState<SupplementRow[]>([]);
  const [isEdited, setIsEdited] = useState(false);
  const [pendingJob, setPendingJob] = useState<JobRoleCode | null>(null);
  const [errors, setErrors] = useState<MaterialFormErrors>(EMPTY_ERRORS);
  const [saveStatus, setSaveStatus] = useState<SaveStatus | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangeConfirmationOpen, setIsChangeConfirmationOpen] = useState(false);
  const [isMaterialsLoading, setIsMaterialsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const selectedRole = getJobRole(job);
  const jobRole = selectedRole?.category === category ? selectedRole : undefined;
  // 저장은 문서·GitHub·보완 입력 전체를 바꾸므로 저장된 값을 읽기 전에는 보내지 않는다.
  const isLoadBlocked = isMaterialsLoading || Boolean(loadError);
  const githubRule = category === "NON_DEVELOPMENT" ? "HIDDEN" : getGithubRule(jobRole?.code);
  const hasSupplements = category === "NON_DEVELOPMENT";

  const applySnapshot = (snapshot: FormSnapshot) => {
    setJob(snapshot.job);
    setCategory(getJobRole(snapshot.job)?.category ?? "DEVELOPMENT");
    setDocuments(snapshot.documents);
    setGitUrls(snapshot.gitUrls);
    setGitInput("");
    setSupplements(snapshot.supplements);
    setErrors(EMPTY_ERRORS);
  };

  // 서버 값이 바뀌면 저장된 값으로 기억하고, 사용자가 아직 입력을 시작하지 않았으면 화면도 채운다.
  if (server && server !== syncedServer) {
    const snapshot = toSnapshot(server);
    setSyncedServer(server);
    setSavedSnapshot(snapshot);
    if (!isEdited) applySnapshot(snapshot);
  }

  // 화면은 그대로 두고 저장된 값만 바꾼다.
  const rememberServer = (materials: Materials) => {
    const snapshot = toSnapshot(materials);
    setServer(materials);
    setSyncedServer(materials);
    setSavedSnapshot(snapshot);
    return snapshot;
  };

  const applyServer = (materials: Materials) => {
    applySnapshot(rememberServer(materials));
    setIsEdited(false);
  };

  // replaceEdits: 다시 불러오기는 조회 실패 중에 고친 내용 대신 저장된 값으로 화면을 채운다.
  const loadMaterials = useCallback(async (replaceEdits: boolean) => {
    loadRequestRef.current?.abort();
    const controller = new AbortController();
    loadRequestRef.current = controller;
    setIsMaterialsLoading(true);
    setLoadError("");

    let materials: Materials;
    try {
      materials = await getMaterials(controller.signal);
    } catch (error) {
      if (controller.signal.aborted) return;
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        materials = EMPTY_MATERIALS;
      } else {
        setLoadError(MATERIAL_MESSAGES.LOAD_FAILED);
        setIsMaterialsLoading(false);
        return;
      }
    }
    if (controller.signal.aborted) return;
    if (replaceEdits) {
      applySnapshot(rememberServer(materials));
      setIsEdited(false);
    } else {
      setServer(materials);
    }
    setIsMaterialsLoading(false);
  }, []);

  useEffect(() => {
    void loadMaterials(false);
    return () => loadRequestRef.current?.abort();
  }, [loadMaterials]);

  const markEdited = () => {
    editVersionRef.current += 1;
    setIsEdited(true);
    setSaveStatus(null);
  };

  const hasMaterials = documents.some((row) => row.type || isFilledDocument(row)) ||
    gitUrls.length > 0 || supplements.some(isFilledSupplement);

  // 직무를 바꾼다. 개발 3직무(직무 없음 포함) 사이만 자료를 유지하고, 그 밖은 초기화한다(06 §3.2).
  const applyJob = (nextJob: JobRoleCode, keepsMaterials: boolean) => {
    setJob(nextJob);
    setCategory(getJobRole(nextJob)?.category ?? "DEVELOPMENT");
    setPendingJob(null);
    setErrors(EMPTY_ERRORS);
    markEdited();
    if (keepsMaterials) {
      if (documents.length === 0) setDocuments([blankDocument()]);
      if (!getJobRole(nextJob)?.hasSupplement) setSupplements([]);
      return;
    }
    if (nextJob === savedSnapshot.job) {
      // 원래 직무로 돌아오면 서버 값을 다시 채운다.
      setDocuments(savedSnapshot.documents.length ? savedSnapshot.documents : [blankDocument()]);
      setGitUrls(savedSnapshot.gitUrls);
      setSupplements(savedSnapshot.supplements);
      return;
    }
    setDocuments([blankDocument()]);
    setGitUrls([]);
    setSupplements(getJobRole(nextJob)?.hasSupplement ? [blankSupplement()] : []);
  };

  const handleCategoryChange = (nextCategory: JobCategory) => {
    if (nextCategory === category) return;
    setCategory(nextCategory);
    if (nextCategory === "NON_DEVELOPMENT" && supplements.length === 0) {
      setSupplements([blankSupplement()]);
    }
    setErrors(EMPTY_ERRORS);
    markEdited();
  };

  const handleJobChange = (value: string) => {
    const nextRole = getJobRole(value);
    if (!nextRole || nextRole.code === job) return;
    const nextJob = nextRole.code as JobRoleCode;
    const keepsMaterials = isDevelopmentJob(job) && nextRole.category === "DEVELOPMENT";
    if (keepsMaterials || !hasMaterials) {
      applyJob(nextJob, keepsMaterials);
      return;
    }
    setPendingJob(nextJob);
  };

  const handleCancelJobChange = () => {
    setPendingJob(null);
    setCategory(getJobRole(job)?.category ?? "DEVELOPMENT");
  };

  const handleConfirmJobChange = () => {
    if (pendingJob) applyJob(pendingJob, false);
  };

  // ----- 문서 -----

  const updateDocument = (rowId: string, patch: Partial<DocumentRow>) => {
    setDocuments((rows) => rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)));
    setErrors((prev) => {
      if (!prev.documentRows[rowId]) return prev;
      const documentRows = Object.fromEntries(
        Object.entries(prev.documentRows).filter(([id]) => id !== rowId),
      );
      return { ...prev, documentRows };
    });
    markEdited();
  };

  const handleDocumentAdd = () => {
    if (documents.length >= MAX_DOCUMENTS) return;
    setDocuments((rows) => [...rows, blankDocument()]);
    markEdited();
  };

  const handleDocumentRemove = (rowId: string) => {
    setDocuments((rows) => rows.filter((row) => row.id !== rowId));
    setSupplements((rows) => rows.map((row) => (row.documentId === rowId ? { ...row, documentId: "" } : row)));
    markEdited();
  };

  const handleDocumentTypeChange = (rowId: string, type: string) => {
    updateDocument(rowId, { type });
  };

  const handleDocumentAttachClick = (rowId: string) => {
    const input = fileInputRef.current;
    if (!input) return;
    attachingRowIdRef.current = rowId;
    input.value = "";
    input.click();
  };

  const handleDocumentFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const rowId = attachingRowIdRef.current;
    event.target.value = "";
    if (!file || !rowId) return;

    if (!isPdfFile(file)) {
      setErrors((prev) => ({ ...prev, documentRows: { ...prev.documentRows, [rowId]: MATERIAL_MESSAGES.NOT_PDF_FILE } }));
      return;
    }

    updateDocument(rowId, { file, fileName: file.name, fileUrl: null, pageCount: null });
  };

  // ----- GitHub -----

  const handleGitInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGitInput(event.target.value);
    setErrors((prev) => (prev.github ? { ...prev, github: undefined } : prev));
  };

  const handleGitAdd = () => {
    const input = gitInput.trim();
    if (!input) return;
    const nextGitUrl = /^[A-Za-z0-9-]+$/.test(input) ? `https://github.com/${input}` : input;

    if (!isValidGithubUrl(nextGitUrl)) {
      setErrors((prev) => ({ ...prev, github: MATERIAL_MESSAGES.INVALID_GITHUB_URL }));
      return;
    }

    const nextKey = getGithubKey(nextGitUrl);
    if (!gitUrls.some((url) => getGithubKey(url) === nextKey)) {
      if (gitUrls.length >= MAX_GITHUB_URLS) {
        setErrors((prev) => ({ ...prev, github: MATERIAL_MESSAGES.TOO_MANY_GITHUB_URLS }));
        return;
      }
      setGitUrls((urls) => [...urls, nextGitUrl]);
    }
    setGitInput("");
    markEdited();
  };

  const handleGitInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    event.preventDefault();
    handleGitAdd();
  };

  const handleGitRemove = (gitUrl: string) => {
    setGitUrls((urls) => urls.filter((url) => url !== gitUrl));
    markEdited();
  };

  // ----- 보완 입력 -----

  const handleSupplementAdd = () => {
    if (supplements.length >= MAX_SUPPLEMENTS) return;
    setSupplements((rows) => [...rows, blankSupplement()]);
    markEdited();
  };

  const handleSupplementRemove = (rowId: string) => {
    setSupplements((rows) => {
      const remaining = rows.filter((row) => row.id !== rowId);
      return remaining.length ? remaining : [blankSupplement()];
    });
    markEdited();
  };

  const handleSupplementChange = (rowId: string, field: SupplementField | "documentId", value: string) => {
    setSupplements((rows) => rows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)));
    markEdited();
  };

  // ----- 저장 -----

  const validate = () => {
    const nextErrors: MaterialFormErrors = { documentRows: {}, githubRows: {}, supplementRows: {} };
    if (!jobRole) {
      nextErrors.job = MATERIAL_MESSAGES.JOB_ROLE_REQUIRED;
      return nextErrors;
    }

    const filledDocuments = documents.filter(isFilledDocument);
    if (filledDocuments.length > MAX_DOCUMENTS) {
      nextErrors.documents = MATERIAL_MESSAGES.TOO_MANY_DOCUMENTS;
    } else if (!filledDocuments.some((row) => (jobRole.requiredDocuments as readonly string[]).includes(row.type))) {
      nextErrors.documents = getRequiredDocumentMessage(jobRole.requiredDocuments);
    }

    let totalNewBytes = 0;
    filledDocuments.forEach((row) => {
      if (!row.file) return;
      totalNewBytes += row.file.size;
      if (row.file.size > MAX_FILE_BYTES) nextErrors.documentRows[row.id] = MATERIAL_MESSAGES.FILE_TOO_LARGE;
    });
    if (!nextErrors.documents && totalNewBytes > MAX_TOTAL_NEW_FILE_BYTES) {
      nextErrors.documents = MATERIAL_MESSAGES.TOTAL_FILE_TOO_LARGE;
    }

    if (githubRule === "REQUIRED" && gitUrls.length === 0) {
      nextErrors.github = MATERIAL_MESSAGES.GITHUB_REQUIRED;
    }
    if (githubRule !== "HIDDEN") {
      gitUrls.forEach((url) => {
        if (!isValidGithubUrl(url)) nextErrors.githubRows[url] = MATERIAL_MESSAGES.INVALID_GITHUB_URL;
      });
    }

    return nextErrors;
  };

  const hasErrors = (target: MaterialFormErrors) =>
    Boolean(target.job || target.documents || target.github || target.supplements) ||
    Object.keys(target.documentRows).length > 0 ||
    Object.keys(target.githubRows).length > 0 ||
    Object.keys(target.supplementRows).length > 0;

  const applyServerErrors = (
    serverErrors: MaterialError[],
    sent: { documents: string[]; gitUrls: string[]; supplements: string[] },
  ) => {
    const requiredDocuments = jobRole?.requiredDocuments ?? [];
    const nextErrors: MaterialFormErrors = { documentRows: {}, githubRows: {}, supplementRows: {} };
    const append = (current: string | undefined, message: string) =>
      current && current !== message ? `${current} ${message}` : message;

    serverErrors.forEach((error) => {
      const message = getMaterialErrorMessage(error, requiredDocuments);
      const indexed = /^(documents|gitUrls|supplements)\[(\d+)]$/.exec(error.field);
      if (indexed) {
        const index = Number(indexed[2]);
        if (indexed[1] === "documents" && sent.documents[index]) nextErrors.documentRows[sent.documents[index]] = message;
        else if (indexed[1] === "gitUrls" && sent.gitUrls[index]) nextErrors.githubRows[sent.gitUrls[index]] = message;
        else if (indexed[1] === "supplements" && sent.supplements[index]) nextErrors.supplementRows[sent.supplements[index]] = message;
        return;
      }
      if (error.field === "jobRole") nextErrors.job = message;
      else if (error.field === "gitUrls") nextErrors.github = append(nextErrors.github, message);
      else if (error.field === "supplements") nextErrors.supplements = append(nextErrors.supplements, message);
      else nextErrors.documents = append(nextErrors.documents, message);
    });

    setErrors(nextErrors);
  };

  const submit = async () => {
    if (savingRef.current || options.isSaveBlocked || isLoadBlocked || !jobRole) return;

    const filledDocuments = documents.filter(isFilledDocument);
    const files: Record<string, File> = {};
    const documentInputs: MaterialDocumentInput[] = filledDocuments.map((row) => {
      if (row.file) {
        const fileKey = `file${Object.keys(files).length}`;
        files[fileKey] = row.file;
        return { type: row.type, source: "NEW", fileKey };
      }
      return { type: row.type, source: "EXISTING", fileUrl: row.fileUrl ?? "" };
    });
    const sentGitUrls = githubRule === "HIDDEN" ? [] : gitUrls;
    const sentSupplements = hasSupplements ? supplements.filter(isFilledSupplement) : [];
    const supplementInputs: MaterialSupplement[] = sentSupplements.map((row) => {
      const documentIndex = filledDocuments.findIndex((document) => document.id === row.documentId);
      return {
        title: row.title,
        documentIndex: documentIndex >= 0 ? documentIndex : null,
        goal: row.goal,
        role: row.role,
        decision: row.decision,
        outcome: row.outcome,
      };
    });

    savingRef.current = true;
    setIsSaving(true);
    setSaveStatus(null);
    const sentEditVersion = editVersionRef.current;

    try {
      const result = await putMaterials({
        payload: {
          jobRole: jobRole.code as JobRoleCode,
          documents: documentInputs,
          gitUrls: sentGitUrls,
          supplements: supplementInputs,
        },
        files,
      });

      // 저장 뒤에는 다시 조회하지 않고 응답 값으로 화면과 서버 값을 바꾼다(Web 수정 사항 2.3).
      // 요청 중에 고친 내용이 있으면 화면은 두고 저장된 값만 바꿔, 다음 저장에서 보내게 한다.
      if (editVersionRef.current === sentEditVersion) applyServer(result.materials);
      else rememberServer(result.materials);
      if (!result.analysis) {
        setSaveStatus({ tone: "info", text: "변경된 내용이 없어요" });
      } else if (result.analysis.status === "accepted") {
        options.onAnalysisStarted?.(result.analysis.jobId);
        setSaveStatus({ tone: "success", text: "저장했어요. 자료 분석을 시작해요" });
      } else if (result.analysis.status === "failed") {
        options.onAnalysisInvalidated?.();
        setSaveStatus({
          tone: "warning",
          text: "자료는 저장했지만 분석을 시작하지 못했어요. 다시 분석해 주세요",
          canReanalyze: true,
        });
      } else {
        options.onAnalysisInvalidated?.();
        setSaveStatus({ tone: "info", text: "저장했어요. 이 직무의 자료 분석은 준비 중이에요" });
      }
    } catch (error) {
      const serverErrors = getMaterialErrors(error);
      if (serverErrors) {
        applyServerErrors(serverErrors, {
          documents: filledDocuments.map((row) => row.id),
          gitUrls: sentGitUrls,
          supplements: sentSupplements.map((row) => row.id),
        });
        setSaveStatus({ tone: "error", text: MATERIAL_MESSAGES.SAVE_FAILED });
      } else {
        setSaveStatus({ tone: "error", text: extractErrorMessage(error, "자료 저장에 실패했습니다.") });
      }
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (savingRef.current || options.isSaveBlocked || isLoadBlocked) return;
    setSaveStatus(null);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    // 고친 것이 없으면 질문이 사라진다는 경고 없이 보내고, 서버의 "변경 없음" 응답을 그대로 보여 준다.
    if (options.requiresChangeConfirmation && isEdited) {
      setIsChangeConfirmationOpen(true);
      return;
    }
    await submit();
  };

  const handleConfirmChange = async () => {
    setIsChangeConfirmationOpen(false);
    await submit();
  };

  const handleCancelEdit = () => {
    applySnapshot(savedSnapshot);
    setIsEdited(false);
    setPendingJob(null);
    setSaveStatus(null);
  };

  const focusDocuments = () => {
    documentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    documentSectionRef.current?.querySelector<HTMLElement>("select, button")?.focus({ preventScroll: true });
  };

  return {
    materials: server,
    jobSelection: {
      category,
      job: job ?? "",
      onCategoryChange: handleCategoryChange,
      onJobChange: handleJobChange,
    },
    jobChange: {
      isOpen: pendingJob !== null,
      onCancel: handleCancelJobChange,
      onConfirm: handleConfirmJobChange,
    },
    job: jobRole?.code ?? null,
    githubRule,
    hasSupplements,
    documents,
    documentSectionRef,
    fileInputRef,
    onDocumentAdd: handleDocumentAdd,
    onDocumentRemove: handleDocumentRemove,
    onDocumentTypeChange: handleDocumentTypeChange,
    onDocumentAttachClick: handleDocumentAttachClick,
    onDocumentFileChange: handleDocumentFileChange,
    gitInput,
    gitInputRef,
    gitUrls,
    onGitAdd: handleGitAdd,
    onGitInputChange: handleGitInputChange,
    onGitInputKeyDown: handleGitInputKeyDown,
    onGitRemove: handleGitRemove,
    supplements,
    onSupplementAdd: handleSupplementAdd,
    onSupplementRemove: handleSupplementRemove,
    onSupplementChange: handleSupplementChange,
    errors,
    saveStatus,
    clearAnalysisWarning: () => setSaveStatus((current) => current?.canReanalyze ? null : current),
    isSaving,
    isEdited,
    isSaveDisabled: !jobRole || isSaving || isLoadBlocked || Boolean(options.isSaveBlocked),
    loadError,
    onRetryLoad: () => void loadMaterials(true),
    onSave: handleSave,
    onCancelEdit: handleCancelEdit,
    isChangeConfirmationOpen,
    onCancelChange: () => setIsChangeConfirmationOpen(false),
    onConfirmChange: handleConfirmChange,
    focusDocuments,
  };
};
