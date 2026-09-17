import type {
  InterviewSettingInterviewer,
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

export const INTERVIEW_SETTING_INTERVIEWERS = [
  {
    id: 1,
    name: '면접관1',
    personaName: '면접관1',
    tags: ['성격', '말투', '전문 분야'],
    description: '기술적 역량과 아키텍처 설계 능력을 중점적으로 파악합니다.',
  },
  {
    id: 2,
    name: '면접관2',
    personaName: '면접관2',
    tags: ['성격', '말투', '전문 분야'],
    description: '문제 해결 프로세스와 데이터 기반의 의사결정 능력을 평가합니다.',
  },
  {
    id: 3,
    name: '면접관3',
    personaName: '면접관3',
    tags: ['성격', '말투', '전문 분야'],
    description: '사용자 중심의 사고방식과 시각적 커뮤니케이션 능력을 심층 질문합니다.',
  },
  {
    id: 4,
    name: '면접관4',
    personaName: '면접관4',
    tags: ['성격', '말투', '전문 분야'],
    description: '협업 능력과 가치관이 팀의 문화와 얼마나 잘 부합하는지 확인합니다.',
  },
] as const satisfies readonly InterviewSettingInterviewer[];

export const INTERVIEW_SETTING_ACTION_LABELS = {
  back: '돌아가기',
  next: '다음',
} as const;

export const INTERVIEW_SETTING_DEFAULT_SELECTION: InterviewSettingSelection = {
  difficulty: '쉬움',
  interviewerId: 1,
  style: '편함',
};

export type {
  InterviewDifficultyOption,
  InterviewerId,
  InterviewSettingSelectHandlers,
  InterviewSettingSelection,
  InterviewSettingStyleIcon,
  InterviewStyleOption,
} from './type';
