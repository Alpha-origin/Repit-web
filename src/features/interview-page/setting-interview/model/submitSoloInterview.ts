import {
  savePersona,
  type CreateInterviewParams,
  type InterviewLevel,
  type InterviewPersonaRole,
  type SavePersonaParams,
} from "@/features/interview-page/interview/api";
import type {
  SoloInterviewDraft,
} from "@/features/interview-page/setting-company/model/draft";
import type { InterviewDifficultyOption } from "@/shared/constants/interview-page/setting-interview";
import { MULTI_INTERVIEWER_TEMPLATES } from "@/shared/constants/interview-page/setting-multi-interview";
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
  `${personaName}-${crypto.randomUUID()}`;

export const buildSoloInterviewPayload = async (
  draft: SoloInterviewDraft,
): Promise<CreateInterviewParams> => {
  const { difficulty: selectedDifficulty, interviewerKey, personality, tone } = draft;
  const selectedInterviewer = MULTI_INTERVIEWER_TEMPLATES.find(
    (interviewer) => interviewer.key === interviewerKey,
  );

  if (!selectedInterviewer) {
    throw new Error("선택한 면접관 정보를 찾을 수 없습니다.");
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
    throw new Error(savePersonaErrorMessage ?? "페르소나 저장에 실패했습니다.");
  }

  return {
    personaName: personaPayload.personaName,
    type: personaPayload.type,
    career: personaPayload.career,
    gender: personaPayload.gender,
  };
};
