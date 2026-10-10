import type {
  InterviewSettingOptionSection,
  InterviewSettingSelection,
  InterviewSettingStyleMeta,
  InterviewStyleOption,
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
    description: '친절하고 편안한 분위기',
    icon: 'smile',
  },
  일반: {
    description: '실전과 비슷한 일반 면접 수준',
    icon: 'neutral',
  },
  압박: {
    description: '긴장감 넘치는 압박 면접',
    icon: 'pressure',
  },
} as const satisfies Record<InterviewStyleOption, InterviewSettingStyleMeta>;

export const INTERVIEW_SETTING_INTERVIEWER_SECTION_TITLE = '면접관 설정';

export const INTERVIEW_SETTING_PERSONALITY_OPTIONS = [
  '친근한',
  '현실적인',
  '꼼꼼한',
] as const;

export const INTERVIEW_SETTING_TONE_OPTIONS = [
  '부드러운',
  '직설적인',
  '압박하는',
] as const;

export const INTERVIEW_SETTING_MAJOR_OPTIONS = ['프론트엔드', '백엔드'] as const;

export const INTERVIEW_SETTING_ACTION_LABELS = {
  back: '돌아가기',
  next: '다음',
} as const;

export const INTERVIEW_SETTING_DEFAULT_SELECTION: InterviewSettingSelection = {
  difficulty: '쉬움',
  major: '프론트엔드',
  personality: '친근한',
  style: '편함',
  tone: '부드러운',
};

export type {
  InterviewMajorOption,
  InterviewDifficultyOption,
  InterviewerPersonalityOption,
  InterviewerToneOption,
  InterviewSettingSelectHandlers,
  InterviewSettingSelection,
  InterviewSettingStyleIcon,
  InterviewStyleOption,
} from './type';

export const INTERVIEW_ANSWER_MODE_OPTIONS = [
  { value: "voice", label: "음성/영상 면접", description: "카메라와 마이크로 답변합니다. 전체 영상과 답변 음성이 저장됩니다. 답변은 210초에 자동 완료됩니다." },
  { value: "text", label: "단순 텍스트 면접", description: "장치 권한 없이 글로 답변합니다. 영상과 음성은 녹화하지 않습니다." },
] as const;
