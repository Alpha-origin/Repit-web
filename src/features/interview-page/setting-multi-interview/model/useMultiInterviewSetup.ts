import { loadSetupDraft, upsertSettingsDraft } from "@/features/interview-page/setting-company/model/draftStore";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useInterviewEligibility } from "@/features/profile/model/useInterviewEligibility";
import {
  COMPANY_SETTING_PATH,
  type MultiInterviewDraft,
} from "@/features/interview-page/setting-company/model/draft";
import {
  type InterviewerCount, type InterviewerSlot, type MultiInterviewSelection,
  type SlotIndex,
} from "@/shared/constants/interview-page/setting-multi-interview";
import { INTERVIEW_SETTING_DEFAULT_SELECTION, INTERVIEW_STYLE_PRESETS, type InterviewDifficultyOption, type InterviewStyleOption } from "@/shared/constants/interview-page/setting-interview";
import { createSlot, findMultiStylePreset, resizeSlots, validateSelection } from "./selection";

export const useMultiInterviewSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 기업 선택에서 돌아오면 히스토리 state에 남겨 둔 설정값으로 다시 채운다.
  const [initialDraft] = useState(() => {
    const draft = loadSetupDraft(new URLSearchParams(location.search).get("draftId"))?.settings;
    return draft?.mode === "MULTI" ? draft : null;
  });
  const [answerMode, setAnswerMode] = useState<"voice" | "text">(initialDraft?.answerMode ?? "voice");
  const eligibility = useInterviewEligibility();
  const [difficulty, setDifficulty] = useState<InterviewDifficultyOption>(initialDraft?.difficulty ?? INTERVIEW_SETTING_DEFAULT_SELECTION.difficulty);
  const [activeSlot, setActiveSlot] = useState<SlotIndex>(0);
  const [slots, setSlots] = useState<InterviewerSlot[]>(() => initialDraft?.slots ?? Array.from({ length: 3 }, (_, i) => createSlot(i)));
  const interviewerCount = slots.length as InterviewerCount;
  const style = findMultiStylePreset(slots, difficulty);
  const [errorMessage, setErrorMessage] = useState("");

  const updateSlot = (patch: Partial<InterviewerSlot>) => {
    if (patch.role && (activeSlot === 0 ? patch.role !== "TECH" : patch.role === "TECH")) return;
    if (patch.role && slots.some((slot, index) => index !== activeSlot && slot.role === patch.role)) {
      setErrorMessage("같은 역할을 중복 선택할 수 없습니다.");
      return;
    }
    if (patch.interviewer && slots.some((slot, index) => index !== activeSlot && slot.interviewer?.key === patch.interviewer?.key)) {
      setErrorMessage("같은 면접관을 중복 선택할 수 없습니다.");
      return;
    }
    setSlots((previous) => previous.map((slot, index) => index === activeSlot ? { ...slot, ...patch } : slot));
    setErrorMessage("");
  };

  const changeCount = (count: InterviewerCount) => {
    setSlots((previous) => resizeSlots(previous, count, difficulty));
    setActiveSlot((previous) => Math.min(previous, count - 1) as SlotIndex);
    setErrorMessage("");
  };

  // 1:1과 같은 프리셋을 모든 면접관에게 적용하고, 개별 설정 시 선택값을 다시 계산한다.
  const changeStyle = (next: InterviewStyleOption) => {
    const preset = INTERVIEW_STYLE_PRESETS[next];
    setDifficulty(preset.difficulty);
    setSlots((previous) => previous.map((slot) => ({
      ...slot, personality: preset.personality, tone: preset.tone,
    })));
    setErrorMessage("");
  };

  // 기업 선택을 마친 뒤 준비 페이지에서 면접을 생성한다.
  const handleNext = () => {
    if (!eligibility.canStart) return;
    const validationError = validateSelection(slots, interviewerCount);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage("");
    const draft: MultiInterviewDraft = { mode: "MULTI", style, difficulty, slots, answerMode };
    try {
      const saved = upsertSettingsDraft(draft, new URLSearchParams(location.search).get("draftId"));
      void Promise.resolve(navigate(`${location.pathname}?draftId=${saved.draftId}`, { replace: true }))
        .then(() => navigate(`${COMPANY_SETTING_PATH}?draftId=${saved.draftId}`));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "설정을 저장하지 못했습니다.");
    }
  };

  return {
    answerMode,
    onAnswerModeChange: setAnswerMode,
    errorMessage, isPortfolioAnalyzing: eligibility.isPortfolioAnalyzing,
    profileGuidance: eligibility.guidance,
    showMyPageLink: eligibility.showMyPageLink,
    onRefreshProfile: eligibility.hasLoadError ? eligibility.refetch : undefined,
    isNextDisabled: !eligibility.canStart,
    onBack: () => navigate(-1), onNext: handleNext, updateSlot,
    select: {
      count: changeCount,
      difficulty: (next: InterviewDifficultyOption) => setDifficulty(next),
      slot: (slot: SlotIndex) => {
        if (slot < slots.length) { setActiveSlot(slot); setErrorMessage(""); }
      },
      style: changeStyle,
    },
    selection: { activeSlot, difficulty, slots, style, interviewerCount } satisfies MultiInterviewSelection,
  };
};
