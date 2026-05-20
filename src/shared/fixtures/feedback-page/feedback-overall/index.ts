export const FEEDBACK_OVERALL_CONTENT = {
  topSection: {
    tabs: {
      overallLabel: "종합피드백",
      detailLabel: "상세피드백",
      activeTab: "overall",
    },
    summary: {
      title: "종합 점수",
      score: 82,
      description: [
        "전반적으로 좋은 면접 점수입니다.",
        "기술적 역량과 커뮤니케이션 능력이 우수합니다.",
      ],
    },
    averageComparison: {
      title: "평균 점수 대비 42점 높아요!",
      bars: [
        {
          label: "응시자 평균",
          score: 40,
          tone: "muted",
        },
        {
          label: "내 점수",
          score: 82,
          tone: "primary",
        },
      ],
    },
    comparisonCards: [
      {
        title: "이전 면접",
        bars: [
          {
            label: "응시자 평균",
            score: 40,
            tone: "muted",
          },
          {
            label: "내 점수",
            score: 72,
            tone: "primary",
          },
        ],
      },
      {
        title: "이번 면접",
        highlightText: "14% 상승했어요",
        bars: [
          {
            label: "이전 면접 점수",
            score: 72,
            tone: "muted",
          },
          {
            label: "내 점수",
            score: 82,
            tone: "primary",
          },
        ],
      },
    ],
  },
  middleSection: {
    cards: [
      {
        title: "강점",
        content:
          "면접의 흐름을 안정적으로 이끌었고, 핵심 질문에 대한 답변이 명확했습니다. 특히 프로젝트 경험을 설명할 때 구조가 분명해 전달력이 좋았습니다.",
      },
      {
        title: "보완점",
        content:
          "일부 답변에서 구체적인 수치나 결과 예시가 부족했습니다. 강점을 말할 때는 실제 경험과 성과를 조금 더 붙여주면 설득력이 더 높아집니다.",
      },
    ],
  },
  bottomSection: {
    reliability: {
      title: "응답신뢰성",
      scoreLabel: "99%",
      levelLabel: "높음",
    },
    questionFit: {
      title: "질문 의도 적합도",
      content:
        "질문에서 요구한 역량과 상황을 대체로 잘 파악했습니다. 답변의 방향성은 적절했고, 일부 문항만 조금 더 직접적으로 결론을 먼저 말하면 더 좋습니다.",
    },
    keywords: {
      items: [
        {
          text: "네",
          size: "xl",
          top: "18%",
          left: "58%",
        },
        {
          text: "아",
          size: "xl",
          top: "48%",
          left: "48%",
        },
        {
          text: "프로젝트",
          size: "md",
          top: "44%",
          left: "22%",
        },
        {
          text: "프론트",
          size: "sm",
          top: "48%",
          left: "78%",
        },
        {
          text: "협업",
          size: "sm",
          top: "72%",
          left: "16%",
        },
        {
          text: "백엔드",
          size: "sm",
          top: "82%",
          left: "40%",
        },
        {
          text: "개발",
          size: "md",
          top: "77%",
          left: "68%",
        },
        {
          text: "디자인",
          size: "xs",
          top: "12%",
          left: "46%",
        },
      ],
    },
  },
} as const;
