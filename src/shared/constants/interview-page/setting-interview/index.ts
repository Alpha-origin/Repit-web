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
    name: '김도윤',
    personaName: '도재현',
    tags: ['차분함', '분석형', '백엔드'],
  },
  {
    id: 2,
    name: '이서윤',
    personaName: '하서율',
    tags: ['친절함', '대화형', '프론트엔드'],
  },
  {
    id: 3,
    name: '박준호',
    personaName: '주이안',
    tags: ['압박형', '직설적', '시스템 설계'],
  },
  {
    id: 4,
    name: '최지안',
    personaName: '윤태린',
    tags: ['꼼꼼함', '실무형', '협업 질문'],
  },
] as const;

export const INTERVIEW_SETTING_ACTION_LABELS = {
  back: '돌아가기',
  next: '면접 시작하기',
} as const;
