import type {
  InterviewSettingOptionSection,
  InterviewSettingSelection,
  InterviewSettingStyleMeta,
  InterviewStyleOption,
  InterviewStylePreset,
} from './type';

export const INTERVIEW_SETTING_OPTION_SECTIONS = [
  {
    key: 'style',
    title: '면접 스타일',
    options: ['편함', '일반', '압박'],
  },
  {
    key: 'difficulty',
    title: '난이도',
    options: ['쉬움', '보통', '어려움'],
  },
] as const satisfies readonly InterviewSettingOptionSection[];

export const INTERVIEW_SETTING_STYLE_META = {
  편함: {
    description: '쉬움 · 친근한 · 부드러운',
    icon: 'smile',
  },
  일반: {
    description: '보통 · 현실적인 · 직설적인',
    icon: 'neutral',
  },
  압박: {
    description: '어려움 · 꼼꼼한 · 강압적인',
    icon: 'pressure',
  },
} as const satisfies Record<InterviewStyleOption, InterviewSettingStyleMeta>;

export const INTERVIEW_STYLE_PRESETS = {
  편함: { difficulty: '쉬움', personality: 'FRIENDLY', tone: 'GENTLE' },
  일반: { difficulty: '보통', personality: 'REALISTIC', tone: 'DIRECT' },
  압박: { difficulty: '어려움', personality: 'METICULOUS', tone: 'PRESSURING' },
} as const satisfies Record<InterviewStyleOption, InterviewStylePreset>;

export const findStylePreset = (value: InterviewStylePreset): InterviewStyleOption | null =>
  INTERVIEW_SETTING_OPTION_SECTIONS[0].options.find((style) => {
    const preset = INTERVIEW_STYLE_PRESETS[style];
    return (
      preset.difficulty === value.difficulty &&
      preset.personality === value.personality &&
      preset.tone === value.tone
    );
  }) ?? null;

export const SOLO_MAJOR_GUIDANCE = '전문 분야는 마이페이지에서 선택한 직무를 따릅니다.';

export const INTERVIEW_SETTING_ACTION_LABELS = {
  back: '돌아가기',
  next: '다음',
  nextToCompany: '다음',
  // 공개 기업이 없으면 기업 선택 단계를 건너뛴다(05-web §3-3 C0-6).
  startWithoutCompanyStep: '면접 시작',
} as const;

export const INTERVIEW_SETTING_DEFAULT_SELECTION: InterviewSettingSelection = {
  difficulty: '쉬움',
  personality: 'FRIENDLY',
  tone: 'GENTLE',
  interviewerKey: 'interviewer-kim',
};

export type {
  InterviewDifficultyOption,
  InterviewSettingSelectHandlers,
  InterviewSettingSelection,
  InterviewStylePreset,
  InterviewSettingStyleIcon,
  InterviewStyleOption,
} from './type';

export const INTERVIEW_ANSWER_MODE_OPTIONS = [
  { value: "voice", label: "영상/음성"},
  { value: "text", label: "텍스트"},
] as const;
