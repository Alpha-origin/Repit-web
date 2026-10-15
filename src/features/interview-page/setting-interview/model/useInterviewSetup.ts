import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useInterviewEligibility } from "@/features/profile/model/useInterviewEligibility";

import {
  createInterview,
  prepareInterviewRecord,
  savePersona,
  setActiveInterviewSessionId,
  type InterviewLevel,
  type InterviewPersonaRole,
  type SavePersonaParams,
} from "@/features/interview-page/interview/api";
import {
  INTERVIEW_SETTING_DEFAULT_SELECTION,
  INTERVIEW_STYLE_PRESETS,
  findStylePreset,
  type InterviewDifficultyOption,
  type InterviewSettingSelectHandlers,
} from "@/shared/constants/interview-page/setting-interview";
import {
  MULTI_INTERVIEWER_TEMPLATES,
  type InterviewerPersonality,
  type InterviewerTone,
} from "@/shared/constants/interview-page/setting-multi-interview";
import { getVoiceGender } from "@/shared/constants/interview-page/voice-catalog";

const CAREER_BY_DIFFICULTY: Record<InterviewDifficultyOption, number> = {
  쉬움: 0,
  보통: 3,
  어려움: 5,
};

const LEVEL_BY_DIFFICULTY: Record<InterviewDifficultyOption, InterviewLevel> = {
  쉬움: "EASY",
  보통: "NORMAL",
  어려움: "HARD",
};

const DEFAULT_INTERVIEW_ROLE: InterviewPersonaRole = "TECH";

const buildUniquePersonaName = (personaName: string) =>
  `${personaName}-${Date.now().toString(36)}`;

export const useInterviewSetup = () => {
  const navigate = useNavigate();
  const [answerMode, setAnswerMode] = useState<"voice" | "text">("voice");
  const eligibility = useInterviewEligibility();
  const [requiresMaterials, setRequiresMaterials] = useState(false);

  const [selectedDifficulty, setSelectedDifficulty] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.difficulty,
  );
  const [personality, setPersonality] = useState<InterviewerPersonality>(
    INTERVIEW_SETTING_DEFAULT_SELECTION.personality,
  );
  const [tone, setTone] = useState<InterviewerTone>(
    INTERVIEW_SETTING_DEFAULT_SELECTION.tone,
  );
  const [interviewerKey, setInterviewerKey] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.interviewerKey,
  );
  const selectedStyle = findStylePreset({
    difficulty: selectedDifficulty,
    personality,
    tone,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => navigate(-1);

  const handleNext = async () => {
    if (isSubmitting || !eligibility.canStart) {
      return;
    }

    setErrorMessage("");
    setRequiresMaterials(false);
    setIsSubmitting(true);

    const selectedInterviewer = MULTI_INTERVIEWER_TEMPLATES.find(
      (interviewer) => interviewer.key === interviewerKey,
    );

    if (!selectedInterviewer) {
      setIsSubmitting(false);
      setErrorMessage("선택한 면접관 정보를 찾을 수 없습니다.");
      return;
    }

    const personaPayload: SavePersonaParams = {
      personaName: buildUniquePersonaName(selectedInterviewer.name),
      role: DEFAULT_INTERVIEW_ROLE,
      level: LEVEL_BY_DIFFICULTY[selectedDifficulty],
      type: personality,
      career: CAREER_BY_DIFFICULTY[selectedDifficulty],
      gender: getVoiceGender(selectedInterviewer.voiceIndex),
      voiceIndex: selectedInterviewer.voiceIndex,
      tone,
      imageUrl: selectedInterviewer.image,
      description: selectedInterviewer.description,
    };

    const { data: savedPersona, errorMessage: savePersonaErrorMessage } =
      await savePersona(personaPayload);

    if (savePersonaErrorMessage || !savedPersona) {
      setIsSubmitting(false);
      setErrorMessage(
        savePersonaErrorMessage ?? "페르소나 저장에 실패했습니다.",
      );
      return;
    }

    const { data, errorMessage: createErrorMessage } = await createInterview({
      personaName: personaPayload.personaName,
      type: personaPayload.type,
      career: personaPayload.career,
      gender: personaPayload.gender,
    });

    if (createErrorMessage || !data) {
      setIsSubmitting(false);
      setErrorMessage(createErrorMessage ?? "면접 시작에 실패했습니다.");
      return;
    }

    const {
      data: preparedInterviewRecord,
      errorMessage: prepareInterviewErrorMessage,
      statusCode,
    } = await prepareInterviewRecord(data.interviewId);

    if (prepareInterviewErrorMessage || !preparedInterviewRecord) {
      setRequiresMaterials(statusCode === 404);
      setIsSubmitting(false);
      setErrorMessage(
        prepareInterviewErrorMessage ?? "면접 준비에 실패했습니다.",
      );
      return;
    }

    const interviewSessionId =
      preparedInterviewRecord.sessionId ?? data.sessionId;
    const personaId =
      data.personaId !== null && data.personaId > 0
        ? data.personaId
        : savedPersona.personaId;
    setActiveInterviewSessionId(interviewSessionId);
    setIsSubmitting(false);

    navigate(`/main/interview/${data.interviewId}`, {
      state: {
        preparedInterview: {
          sessionId: interviewSessionId,
          interviewId: preparedInterviewRecord.interviewId,
          userId: data.userId,
          personaId,
          personaName: personaPayload.personaName,
          role: personaPayload.role,
          major: savedPersona.major,
          type: personaPayload.type,
          personaType: personaPayload.type,
          level: personaPayload.level,
          career: personaPayload.career,
          gender: personaPayload.gender,
          tone: personaPayload.tone,
          jobId: preparedInterviewRecord.jobId ?? "",
          analysisJobId: preparedInterviewRecord.analysisJobId,
          questionPreparationStatus: preparedInterviewRecord.status,
          status: data.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
          currentQuestionIndex: data.currentQuestionIndex,
          questions: [],
          mode: "SOLO",
          answerMode,
          interviewers: [
            {
              personaId,
              name: selectedInterviewer.name,
              roleLabel: "기술 면접관",
              image: selectedInterviewer.image,
              gender: personaPayload.gender,
              voiceIndex: selectedInterviewer.voiceIndex,
              personaType: personaPayload.type,
              tone: personaPayload.tone,
              level: personaPayload.level,
            },
          ],
        },
      },
    });
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
    errorMessage,
    isNextDisabled: isSubmitting || !eligibility.canStart,
    isPortfolioAnalyzing: eligibility.isPortfolioAnalyzing,
    profileGuidance: eligibility.guidance,
    showMyPageLink: eligibility.showMyPageLink || requiresMaterials,
    onRefreshProfile: eligibility.hasLoadError ? eligibility.refetch : undefined,
    isSubmitting,
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
