import axios from "axios";

import { apiInstance, ensureAccessToken } from "@/shared/api/axiosInstance";
import { getJobRole, type JobRoleCode } from "@/shared/constants/job/jobRoles";

// 01-overview §4.1 C-1. 목록은 서버가 null 대신 빈 목록으로 준다.
export interface MaterialDocument {
  index: number;
  type: string;
  fileUrl: string;
  fileName: string | null;
  pageCount: number | null;
}

export interface MaterialSupplement {
  title: string;
  documentIndex: number | null;
  goal: string;
  role: string;
  decision: string;
  outcome: string;
}

export interface CoverLetter {
  question: string;
  answer: string;
}

export interface Materials {
  jobRole: JobRoleCode | null;
  jobTitle: string | null;
  documents: MaterialDocument[];
  gitUrls: string[];
  supplements: MaterialSupplement[];
  coverLetters: CoverLetter[];
}

interface MaterialsResponse {
  jobRole?: string | null;
  jobTitle?: string | null;
  documents?: MaterialDocument[] | null;
  gitUrls?: string[] | null;
  supplements?: MaterialSupplement[] | null;
  coverLetters?: CoverLetter[] | null;
}

const MATERIALS_URL = "/api/v1/metaData/materials";

export const EMPTY_MATERIALS: Materials = {
  jobRole: null,
  jobTitle: null,
  documents: [],
  gitUrls: [],
  supplements: [],
  coverLetters: [],
};

const toMaterials = (payload: MaterialsResponse | null | undefined): Materials => ({
  // 모르는 직무 코드는 직무를 고르지 않은 것으로 본다.
  jobRole: (getJobRole(payload?.jobRole)?.code as JobRoleCode | undefined) ?? null,
  jobTitle: payload?.jobTitle ?? null,
  documents: payload?.documents ?? [],
  gitUrls: payload?.gitUrls ?? [],
  supplements: payload?.supplements ?? [],
  coverLetters: payload?.coverLetters ?? [],
});

export const getMaterials = async (signal?: AbortSignal): Promise<Materials> => {
  const response = await apiInstance.get<MaterialsResponse>(MATERIALS_URL, {
    signal,
    timeout: 15_000,
  });

  return toMaterials(response.data);
};

// ----- 저장: PUT /api/v1/metaData/materials (multipart) -----

export type MaterialDocumentInput =
  | { type: string; source: "EXISTING"; fileUrl: string }
  | { type: string; source: "NEW"; fileKey: string };

export interface MaterialsPayload {
  jobRole: JobRoleCode;
  jobTitle: string | null;
  documents: MaterialDocumentInput[];
  gitUrls: string[];
  supplements: MaterialSupplement[];
  coverLetters: CoverLetter[];
}

export interface MaterialsDraft {
  payload: MaterialsPayload;
  // fileKey("file0"~"file4") → 새로 첨부한 PDF
  files: Record<string, File>;
}

export type MaterialsAnalysisStatus = "accepted" | "failed" | "skipped";

export interface MaterialsSaveResult {
  materials: Materials;
  // null이면 바뀐 것이 없어 저장·분석을 하지 않았다는 뜻이다.
  analysis: { jobId: string | null; status: MaterialsAnalysisStatus } | null;
}

export interface MaterialError {
  field: string;
  reason: string;
  detail: string | null;
}

interface MaterialsSaveResponse {
  materials?: MaterialsResponse | null;
  analysis?: MaterialsSaveResult["analysis"];
}

export const putMaterials = async ({ payload, files }: MaterialsDraft): Promise<MaterialsSaveResult> => {
  const authorizationHeader = await ensureAccessToken();
  const formData = new FormData();
  // payload는 application/json 파트여야 서버가 JSON으로 읽는다.
  formData.append("payload", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  Object.entries(files).forEach(([fileKey, file]) => {
    formData.append(fileKey, file);
  });

  const response = await apiInstance.put<MaterialsSaveResponse>(MATERIALS_URL, formData, {
    headers: { Authorization: authorizationHeader },
  });

  return {
    materials: toMaterials(response.data.materials),
    analysis: response.data.analysis ?? null,
  };
};

// 422 자료 규칙 위반이면 errors 목록을, 아니면 null을 돌려준다.
export const getMaterialErrors = (error: unknown): MaterialError[] | null => {
  if (!axios.isAxiosError(error) || error.response?.status !== 422) return null;
  const errors = (error.response.data as { errors?: unknown } | undefined)?.errors;
  return Array.isArray(errors) ? (errors as MaterialError[]) : null;
};
