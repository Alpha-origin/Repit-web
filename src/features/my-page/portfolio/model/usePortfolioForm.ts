import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

import {
  getMyPageMetaData,
  uploadMyPageMetaData,
  type MyPageMetaData,
} from "@/features/my-page/api/getMyPageData";
import { extractErrorMessage } from "@/shared/api/errorMessage";

interface UsePortfolioFormOptions {
  initialGitUrls?: string[];
  initialJobRole?: string;
  onUploadSuccess?: (metaData: MyPageMetaData) => void;
}

const normalizeGitUrl = (value: string) => value.trim();

export const usePortfolioForm = (options: UsePortfolioFormOptions = {}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [portfolioFileError, setPortfolioFileError] = useState("");
  const [gitInput, setGitInput] = useState("");
  const [gitUrls, setGitUrls] = useState<string[]>([]);
  const [jobRole, setJobRole] = useState("");
  const [jobRoleError, setJobRoleError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const isGitListEditedRef = useRef(false);
  const isJobRoleEditedRef = useRef(false);

  useEffect(() => {
    if (!options.initialGitUrls?.length || isGitListEditedRef.current) {
      return;
    }

    const nextGitUrls = options.initialGitUrls
      .map(normalizeGitUrl)
      .filter((url, index, urls) => url && urls.indexOf(url) === index);

    setGitUrls(nextGitUrls);
  }, [options.initialGitUrls]);

  useEffect(() => {
    if (!options.initialJobRole || isJobRoleEditedRef.current) {
      return;
    }

    setJobRole(options.initialJobRole);
  }, [options.initialJobRole]);

  const clearSaveStatus = () => {
    setSaveMessage("");
    setSaveError("");
  };

  const handlePortfolioUploadClick = () => {
    const input = fileInputRef.current;
    if (!input) return;
    input.value = "";
    input.click();
  };

  const handlePortfolioFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    clearSaveStatus();

    if (!file) {
      setPortfolioFile(null);
      setPortfolioFileError("");
      return;
    }

    const isPdfFile =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdfFile) {
      setPortfolioFile(null);
      setPortfolioFileError("PDF 파일만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    setPortfolioFile(file);
    setPortfolioFileError("");
  };

  const handleGitInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGitInput(event.target.value);
    clearSaveStatus();
  };

  const handleGitAdd = () => {
    const nextGitUrl = normalizeGitUrl(gitInput);

    if (!nextGitUrl) {
      return;
    }

    isGitListEditedRef.current = true;
    setGitUrls((prevGitUrls) =>
      prevGitUrls.includes(nextGitUrl)
        ? prevGitUrls
        : [...prevGitUrls, nextGitUrl],
    );
    setGitInput("");
    clearSaveStatus();
  };

  const handleGitInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    handleGitAdd();
  };

  const handleGitRemove = (gitUrl: string) => {
    isGitListEditedRef.current = true;
    setGitUrls((prevGitUrls) => prevGitUrls.filter((url) => url !== gitUrl));
    clearSaveStatus();
  };

  const handleJobRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    isJobRoleEditedRef.current = true;
    setJobRole(event.target.value);
    setJobRoleError("");
    clearSaveStatus();
  };

  const validateBeforeSave = () => {
    let isValid = true;

    if (!portfolioFile) {
      setPortfolioFileError("업로드할 PDF 파일을 첨부해주세요.");
      isValid = false;
    }

    if (gitUrls.length === 0) {
      setSaveError("Git 주소를 하나 이상 추가해주세요.");
      isValid = false;
    }

    if (!jobRole) {
      setJobRoleError("직무를 선택해주세요.");
      isValid = false;
    }

    return isValid;
  };

  const handlePortfolioSave = async () => {
    if (isSaving) {
      return;
    }

    clearSaveStatus();

    if (!validateBeforeSave() || !portfolioFile) {
      return;
    }

    setIsSaving(true);

    try {
      const uploadedMetaData = await uploadMyPageMetaData({
        file: portfolioFile,
        gitUrls,
        jobRole,
      });
      // 업로드는 성공했으므로 재조회가 실패하면 입력값으로 대신 갱신한다.
      const nextMetaData = await getMyPageMetaData().catch(
        () => uploadedMetaData,
      );

      options.onUploadSuccess?.(nextMetaData);
      setSaveMessage("포트폴리오가 저장되었습니다.");
    } catch (error) {
      setSaveError(
        extractErrorMessage(error, "포트폴리오 저장에 실패했습니다."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    fileError: portfolioFileError,
    fileInputRef,
    gitInput,
    gitUrls,
    isSaving,
    jobRole,
    jobRoleError,
    onGitAdd: handleGitAdd,
    onGitInputChange: handleGitInputChange,
    onGitInputKeyDown: handleGitInputKeyDown,
    onGitRemove: handleGitRemove,
    onJobRoleChange: handleJobRoleChange,
    onPortfolioFileChange: handlePortfolioFileChange,
    onPortfolioSave: handlePortfolioSave,
    onPortfolioUploadClick: handlePortfolioUploadClick,
    saveError,
    saveMessage,
    selectedPortfolioFile: portfolioFile,
  };
};
