import { loadSetupDraft, upsertSettingsDraft } from "@/features/interview-page/setting-company/model/draftStore";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useInterviewEligibility } from "@/features/profile/model/useInterviewEligibility";

import {
  COMPANY_SETTING_PATH,
  type SoloInterviewDraft,
} from "@/features/interview-page/setting-company/model/draft";
import {
  INTERVIEW_SETTING_DEFAULT_SELECTION,
  INTERVIEW_STYLE_PRESETS,
  findStylePreset,
  type InterviewSettingSelectHandlers,
} from "@/shared/constants/interview-page/setting-interview";
import type {
  InterviewerPersonality,
  InterviewerTone,
} from "@/shared/constants/interview-page/setting-multi-interview";

export const useInterviewSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 기업 선택에서 돌아오면 히스토리 state에 남겨 둔 설정값으로 다시 채운다.
  const [initialDraft] = useState(() => {
    const draft = loadSetupDraft(new URLSearchParams(location.search).get("draftId"))?.settings;
    return draft?.mode === "SOLO" ? draft : null;
  });
  const [answerMode, setAnswerMode] = useState<"voice" | "text">(
    initialDraft?.answerMode ?? "voice",
  );
  const eligibility = useInterviewEligibility();

  const [selectedDifficulty, setSelectedDifficulty] = useState(
    initialDraft?.difficulty ?? INTERVIEW_SETTING_DEFAULT_SELECTION.difficulty,
  );
  const [personality, setPersonality] = useState<InterviewerPersonality>(
    initialDraft?.personality ?? INTERVIEW_SETTING_DEFAULT_SELECTION.personality,
  );
  const [tone, setTone] = useState<InterviewerTone>(
    initialDraft?.tone ?? INTERVIEW_SETTING_DEFAULT_SELECTION.tone,
  );
  const [interviewerKey, setInterviewerKey] = useState(
    initialDraft?.interviewerKey ?? INTERVIEW_SETTING_DEFAULT_SELECTION.interviewerKey,
  );
  const selectedStyle = findStylePreset({
    difficulty: selectedDifficulty,
    personality,
    tone,
  });

  const handleBack = () => navigate(-1);

  // 기업 선택을 마친 뒤 준비 페이지에서 면접을 생성한다.
  const handleNext = () => {
    if (!eligibility.canStart) {
      return;
    }

    const draft: SoloInterviewDraft = {
      mode: "SOLO",
      difficulty: selectedDifficulty,
      personality,
      tone,
      interviewerKey,
      answerMode,
    };
    try {
      const saved = upsertSettingsDraft(draft, new URLSearchParams(location.search).get("draftId"));
      void Promise.resolve(navigate(`${location.pathname}?draftId=${saved.draftId}`, { replace: true }))
        .then(() => navigate(`${COMPANY_SETTING_PATH}?draftId=${saved.draftId}`));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "설정을 저장하지 못했습니다.");
    }
  };

  const select: InterviewSettingSelectHandlers = {
    difficulty: setSelectedDifficulty,
    interviewer: setInterviewerKey,
    personality: setPersonality,
    tone: setTone,
    style: (value) => {
      const preset = INTERVIEW_STYLE_PRESETS[value];
      setSelectedDifficulty(preset.difficulty);
      setPersonality(preset.personality);
      setTone(preset.tone);
    },
  };

  return {
    answerMode,
    onAnswerModeChange: setAnswerMode,
    isNextDisabled: !eligibility.canStart,
    isPortfolioAnalyzing: eligibility.isPortfolioAnalyzing,
    profileGuidance: eligibility.guidance,
    showMyPageLink: eligibility.showMyPageLink,
    onRefreshProfile: eligibility.hasLoadError ? eligibility.refetch : undefined,
    onBack: handleBack,
    onNext: handleNext,
    select,
    selection: {
      difficulty: selectedDifficulty,
      interviewerKey,
      personality,
      tone,
      style: selectedStyle,
    },
  };
};
