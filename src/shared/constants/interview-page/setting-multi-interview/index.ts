import InterviewerImage1 from "@/shared/img/interview-page/interviewer1.svg?url";
import InterviewerImage2 from "@/shared/img/interview-page/interviewer2.svg?url";
import InterviewerImage3 from "@/shared/img/interview-page/interviewer3.svg?url";
import InterviewerImage4 from "@/shared/img/interview-page/interviewer4.svg?url";
import InterviewerImage5 from "@/shared/img/interview-page/interviewer5.svg?url";
import { getVoiceGender } from "@/shared/constants/interview-page/voice-catalog";

import type {
  InterviewerTemplate,
  InterviewerTemplateRole,
} from "./type";

export const TYPE_BY_STYLE = {
  편함: "FRIENDLY",
  일반: "REALISTIC",
  압박: "METICULOUS",
} as const;

export const LEVEL_BY_DIFFICULTY = {
  쉬움: "EASY",
  보통: "NORMAL",
  어려움: "HARD",
} as const;

export const MULTI_INTERVIEWER_TEMPLATES = [
  {
    key: "interviewer-kim",
    name: "김도윤",
    voiceIndex: 1,
    role: "TECH",
    roleLabel: "기술 면접관",
    career: 9,
    gender: getVoiceGender(1),
    image: InterviewerImage1,
    tags: ["논리적 사고", "문제 해결"],
    description: "핵심 내용을 구조적으로 정리하고 깊이 있게 확인합니다.",
  },
  {
    key: "interviewer-lee",
    name: "이서준",
    voiceIndex: 2,
    role: "TECH",
    roleLabel: "기술 면접관",
    career: 8,
    gender: getVoiceGender(2),
    image: InterviewerImage2,
    tags: ["협업", "실행력"],
    description: "경험을 바탕으로 구체적인 판단과 실행 과정을 확인합니다.",
  },
  {
    key: "interviewer-park",
    name: "박지민",
    voiceIndex: 3,
    role: "TECH",
    roleLabel: "기술 면접관",
    career: 6,
    gender: getVoiceGender(3),
    image: InterviewerImage3,
    tags: ["분석력", "성장"],
    description: "현실적인 상황에서의 문제 해결 방식과 성장 가능성을 살펴봅니다.",
  },
  {
    key: "interviewer-choi",
    name: "최유진",
    voiceIndex: 4,
    role: "TECH",
    roleLabel: "기술 면접관",
    career: 8,
    gender: getVoiceGender(4),
    image: InterviewerImage4,
    tags: ["소통", "조직 적합성"],
    description: "지원자의 강점과 협업 방식을 다양한 관점에서 확인합니다.",
  },
  {
    key: "interviewer-han",
    name: "한민석",
    voiceIndex: 5,
    role: "TECH",
    roleLabel: "기술 면접관",
    career: 5,
    gender: getVoiceGender(5),
    image: InterviewerImage5,
    tags: ["동기", "적응력"],
    description: "지원자의 동기와 문제를 끝까지 해결하는 태도를 확인합니다.",
  },
] as const satisfies readonly InterviewerTemplate[];

export const INTERVIEWER_COUNT_OPTIONS = [2, 3, 4] as const;

export const PERSONALITY_OPTIONS = [
  { value: "FRIENDLY", label: "친근한" },
  { value: "METICULOUS", label: "꼼꼼한" },
  { value: "REALISTIC", label: "현실적인" },
] as const;

export const TONE_OPTIONS = [
  { value: "GENTLE", label: "부드러운" },
  { value: "DIRECT", label: "직설적인" },
  { value: "PRESSURING", label: "강압적인" },
] as const;

export const ROLE_OPTIONS = [
  { value: "HR", label: "HR" },
  { value: "DESIGN", label: "Design" },
  { value: "PM", label: "PM" },
  { value: "CEO", label: "CEO" },
] as const;

const ROLE_LABELS: Record<InterviewerTemplateRole, string> = {
  TECH: "기술 면접관",
  HR: "인사 면접관",
  CEO: "대표 면접관",
  PM: "PM 면접관",
  DESIGN: "디자인 면접관",
};

export const getRoleLabel = (role: InterviewerTemplateRole) => ROLE_LABELS[role];

export type {
  InterviewerTemplate,
  InterviewerTemplateRole,
  InterviewerCount,
  InterviewerSlot,
  InterviewerPersonality,
  InterviewerTone,
  SlotIndex,
  MultiInterviewSelection,
  MultiInterviewValidation,
} from "./type";
