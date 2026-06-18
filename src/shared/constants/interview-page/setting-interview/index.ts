export const INTERVIEW_SETTING_OPTION_SECTIONS = [
  {
    key: 'style',
    title: '면접 스타일',
    options: ['편함', '일반', '압박'],
  },
  {
    key: 'difficulty',
    title: '면접 난이도',
    options: ['쉬움', '보통', '어려움'],
  },
] as const;

export const INTERVIEW_SETTING_INTERVIEWER_SECTION_TITLE = '면접관';

export const INTERVIEW_SETTING_INTERVIEWERS = [
  {
    id: 1,
    name: '면접관1',
    tags: ['성격', '말투', '전문분야'],
  },
  {
    id: 2,
    name: '면접관2',
    tags: ['성격', '말투', '전문분야'],
  },
  {
    id: 3,
    name: '면접관3',
    tags: ['성격', '말투', '전문분야'],
  },
  {
    id: 4,
    name: '면접관4',
    tags: ['성격', '말투', '전문분야'],
  },
] as const;

export const INTERVIEW_SETTING_ACTION_LABELS = {
  back: '돌아가기',
  next: '다음',
} as const;
