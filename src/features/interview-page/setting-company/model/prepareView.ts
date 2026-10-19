import type { CreatedInterviewData, PreparedInterviewData } from "@/features/interview-page/interview/api";
import { MULTI_INTERVIEWER_TEMPLATES, LEVEL_BY_DIFFICULTY } from "@/shared/constants/interview-page/setting-multi-interview";
import { completeSlot } from "@/features/interview-page/setting-multi-interview/model/selection";
import type { InterviewDraft } from "./draft";

export const buildPreparedView = (settings: InterviewDraft, data: CreatedInterviewData): PreparedInterviewData => {
  const interviewers = settings.mode === "MULTI" ? settings.slots.map(completeSlot) : (() => {
    const template = MULTI_INTERVIEWER_TEMPLATES.find((item) => item.key === settings.interviewerKey);
    if (!template) throw new Error("선택한 면접관을 확인해주세요.");
    return [{ ...template, personality: settings.personality, tone: settings.tone }];
  })();
  if (data.mode !== settings.mode || data.personaIds.length !== interviewers.length) throw new Error("면접관 정보를 확인하지 못했습니다.");
  const first = interviewers[0];
  return {
    interviewId: data.interviewId, userId: data.userId, sessionId: data.sessionId,
    company: data.company, mode: data.mode, answerMode: settings.answerMode,
    personaId: data.personaIds[0], personaName: first.name, role: first.role,
    major: null, type: first.personality, personaType: first.personality,
    level: LEVEL_BY_DIFFICULTY[settings.difficulty], career: settings.mode === "SOLO" ? ({ 쉬움: 0, 보통: 3, 어려움: 5 }[settings.difficulty]) : first.career,
    gender: first.gender, tone: first.tone, jobId: "",
    status: data.status, currentQuestionIndex: data.currentQuestionIndex, questions: [],
    interviewers: interviewers.map((item, index) => ({
      personaId: data.personaIds[index], name: item.name, roleLabel: item.roleLabel,
      image: item.image, gender: item.gender, voiceIndex: item.voiceIndex,
      personaType: item.personality, tone: item.tone, level: LEVEL_BY_DIFFICULTY[settings.difficulty],
    })),
  };
};
