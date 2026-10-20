import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  EMPTY_MATERIALS,
  getMaterials,
  type Materials,
} from "@/features/my-page/api/materials";
import { requiresJobTitle } from "@/shared/constants/job/jobRoles";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import { checkMaterials } from "./materialsRequirement";
import { GENERAL_MATERIAL_GUIDANCE, getProfileFailureMessage, getRequiredDocumentGuidance } from "./profileMessages";
import { useProfileStatus } from "./useProfileStatus";

const JOB_SELECTION_GUIDANCE = "마이페이지에서 직무를 선택해 주세요";

export const useInterviewEligibility = () => {
  const profileStatus = useProfileStatus();
  const [materials, setMaterials] = useState<Materials | null>(null);
  const [isMaterialsLoading, setIsMaterialsLoading] = useState(true);
  const [materialsError, setMaterialsError] = useState("");
  const requestRef = useRef<AbortController | null>(null);

  const loadMaterials = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setIsMaterialsLoading(true);
    try {
      const data = await getMaterials(controller.signal);
      if (!controller.signal.aborted) {
        setMaterials(data);
        setMaterialsError("");
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setMaterials(EMPTY_MATERIALS);
          setMaterialsError("");
        } else {
          setMaterialsError(extractErrorMessage(error, "저장된 자료를 확인하지 못했습니다."));
        }
      }
    } finally {
      if (!controller.signal.aborted) setIsMaterialsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMaterials();
    return () => requestRef.current?.abort();
  }, [loadMaterials]);

  const status = profileStatus.profile?.status;
  const isChecking = profileStatus.isLoading || (status === "NONE" && isMaterialsLoading);
  const loadError = profileStatus.errorMessage || (status === "NONE" ? materialsError : "");
  const jobRole = materials?.jobRole ?? null;
  const requirement = checkMaterials(materials ?? EMPTY_MATERIALS);
  const hasMaterials = requirement.isSatisfied;
  const canStart = !isChecking && !loadError &&
    (status === "COMPLETED" || (status === "NONE" && hasMaterials));
  // 직무 없이 옛 자료로 시작하는 사용자에게만 직무 선택을 권한다(01 가정 A-7).
  const needsJobSelection = canStart && materials !== null && jobRole === null;

  let guidance = "";
  if (isChecking) guidance = "자료 분석 상태를 확인하고 있어요";
  else if (loadError) guidance = loadError;
  else if (status === "PENDING") guidance = "자료 분석이 끝나면 시작할 수 있어요";
  else if (status === "FAILED" && profileStatus.profile) guidance = getProfileFailureMessage(profileStatus.profile, jobRole);
  else if (status === "NONE") guidance = hasMaterials
    ? "첫 면접은 준비에 몇 분 걸릴 수 있어요"
    : requiresJobTitle(jobRole) ? GENERAL_MATERIAL_GUIDANCE
    : !requirement.hasAnyMaterial
      ? jobRole ? "마이페이지에서 자료를 등록해 주세요" : "마이페이지에서 직무와 자료를 등록해 주세요"
    : !requirement.hasRequiredDocument ? getRequiredDocumentGuidance(jobRole)
    : "GitHub 저장소를 등록해야 면접을 시작할 수 있어요";
  // 다른 안내가 있으면 그 문장을 두고, 마이페이지 이동 링크로 직무 선택을 이끈다.
  if (needsJobSelection && !guidance) guidance = JOB_SELECTION_GUIDANCE;

  return {
    canStart,
    guidance,
    isPortfolioAnalyzing: status === "PENDING",
    showMyPageLink: status === "FAILED" || needsJobSelection ||
      (status === "NONE" && !isChecking && !loadError && !hasMaterials),
    hasLoadError: Boolean(loadError),
    refetch: () => {
      void profileStatus.refetch();
      void loadMaterials();
    },
  };
};
