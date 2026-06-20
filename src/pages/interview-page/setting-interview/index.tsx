import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  setActiveInterviewSessionId,
  prepareInterview,
  type PersonaType,
} from "@/features/interview-page/interview/api";
import { INTERVIEW_DEFAULT_QUESTION } from "@/shared/constants/interview-page/interview";
import {
  INTERVIEW_SETTING_INTERVIEWERS,
  INTERVIEW_SETTING_OPTION_SECTIONS,
} from "@/shared/constants/interview-page/setting-interview";
import SettingActions from "@/widgets/interview-page/setting-interview/setting-actions";
import SettingContent from "@/widgets/interview-page/setting-interview/setting-content";
import * as S from "@/widgets/interview-page/setting-interview/style";

type InterviewStyleOption =
  (typeof INTERVIEW_SETTING_OPTION_SECTIONS)[0]["options"][number];
type InterviewDifficultyOption =
  (typeof INTERVIEW_SETTING_OPTION_SECTIONS)[1]["options"][number];
type InterviewerId =
  (typeof INTERVIEW_SETTING_INTERVIEWERS)[number]["id"];

const PERSONA_TYPE_BY_STYLE: Record<InterviewStyleOption, PersonaType> = {
  편함: "FRIENDLY",
  일반: "NORMAL",
  압박: "PRESSURE",
};

const SettingInterviewPage = () => {
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] =
    useState<InterviewStyleOption | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<InterviewDifficultyOption | null>(null);
  const [selectedInterviewerId, setSelectedInterviewerId] =
    useState<InterviewerId | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSelectionComplete =
    selectedStyle !== null &&
    selectedDifficulty !== null &&
    selectedInterviewerId !== null;

  const handleBack = () => navigate(-1);

  const handleNext = async () => {
    if (isSubmitting) {
      return;
    }

    if (
      selectedStyle === null ||
      selectedDifficulty === null ||
      selectedInterviewerId === null
    ) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const { data, errorMessage: prepareErrorMessage } = await prepareInterview({
      personaId: selectedInterviewerId,
      personaType: PERSONA_TYPE_BY_STYLE[selectedStyle],
      questions: [
        {
          questionId: 1,
          intention: selectedDifficulty,
          content: INTERVIEW_DEFAULT_QUESTION.text,
        },
      ],
    });

    setIsSubmitting(false);

    if (prepareErrorMessage || !data) {
      setErrorMessage(prepareErrorMessage ?? "면접 준비에 실패했습니다.");
      return;
    }

    setActiveInterviewSessionId(data.sessionId);

    navigate(`/main/interview/${data.currentQuestionIndex + 1}`, {
      state: {
        preparedInterview: data,
        interviewSetting: {
          style: selectedStyle,
          difficulty: selectedDifficulty,
          interviewerId: selectedInterviewerId,
        },
      },
    });
  };

  return (
    <S.Container>
      <S.ContentWrapper>
        <SettingContent
          onDifficultySelect={setSelectedDifficulty}
          onInterviewerSelect={setSelectedInterviewerId}
          onStyleSelect={setSelectedStyle}
          selectedDifficulty={selectedDifficulty}
          selectedInterviewerId={selectedInterviewerId}
          selectedStyle={selectedStyle}
        />
        {errorMessage ? <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage> : null}
        <SettingActions
          isBusy={isSubmitting}
          isNextDisabled={!isSelectionComplete || isSubmitting}
          nextLabel={isSubmitting ? "연결 중..." : undefined}
          onBack={handleBack}
          onNext={handleNext}
        />
      </S.ContentWrapper>
    </S.Container>
  );
};

export default SettingInterviewPage;
