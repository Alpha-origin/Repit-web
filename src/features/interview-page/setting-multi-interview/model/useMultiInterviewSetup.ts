import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useInterviewEligibility } from "@/features/profile/model/useInterviewEligibility";
import {
  COMPANY_SETTING_PATH,
  readInterviewDraft,
  type MultiInterviewDraft,
} from "@/features/interview-page/setting-company/model/draft";
import {
  type InterviewerCount, type InterviewerSlot, type MultiInterviewSelection,
  type SlotIndex,
} from "@/shared/constants/interview-page/setting-multi-interview";
import { INTERVIEW_SETTING_DEFAULT_SELECTION, type InterviewDifficultyOption, type InterviewStyleOption } from "@/shared/constants/interview-page/setting-interview";
import { createSlot, resizeSlots, validateSelection } from "./selection";

export const useMultiInterviewSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 기업 선택에서 돌아오면 히스토리 state에 남겨 둔 설정값으로 다시 채운다.
  const [initialDraft] = useState(() => {
    const draft = readInterviewDraft(location.state);
    return draft?.mode === "MULTI" ? draft : null;
  });
  const [answerMode, setAnswerMode] = useState<"voice" | "text">(initialDraft?.answerMode ?? "voice");
  const eligibility = useInterviewEligibility();
  const [style, setStyle] = useState<InterviewStyleOption>(initialDraft?.style ?? "편함");
  const [difficulty, setDifficulty] = useState<InterviewDifficultyOption>(initialDraft?.difficulty ?? INTERVIEW_SETTING_DEFAULT_SELECTION.difficulty);
  const [activeSlot, setActiveSlot] = useState<SlotIndex>(0);
  const [slots, setSlots] = useState<InterviewerSlot[]>(() => initialDraft?.slots ?? Array.from({ length: 3 }, (_, i) => createSlot(i)));
  const interviewerCount = slots.length as InterviewerCount;
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
    setSlots((previous) => resizeSlots(previous, count));
    setActiveSlot((previous) => Math.min(previous, count - 1) as SlotIndex);
    setErrorMessage("");
  };

  // 면접 스타일은 난이도와 같은 독립 설정값이다.
  // 면접관별 성격·말투는 슬롯이 직접 들고 있으므로 여기서 건드리지 않는다.
  const changeStyle = (next: InterviewStyleOption) => {
    setStyle(next);
    setErrorMessage("");
  };

  // 면접 생성은 다음 단계(기업 선택)의 "면접 시작"에서 한다.
  const handleNext = () => {
    if (!eligibility.canStart) return;
    const validationError = validateSelection(slots, interviewerCount);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage("");
    const draft: MultiInterviewDraft = { mode: "MULTI", style, difficulty, slots, answerMode };
    // 현재 항목에 draft를 먼저 남겨야 돌아왔을 때 선택이 유지된다. 두 이동이 겹치지 않게 순서대로 한다.
    void Promise.resolve(
      navigate(location.pathname, { replace: true, state: { draft } }),
    ).then(() => navigate(COMPANY_SETTING_PATH, { state: { draft } }));
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
