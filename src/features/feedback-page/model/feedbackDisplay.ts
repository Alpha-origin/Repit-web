import type { InterviewAnswer } from "@/features/feedback-page/api/getInterviewAnswers";
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
  answerContent?: string,
  personaLabel?: string,
) => ({
  id: index + 1,
  label: `Q${index + 1}`,
  preview: getText(item.questionContent),
  personaLabel,
  question: getText(item.questionContent),
  intention: getText(item.intention),
  myAnswer: getText(answerContent, "작성된 답변이 없습니다."),
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

const getOptionalScore = (score?: number) =>
  typeof score === "number" && Number.isFinite(score)
    ? Math.round(Math.min(100, Math.max(0, score)))
    : null;

export const buildFeedbackOverallContent = (
  feedback: FeedbackData,
  interview?: InterviewSummary | null,
  previousFeedback?: FeedbackData | null,
): {
  topSection: FeedbackOverallTopSectionData;
  middleSection: FeedbackOverallMiddleSectionData;
  bottomSection: FeedbackOverallBottomSectionData;
} => {
  const totalScore = getOptionalScore(feedback.totalScore);
  const reliabilityScore = getOptionalScore(feedback.reliabilityScore);
  const summary = getText(feedback.summary, "아직 종합 분석이 완료되지 않았습니다.");
  const summarySentences = summary.split(/(?<=[.!?。])\s+/);
  const keywords = [...(feedback.frequentWords ?? [])]
    .filter((item) => item.word.trim() && Number.isFinite(item.count) && item.count > 0)
    .sort((left, right) => right.count - left.count)
    .filter((item, index, items) => items.findIndex((other) => other.word === item.word) === index)
    .slice(0, 8);
  const keywordPositions = [
    { size: "xl", top: "50%", left: "52%" },
    { size: "lg", top: "24%", left: "69%" },
    { size: "md", top: "30%", left: "23%" },
    { size: "md", top: "72%", left: "71%" },
    { size: "sm", top: "31%", left: "86%" },
    { size: "sm", top: "78%", left: "35%" },
    { size: "xs", top: "72%", left: "11%" },
    { size: "xs", top: "15%", left: "41%" },
  ] as const;

  return {
    topSection: {
      tabs: {
        overallLabel: "종합 피드백",
        detailLabel: "상세 피드백",
        activeTab: "overall",
      },
      summary: {
        title: "종합 점수",
        score: totalScore,
        description: summarySentences.slice(0, 2).map((sentence) => sentence.trim()),
      },
      // The current feedback API only supplies the intent score; other criteria
      // remain unscored until dedicated analysis results are available.
      metrics: [
        { label: "의도 충족", score: getOptionalScore(feedback.intentAlignmentScore) },
        { label: "깊이", score: null },
        { label: "구체성", score: null },
        { label: "정확성", score: null },
      ],
      evaluation: summary,
    },
    middleSection: {
      cards: [
        {
          title: "장점",
          tone: "positive",
          items: feedback.strengths?.length ? feedback.strengths : ["장점 분석 결과가 아직 없습니다."],
        },
        {
          title: "단점",
          tone: "negative",
          items: feedback.improvements?.length ? feedback.improvements : ["보완할 점에 대한 분석 결과가 아직 없습니다."],
        },
      ],
      comparison: {
        previousScore: getOptionalScore(previousFeedback?.totalScore),
        currentScore: totalScore,
      },
      personaFeedbacks: (feedback.personas ?? []).map((persona, index) => ({
        title: persona.personaRole?.trim() || `면접관 ${index + 1}`,
        imageUrl:
          persona.imageUrl ??
          (persona.personaId === interview?.persona?.id
            ? interview?.persona?.imageUrl
            : undefined),
        comment: persona.comment?.trim() || "면접관 코멘트가 아직 등록되지 않았습니다.",
        score: getOptionalScore(persona.score),
        hasNoAnswer: persona.answeredCount === 0,
      })),
    },
    bottomSection: {
      speechMetrics: ["발화 속도", "발음 명료도", "침묵 비율", "음량 안정성"].map((label) => ({
        label,
        score: null,
        description: "음성 분석 결과가 아직 없습니다.",
      })),
      reliability: {
        title: "응답 신뢰성",
        scoreLabel: reliabilityScore === null ? "—" : `${reliabilityScore}%`,
        levelLabel: reliabilityScore === null ? "분석 대기" : getReliabilityLevel(reliabilityScore),
      },
      keywords: {
        items: keywords.map((item, index) => ({
          text: item.word,
          ...keywordPositions[index],
        })),
      },
      pdfActionLabel: "PDF로 저장",
    },
  };
};

export const buildFeedbackDetailContent = (
  feedback: FeedbackData,
  answers: readonly InterviewAnswer[],
): {
  topSection: FeedbackDetailTopSectionData;
  middleSection: FeedbackDetailMiddleSectionData;
  bottomSection: FeedbackDetailBottomSectionData;
} => {
  const answersByQuestionId = new Map(
    [...answers]
      .sort((left, right) =>
        (Date.parse(left.createdAt) || 0) - (Date.parse(right.createdAt) || 0) ||
        left.answerId - right.answerId,
      )
      .map((answer) => [answer.question, answer.content]),
  );
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
          answersByQuestionId.get(Number(item.questionId)),
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
