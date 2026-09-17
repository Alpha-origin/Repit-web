import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createInterview,
  prepareInterviewRecord,
  savePersona,
  setActiveInterviewSessionId,
  type CreateInterviewPersonaType,
  type InterviewPersonaGender,
  type InterviewLevel,
  type InterviewPersonaMajor,
  type InterviewPersonaRole,
  type InterviewTone,
  type SavePersonaParams,
} from "@/features/interview-page/interview/api";
import {
  INTERVIEW_SETTING_DEFAULT_SELECTION,
  type InterviewMajorOption,
  type InterviewDifficultyOption,
  type InterviewerPersonalityOption,
  type InterviewerToneOption,
  type InterviewSettingSelectHandlers,
} from "@/shared/constants/interview-page/setting-interview";
import InterviewerOneImage from "@/shared/img/interview-page/interviewer1.svg?url";
import InterviewerFrontendImage from "@/shared/img/interview-page/interviewer2.svg?url";

const TONE_BY_OPTION: Record<
  InterviewerToneOption,
  InterviewTone
> = {
  부드러운: "GENTLE",
  직설적인: "DIRECT",
  압박하는: "PRESSURING",
};

const TYPE_BY_PERSONALITY: Record<
  InterviewerPersonalityOption,
  CreateInterviewPersonaType
> = {
  친근한: "FRIENDLY",
  현실적인: "REALISTIC",
  꼼꼼한: "METICULOUS",
};

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

const MAJOR_BY_OPTION: Record<InterviewMajorOption, InterviewPersonaMajor> = {
  프론트엔드: "FRONTEND",
  백엔드: "BACKEND",
};

// 면접관 카드 선택이 사라지면서, 이미지와 소개 문구는 전문 분야에서 파생한다.
const INTERVIEWER_IMAGE_BY_MAJOR: Record<InterviewMajorOption, string> = {
  프론트엔드: InterviewerFrontendImage,
  백엔드: InterviewerOneImage,
};

const INTERVIEWER_DESCRIPTION_BY_MAJOR: Record<InterviewMajorOption, string> = {
  프론트엔드:
    "사용자 중심의 사고방식과 시각적 커뮤니케이션 능력을 심층 질문합니다.",
  백엔드: "기술적 역량과 아키텍처 설계 능력을 중점적으로 파악합니다.",
};

const DEFAULT_INTERVIEW_ROLE: InterviewPersonaRole = "TECH";

const buildUniquePersonaName = () =>
  `맞춤 면접관-${Date.now().toString(36)}`;

export const useInterviewSetup = () => {
  const navigate = useNavigate();

  const [selectedStyle, setSelectedStyle] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.style,
  );

  const [selectedDifficulty, setSelectedDifficulty] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.difficulty,
  );

  const [selectedPersonality, setSelectedPersonality] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.personality,
  );

  const [selectedTone, setSelectedTone] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.tone,
  );

  const [selectedMajor, setSelectedMajor] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.major,
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => navigate(-1);

  const handleNext = async () => {
    if (isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const isPressureInterview = selectedStyle === "압박";
    const interviewerGender: InterviewPersonaGender = isPressureInterview
      ? "MALE"
      : "FEMALE";
    const interviewerImage = isPressureInterview
      ? InterviewerOneImage
      : INTERVIEWER_IMAGE_BY_MAJOR[selectedMajor];

    const personaPayload: SavePersonaParams = {
      personaName: buildUniquePersonaName(),
      role: DEFAULT_INTERVIEW_ROLE,
      level: LEVEL_BY_DIFFICULTY[selectedDifficulty],
      major: MAJOR_BY_OPTION[selectedMajor],
      type: TYPE_BY_PERSONALITY[selectedPersonality],
      career: CAREER_BY_DIFFICULTY[selectedDifficulty],
      gender: interviewerGender,
      tone: TONE_BY_OPTION[selectedTone],
      imageUrl: interviewerImage,
      description: INTERVIEWER_DESCRIPTION_BY_MAJOR[selectedMajor],
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

    const interviewPayload = {
      personaName: personaPayload.personaName,
      major: MAJOR_BY_OPTION[selectedMajor],
      type: personaPayload.type,
      career: personaPayload.career,
      gender: personaPayload.gender,
    };
    //repit-dp

    const { data, errorMessage: createErrorMessage } =
      await createInterview(interviewPayload);

    if (createErrorMessage || !data) {
      setIsSubmitting(false);
      setErrorMessage(createErrorMessage ?? "면접 시작에 실패했습니다.");
      return;
    }

    const {
      data: preparedInterviewRecord,
      errorMessage: prepareInterviewErrorMessage,
    } = await prepareInterviewRecord(data.interviewId);

    if (prepareInterviewErrorMessage || !preparedInterviewRecord) {
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
          major: personaPayload.major,
          type: personaPayload.type,
          personaType: personaPayload.type,
          level: LEVEL_BY_DIFFICULTY[selectedDifficulty],
          career: personaPayload.career,
          gender: personaPayload.gender,
          tone: personaPayload.tone,
          jobId: preparedInterviewRecord.jobId ?? "",
          status: data.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
          currentQuestionIndex: data.currentQuestionIndex,
          questions: [],
          mode: "SOLO",
          interviewers: [
            {
              personaId,
              name: personaPayload.personaName,
              roleLabel: "기술 면접관",
              image: personaPayload.imageUrl,
              gender: personaPayload.gender,
            },
          ],
        },
        interviewSetting: {
          style: selectedStyle,
          difficulty: selectedDifficulty,
          major: selectedMajor,
          personality: selectedPersonality,
          tone: selectedTone,
        },
      },
    });
  };

  const select: InterviewSettingSelectHandlers = {
    difficulty: setSelectedDifficulty,
    major: setSelectedMajor,
    personality: setSelectedPersonality,
    style: setSelectedStyle,
    tone: setSelectedTone,
  };

  return {
    errorMessage,
    isNextDisabled: isSubmitting,
    isPortfolioAnalyzing: false,
    isSubmitting,
    onBack: handleBack,
    onNext: handleNext,
    select,
    selection: {
      difficulty: selectedDifficulty,
      major: selectedMajor,
      personality: selectedPersonality,
      style: selectedStyle,
      tone: selectedTone,
    },
  };
};
