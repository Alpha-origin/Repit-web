import {
  getRoleLabel,
  INTERVIEWER_COUNT_OPTIONS,
  PERSONALITY_OPTIONS,
  TONE_OPTIONS,
  ROLE_OPTIONS,
  type InterviewerCount,
  type InterviewerSlot,
} from "@/shared/constants/interview-page/setting-multi-interview";

export const createSlot = (index: number): InterviewerSlot => ({
  interviewer: null,
  role: index === 0 ? "TECH" : null,
  personality: "FRIENDLY",
  tone: "GENTLE",
  major: "BACKEND",
});

export const resizeSlots = (slots: InterviewerSlot[], count: InterviewerCount) =>
  Array.from({ length: count }, (_, index) => slots[index] ?? createSlot(index));

export const validateSelection = (slots: InterviewerSlot[], count: InterviewerCount) => {
  if (!INTERVIEWER_COUNT_OPTIONS.includes(count) || slots.length !== count) {
    return "면접관은 2명부터 4명까지 설정해주세요.";
  }
  if (slots.some((slot) => !slot.interviewer || !slot.role)) {
    return `면접관 ${count}명의 설정을 모두 완료해주세요.`;
  }
  if (slots[0].role !== "TECH" || slots.slice(1).some((slot) =>
    !ROLE_OPTIONS.some((option) => option.value === slot.role))) {
    return "첫 번째 면접관은 기술 역할로 설정해주세요.";
  }
  if (new Set(slots.map((slot) => slot.interviewer?.key)).size !== count) {
    return "같은 면접관을 중복 선택할 수 없습니다.";
  }
  if (new Set(slots.map((slot) => slot.role)).size !== count) {
    return "같은 역할을 중복 선택할 수 없습니다.";
  }
  if (slots.some((slot) =>
    !PERSONALITY_OPTIONS.some((option) => option.value === slot.personality) ||
    !TONE_OPTIONS.some((option) => option.value === slot.tone) ||
    (slot.role === "TECH" && !["BACKEND", "FRONTEND"].includes(slot.major)))) {
    return "면접관의 성격, 말투와 전문 분야를 확인해주세요.";
  }
  return null;
};

export const completeSlot = (slot: InterviewerSlot) => {
  if (!slot.interviewer || !slot.role) throw new Error("면접관 설정을 완료해주세요.");
  const roleLabel = getRoleLabel(slot.role);
  return {
    ...slot.interviewer,
    role: slot.role,
    roleLabel,
    major: slot.role === "TECH" ? slot.major : undefined,
    personality: slot.personality,
    tone: slot.tone,
    description: `${roleLabel}의 관점에서 지원자의 경험과 역량을 평가합니다.`,
  };
};
