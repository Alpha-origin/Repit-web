import type {
  FeedbackData,
  InterviewSummary,
  QuestionFeedback,
} from "@/features/feedback-page/feedback-list/api/getAllInterviews";
import type {
  FeedbackOverallBottomSectionData,
  FeedbackOverallMiddleSectionData,
  FeedbackOverallTopSectionData,
} from "@/widgets/feedback-page/feedback-overall/type";
import type {
  FeedbackDetailBottomSectionData,
  FeedbackDetailMiddleSectionData,
  FeedbackDetailTopSectionData,
} from "@/widgets/feedback-page/feedback-detail/type";

const getScore = (score?: number) =>
  typeof score === "number" && Number.isFinite(score) ? score : 0;

const getText = (value?: string, fallback = "내용이 아직 없습니다.") =>
  value?.trim() || fallback;

const getListText = (items?: string[], fallback = "내용이 아직 없습니다.") =>
  items && items.length > 0 ? items.join(" ") : fallback;

const getReliabilityLevel = (score: number) => {
  if (score >= 80) {
    return "높음";
  }

  if (score >= 50) {
    return "보통";
  }

  return "낮음";
};

const getFeedbackQuestion = (
  item: QuestionFeedback,
  index: number,
  personaLabel?: string,
) => ({
  id: index + 1,
  label: `Q${index + 1}`,
  preview: getText(item.questionContent),
  personaLabel,
  question: getText(item.questionContent),
  intention: getText(item.intention),
  myAnswer: getText(item.userAnswer, "작성된 답변이 없습니다."),
  modelAnswer: getText(item.modelAnswer),
  followUpQuestion: getListText(
    item.improvements,
    "이 질문에 대한 추가 피드백이 아직 없습니다.",
  ),
});

export const getFeedbackStatusLabel = (status?: string) => {
  if (status === "SUCCEEDED" || status === "COMPLETED") {
    return "분석 완료";
  }

  if (status === "PENDING" || status === "IN_PROGRESS") {
    return "분석 중";
  }

  if (status === "FAILED") {
    return "분석 실패";
  }

  return status || "상태 확인 중";
};

export const buildFeedbackOverallContent = (
  feedback: FeedbackData,
  interview?: InterviewSummary | null,
): {
  topSection: FeedbackOverallTopSectionData;
  middleSection: FeedbackOverallMiddleSectionData;
  bottomSection: FeedbackOverallBottomSectionData;
} => {
  const totalScore = getScore(feedback.totalScore);
  const personaCards = feedback.personas?.map((persona, index) => ({
    title: persona.personaRole?.trim() || `면접관 ${index + 1}`,
    highlightText: persona.comment?.trim() || undefined,
    bars: [
      {
        label: "내 점수",
        score: getScore(persona.score),
        tone: "primary" as const,
      },
    ],
  }));
  const comparisonCards =
    personaCards && personaCards.length > 0
      ? personaCards
      : [
          {
            title: "이번 면접",
            bars: [
              {
                label: "내 점수",
                score: totalScore,
                tone: "primary" as const,
              },
            ],
          },
        ];

  return {
    topSection: {
      tabs: {
        overallLabel: "종합피드백",
        detailLabel: "상세피드백",
        activeTab: "overall",
      },
      summary: {
        title: "종합 점수",
        score: totalScore,
        description: [
          getText(feedback.summary, "아직 종합 분석이 완료되지 않았습니다."),
        ],
      },
      averageComparison: {
        title: "점수 분석",
        bars: [
          {
            label: "내 점수",
            score: totalScore,
            tone: "primary",
          },
          {
            label: "질문 의도 적합도",
            score: getScore(feedback.intentAlignmentScore),
            tone: "muted",
          },
        ],
      },
      comparisonCards,
      intentAlignmentScore: getScore(feedback.intentAlignmentScore),
    },
    middleSection: {
      cards: [
        {
          title: "강점",
          content: getListText(feedback.strengths),
        },
        {
          title: "보완점",
          content: getListText(feedback.improvements),
        },
      ],
      personaFeedbacks: (feedback.personas ?? []).map((persona, index) => ({
        title: persona.personaRole?.trim() || `면접관 ${index + 1}`,
        imageUrl:
          persona.imageUrl ??
          (persona.personaId === interview?.persona?.id
            ? interview.persona?.imageUrl
            : undefined),
        comment:
          persona.comment?.trim() || "면접관 코멘트가 아직 등록되지 않았습니다.",
      })),
    },
    bottomSection: {
      reliability: {
        title: "응답 신뢰성",
        scoreLabel: `${getScore(feedback.reliabilityScore)}점`,
        levelLabel: getReliabilityLevel(getScore(feedback.reliabilityScore)),
      },
      questionFit: {
        title: "질문 의도 적합도",
        content: `${getScore(feedback.intentAlignmentScore)}점 · ${feedback.answeredCount ?? 0}/${feedback.questionCount ?? 0}문항 답변`,
      },
      keywords: {
        items: (feedback.frequentWords ?? []).slice(0, 8).map((item, index) => ({
          text: item.word,
          size: index < 2 ? ("xl" as const) : index < 4 ? ("md" as const) : ("sm" as const),
          top: ["22%", "68%", "40%", "82%", "16%", "54%", "30%", "74%"][index],
          left: ["28%", "64%", "72%", "38%", "78%", "22%", "48%", "84%"][index],
        })),
      },
      pdfActionLabel: "PDF로 저장",
    },
  };
};

export const buildFeedbackDetailContent = (
  feedback: FeedbackData,
): {
  topSection: FeedbackDetailTopSectionData;
  middleSection: FeedbackDetailMiddleSectionData;
  bottomSection: FeedbackDetailBottomSectionData;
} => {
  const personaRoleById = new Map(
    (feedback.personas ?? []).flatMap((persona, index) =>
      typeof persona.personaId === "number"
        ? [[persona.personaId, persona.personaRole?.trim() || `면접관 ${index + 1}`] as const]
        : [],
    ),
  );

  return {
    topSection: {
      tabs: {
        overallLabel: "종합피드백",
        detailLabel: "상세피드백",
        activeTab: "detail",
      },
      questionListTitle: "질문별 피드백",
      questionTitle: "질문",
      intentionTitle: "질문 의도",
      myAnswerTitle: "내 답변",
      showMyAnswerLabel: "내 답변 보기",
      hideMyAnswerLabel: "내 답변 숨기기",
      modelAnswerTitle: "모범 답변",
      followUpTitle: "개선 포인트",
      questions: (feedback.feedbacks ?? []).map((item, index) =>
        getFeedbackQuestion(
          item,
          index,
          typeof item.personaId === "number"
            ? personaRoleById.get(item.personaId) ?? "면접관"
            : undefined,
        ),
      ),
    },
    middleSection: {
      cards: [
        {
          title: "강점",
          paragraphs: feedback.strengths ?? ["강점 분석 결과가 아직 없습니다."],
        },
        {
          title: "보완점",
          paragraphs: feedback.improvements ?? ["보완점 분석 결과가 아직 없습니다."],
        },
      ],
    },
    bottomSection: {
      coachComment: getText(
        feedback.summary,
        "종합 피드백 분석이 완료되면 코멘트가 표시됩니다.",
      ),
      secondaryActionLabel: "PDF로 저장",
      primaryActionLabel: "면접 다시보기",
    },
  };
};
