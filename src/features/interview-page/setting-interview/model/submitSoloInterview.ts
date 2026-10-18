import {
  createInterview,
  prepareInterviewRecord,
  savePersona,
  setActiveInterviewSessionId,
  type InterviewLevel,
  type InterviewPersonaRole,
  type SavePersonaParams,
} from "@/features/interview-page/interview/api";
import type {
  SoloInterviewDraft,
  SubmitInterviewResult,
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
  `${personaName}-${Date.now().toString(36)}`;

const fail = (errorMessage: string, requiresMaterials = false): SubmitInterviewResult => ({
  ok: false,
  errorMessage,
  requiresMaterials,
});

export const submitSoloInterview = async (
  draft: SoloInterviewDraft,
): Promise<SubmitInterviewResult> => {
  const { answerMode, difficulty: selectedDifficulty, interviewerKey, personality, tone } = draft;
  const selectedInterviewer = MULTI_INTERVIEWER_TEMPLATES.find(
    (interviewer) => interviewer.key === interviewerKey,
  );

  if (!selectedInterviewer) {
    return fail("선택한 면접관 정보를 찾을 수 없습니다.");
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
    return fail(savePersonaErrorMessage ?? "페르소나 저장에 실패했습니다.");
  }

  const { data, errorMessage: createErrorMessage } = await createInterview({
    personaName: personaPayload.personaName,
    type: personaPayload.type,
    career: personaPayload.career,
    gender: personaPayload.gender,
  });

  if (createErrorMessage || !data) {
    return fail(createErrorMessage ?? "면접 시작에 실패했습니다.");
  }

  const {
    data: preparedInterviewRecord,
    errorMessage: prepareInterviewErrorMessage,
    statusCode,
  } = await prepareInterviewRecord(data.interviewId);

  if (prepareInterviewErrorMessage || !preparedInterviewRecord) {
    return fail(
      prepareInterviewErrorMessage ?? "면접 준비에 실패했습니다.",
      statusCode === 404,
    );
  }

  const interviewSessionId =
    preparedInterviewRecord.sessionId ?? data.sessionId;
  const personaId =
    data.personaId !== null && data.personaId > 0
      ? data.personaId
      : savedPersona.personaId;
  setActiveInterviewSessionId(interviewSessionId);

  return {
    ok: true,
    path: `/main/interview/${data.interviewId}`,
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
  };
};
