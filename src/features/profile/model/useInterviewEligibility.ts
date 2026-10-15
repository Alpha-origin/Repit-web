import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  getMyPageMetaData,
  type MyPageMetaData,
} from "@/features/my-page/api/getMyPageData";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import { getProfileFailureMessage } from "./profileMessages";
import { useProfileStatus } from "./useProfileStatus";

export const useInterviewEligibility = () => {
  const profileStatus = useProfileStatus();
  const [metaData, setMetaData] = useState<MyPageMetaData | null>(null);
  const [isMetaDataLoading, setIsMetaDataLoading] = useState(true);
  const [metaDataError, setMetaDataError] = useState("");
  const requestRef = useRef<AbortController | null>(null);

  const loadMetaData = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setIsMetaDataLoading(true);
    try {
      const data = await getMyPageMetaData(controller.signal);
      if (!controller.signal.aborted) {
        setMetaData(data);
        setMetaDataError("");
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setMetaData({ fileUrl: "", gitUrls: [] });
          setMetaDataError("");
        } else {
          setMetaDataError(extractErrorMessage(error, "저장된 자료를 확인하지 못했습니다."));
        }
      }
    } finally {
      if (!controller.signal.aborted) setIsMetaDataLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMetaData();
    return () => requestRef.current?.abort();
  }, [loadMetaData]);

  const status = profileStatus.profile?.status;
  const isChecking = profileStatus.isLoading || (status === "NONE" && isMetaDataLoading);
  const loadError = profileStatus.errorMessage || (status === "NONE" ? metaDataError : "");
  const hasPortfolio = Boolean(metaData?.fileUrl?.trim());
  const hasGithub = Boolean(metaData?.gitUrls?.some((url) => url.trim()));
  const hasMaterials = hasPortfolio && hasGithub;
  const canStart = !isChecking && !loadError &&
    (status === "COMPLETED" || (status === "NONE" && hasMaterials));
  let guidance = "";
  if (isChecking) guidance = "자료 분석 상태를 확인하고 있어요";
  else if (loadError) guidance = loadError;
  else if (status === "PENDING") guidance = "자료 분석이 끝나면 시작할 수 있어요";
  else if (status === "FAILED" && profileStatus.profile) guidance = getProfileFailureMessage(profileStatus.profile);
  else if (status === "NONE") guidance = hasMaterials
    ? "첫 면접은 준비에 몇 분 걸릴 수 있어요"
    : hasPortfolio ? "GitHub 저장소를 등록해야 면접을 시작할 수 있어요"
    : hasGithub ? "포트폴리오 PDF를 등록해야 면접을 시작할 수 있어요"
    : "마이페이지에서 자료를 등록해 주세요";

  return {
    canStart,
    guidance,
    isPortfolioAnalyzing: status === "PENDING",
    showMyPageLink: status === "FAILED" || (status === "NONE" && !isChecking && !loadError && !hasMaterials),
    hasLoadError: Boolean(loadError),
    refetch: () => {
      void profileStatus.refetch();
      void loadMetaData();
    },
  };
};
