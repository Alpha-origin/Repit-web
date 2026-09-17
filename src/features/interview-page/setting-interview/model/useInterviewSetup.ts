import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createInterview,
  prepareInterviewRecord,
  savePersona,
  setActiveInterviewSessionId,
  type CreateInterviewPersonaType,
  type InterviewLevel,
  type InterviewPersonaGender,
  type InterviewPersonaMajor,
  type InterviewPersonaRole,
  type InterviewTone,
  type SavePersonaParams,
} from "@/features/interview-page/interview/api";
import {
  INTERVIEW_SETTING_DEFAULT_SELECTION,
  INTERVIEW_SETTING_INTERVIEWERS,
  type InterviewDifficultyOption,
  type InterviewerId,
  type InterviewSettingSelectHandlers,
  type InterviewStyleOption,
} from "@/shared/constants/interview-page/setting-interview";
import InterviewerImage1 from "@/shared/img/interview-page/interviewer1.svg?url";
import InterviewerImage2 from "@/shared/img/interview-page/interviewer2.svg?url";
import InterviewerImage3 from "@/shared/img/interview-page/interviewer3.svg?url";
import InterviewerImage4 from "@/shared/img/interview-page/interviewer4.svg?url";

const TYPE_BY_STYLE: Record<InterviewStyleOption, CreateInterviewPersonaType> = {
  편함: "FRIENDLY",
  일반: "REALISTIC",
  압박: "METICULOUS",
};

const TONE_BY_STYLE: Record<InterviewStyleOption, InterviewTone> = {
  편함: "GENTLE",
  일반: "DIRECT",
  압박: "PRESSURING",
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

const INTERVIEWER_IMAGES: Record<InterviewerId, string> = {
  1: InterviewerImage1,
  2: InterviewerImage2,
  3: InterviewerImage3,
  4: InterviewerImage4,
};

const INTERVIEWER_PROFILE_BY_ID: Record<
  InterviewerId,
  { gender: InterviewPersonaGender; major: InterviewPersonaMajor }
> = {
  1: { gender: "MALE", major: "BACKEND" },
  2: { gender: "MALE", major: "FRONTEND" },
  3: { gender: "FEMALE", major: "FRONTEND" },
  4: { gender: "FEMALE", major: "BACKEND" },
};

const DEFAULT_INTERVIEW_ROLE: InterviewPersonaRole = "TECH";

const buildUniquePersonaName = (personaName: string) =>
  `${personaName}-${Date.now().toString(36)}`;

export const useInterviewSetup = () => {
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.style,
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.difficulty,
  );
  const [selectedInterviewerId, setSelectedInterviewerId] = useState<InterviewerId>(
    INTERVIEW_SETTING_DEFAULT_SELECTION.interviewerId,
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

    const selectedInterviewer = INTERVIEW_SETTING_INTERVIEWERS.find(
      (interviewer) => interviewer.id === selectedInterviewerId,
    );

    if (!selectedInterviewer) {
      setIsSubmitting(false);
      setErrorMessage("선택한 면접관 정보를 찾을 수 없습니다.");
      return;
    }

    const interviewerProfile = INTERVIEWER_PROFILE_BY_ID[selectedInterviewerId];
    const personaPayload: SavePersonaParams = {
      personaName: buildUniquePersonaName(selectedInterviewer.personaName),
      role: DEFAULT_INTERVIEW_ROLE,
      level: LEVEL_BY_DIFFICULTY[selectedDifficulty],
      major: interviewerProfile.major,
      type: TYPE_BY_STYLE[selectedStyle],
      career: CAREER_BY_DIFFICULTY[selectedDifficulty],
      gender: interviewerProfile.gender,
      tone: TONE_BY_STYLE[selectedStyle],
      imageUrl: INTERVIEWER_IMAGES[selectedInterviewerId],
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
      major: personaPayload.major,
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
          level: personaPayload.level,
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
              name: selectedInterviewer.name,
              roleLabel: "기술 면접관",
              image: INTERVIEWER_IMAGES[selectedInterviewerId],
              gender: personaPayload.gender,
              voiceIndex: selectedInterviewerId,
              personaType: personaPayload.type,
              tone: personaPayload.tone,
              level: personaPayload.level,
            },
          ],
        },
        interviewSetting: {
          style: selectedStyle,
          difficulty: selectedDifficulty,
          interviewerId: selectedInterviewerId,
        },
      },
    });
  };

  const select: InterviewSettingSelectHandlers = {
    difficulty: setSelectedDifficulty,
    interviewer: setSelectedInterviewerId,
    style: setSelectedStyle,
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
      interviewerId: selectedInterviewerId,
      style: selectedStyle,
    },
  };
};
