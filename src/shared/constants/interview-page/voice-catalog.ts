import type { InterviewPersonaGender } from "@/features/interview-page/interview/api/type/create-interview";

// Chat 음성 번호와 이미지의 성별을 같은 카탈로그에서 파생한다.
export const VOICE_CATALOG = {
  1: "MALE",
  2: "MALE",
  3: "FEMALE",
  4: "FEMALE",
  5: "MALE",
} as const satisfies Record<number, InterviewPersonaGender>;

export type VoiceIndex = keyof typeof VOICE_CATALOG;

export const getVoiceGender = (voiceIndex: VoiceIndex) => VOICE_CATALOG[voiceIndex];
