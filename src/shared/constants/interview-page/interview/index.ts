export const INTERVIEW_DEFAULT_QUESTION = {
  id: 'Q1-1',
  text: '리액트 타입스크립트를 함께 사용할때 주의해야 할 점은 무엇이라고 생각하나요?',
} as const;

export const INTERVIEW_STATUS_MESSAGES = {
  voiceUnsupported: '현재 브라우저에서는 음성 인식을 지원하지 않아요.',
  voiceBlocked: '마이크 권한을 허용한 뒤 다시 시도해주세요.',
  voiceIdle: '시작하기를 눌러 음성 답변을 시작해주세요.',
  voiceActive: '음성 답변을 듣고 있어요.',
  voiceCompleting: '음성 답변 정리 중...',
  text: '텍스트로 답변을 작성해주세요.',
} as const;
