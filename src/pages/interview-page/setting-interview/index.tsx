import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const SettingInterviewPage = () => {
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] =
    useState<InterviewStyleOption | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<InterviewDifficultyOption | null>(null);
  const [selectedInterviewerId, setSelectedInterviewerId] =
    useState<InterviewerId | null>(null);

  const isSelectionComplete =
    selectedStyle !== null &&
    selectedDifficulty !== null &&
    selectedInterviewerId !== null;

  const handleBack = () => navigate(-1);

  const handleNext = () => {
    if (!isSelectionComplete) {
      return;
    }

    navigate("/main/interview/1", {
      state: {
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
        <SettingActions
          isNextDisabled={!isSelectionComplete}
          onBack={handleBack}
          onNext={handleNext}
        />
      </S.ContentWrapper>
    </S.Container>
  );
};

export default SettingInterviewPage;
