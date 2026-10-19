export const MAIN_PAGE_INTERVIEW_MODE_CARDS = [
  {
    id: "one-to-one",
    badge: "도전하기",
    title: "1:1 면접하기",
    aiBadge: "AI",
    description: "돌발 상황에도 유연하게 대응하고 싶은 취업 준비생",
    features: [
      {
        description: "면접데이터를 이용한",
        title: "성장 추적",
      },
      {
        description: "다양한",
        title: "꼬리질문",
      },
      {
        description: "분석 Ai를 통한",
        title: "피드백",
      },
    ],
    startButton: "면접 시작하기",
    isComingSoon: false,
  },
  {
    id: "n-to-one",
    badge: "실전체험",
    title: "N:1 면접하기",
    aiBadge: "AI",
    description: "실제 면접 분위기와 가장 유사한 실전형 면접",
    features: [
      {
        description: "여러 면접관이 동시에!",
        title: "실제 면접 분위기",
      },
      {
        description: "여러 관점에서",
        title: "다각도 질문",
      },
      {
        description: "유사한 환경",
        title: "실전 압박감",
      },
    ],
    startButton: "면접 시작하기",
    isComingSoon: false,
  },
] as const;

export type MainPageInterviewModeId =
  (typeof MAIN_PAGE_INTERVIEW_MODE_CARDS)[number]["id"];

export const MAIN_PAGE_COMING_SOON_LABEL = "준비중인 기능입니다";

export const MAIN_PAGE_GUIDE_ROUTE = "/interview-guide";
