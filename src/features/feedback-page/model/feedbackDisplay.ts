import { buildFeedbackMetrics } from "./feedbackMetrics";
import type { InterviewAnswer } from "@/features/feedback-page/api/getInterviewAnswers";
import type {
  FeedbackData,
  InterviewSummary,
  QuestionFeedback,
} from "@/features/feedback-page/feedback-list/api/getAllInterviews";
import { COMPETENCY_VERSION, VERDICT_LABEL } from "./feedbackMetrics";
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
  questionId: item.questionId === undefined ? undefined : String(item.questionId),
  label: `Q${index + 1}`,
  preview: getText(item.questionContent),
  personaLabel: personaLabel ?? "면접관",
  question: getText(item.questionContent),
  intention: getText(item.intention),
  myAnswer: getText(item.userAnswer?.trim() || answerContent, "작성된 답변이 없습니다."),
  modelAnswer: getText(item.modelAnswer),
  followUpQuestion: getText(item.followUpQuestion ?? undefined, "예상 꼬리질문이 아직 제공되지 않았습니다."),
  strengths: item.strengths?.length ? item.strengths : ["이 질문의 장점 분석 결과가 아직 없습니다."],
  improvements: item.improvements?.length ? item.improvements : ["이 질문의 보완할 점이 아직 없습니다."],
  comment: getText(item.comment, "이 질문에 대한 코멘트가 아직 없습니다."),
  competencyChips: Array.isArray(item.competencies)
    ? item.competencies.flatMap((competency) => {
      const labels: Record<string, string> = {
        PROBLEM_SOLVING: "문제 해결·판단",
        KNOWLEDGE: "직무 지식",
        OWNERSHIP: "실행·기여",
        COLLABORATION: "협업·소통",
        GROWTH: "성장·성찰",
        MOTIVATION: "지원 동기·회사 이해",
      };
      const verdictLabels: Record<number, string> = {
        4: "강함", 3: "충분", 2: "보완 필요", 1: "부족", 0: "부족",
      };
      const label = labels[competency?.competency];
      if (
        !competency || !label ||
        (competency.role !== "PRIMARY" && competency.role !== "SECONDARY") ||
        !Number.isInteger(competency.level) || competency.level < 0 || competency.level > 4
      ) {
        return [];
      }
      const quotes = Array.isArray(competency.evidence)
        ? competency.evidence.flatMap((evidence) =>
          typeof evidence?.quote === "string" && evidence.quote.trim() ? [evidence.quote.trim()] : [],
        )
        : [];
      return [{
        label,
        roleLabel: competency.role === "PRIMARY" ? "주 평가" as const : "추가 근거" as const,
        verdictLabel: verdictLabels[competency.level],
        quotes,
      }];
    })
    : undefined,
  responseNote: item.responseLevel === 0 ? "질문에 답하지 않은 것으로 평가되었습니다" : undefined,
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

const CREDIBILITY_TITLES = {
  ROLE: "역할이 서로 다릅니다",
  TECH_CHOICE: "선택한 기술·방법이 서로 다릅니다",
  CAUSE: "원인 설명이 서로 다릅니다",
  DETAIL: "세부 내용이 서로 다릅니다",
  OTHER: "답변이 서로 어긋납니다",
} as const;

const hasSameScoringVersion = (current?: string, previous?: string) => current === previous;

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
  const competencyVersion = feedback.scoreBreakdown?.scoringVersion === COMPETENCY_VERSION;
  const questionIndexes = new Map(
    (feedback.feedbacks ?? []).flatMap((question, index) =>
      question.questionId === undefined ? [] : [[String(question.questionId), index + 1] as const],
    ),
  );
  const credibilityIssues = (feedback.scoreBreakdown?.credibility?.issues ?? []).flatMap((issue) => {
    const kind = issue?.kind as keyof typeof CREDIBILITY_TITLES;
    const firstId = issue?.questionIds?.[0];
    const secondId = issue?.questionIds?.[1];
    const firstLabel = typeof firstId === "string" ? questionIndexes.get(firstId) : undefined;
    const secondLabel = typeof secondId === "string" ? questionIndexes.get(secondId) : undefined;
    const firstQuote = issue?.quotes?.[0];
    const secondQuote = issue?.quotes?.[1];
    if (
      !CREDIBILITY_TITLES[kind] || firstLabel === undefined || secondLabel === undefined ||
      typeof firstQuote !== "string" || typeof secondQuote !== "string"
    ) return [];
    return [{
      title: `${CREDIBILITY_TITLES[kind]} · Q${firstLabel} ↔ Q${secondLabel}`,
      questionLabels: [`Q${firstLabel}`, `Q${secondLabel}`] as const,
      quotes: [firstQuote, secondQuote] as const,
    }];
  });
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
        responseLabel: competencyVersion && feedback.scoreBreakdown?.response &&
          Number.isInteger(feedback.scoreBreakdown.response.hitCount) && feedback.scoreBreakdown.response.hitCount >= 0 &&
          Number.isInteger(feedback.scoreBreakdown.response.gradedCount) && feedback.scoreBreakdown.response.gradedCount > 0 &&
          feedback.scoreBreakdown.response.hitCount <= feedback.scoreBreakdown.response.gradedCount
          ? `응답 적중 ${feedback.scoreBreakdown.response.hitCount}/${feedback.scoreBreakdown.response.gradedCount}문항`
          : undefined,
      },
      metrics: buildFeedbackMetrics(feedback),
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
        previousScore: previousFeedback && hasSameScoringVersion(
          feedback.scoreBreakdown?.scoringVersion,
          previousFeedback.scoreBreakdown?.scoringVersion,
        ) ? getOptionalScore(previousFeedback.totalScore) : null,
        currentScore: totalScore,
        note: previousFeedback && !hasSameScoringVersion(
          feedback.scoreBreakdown?.scoringVersion,
          previousFeedback.scoreBreakdown?.scoringVersion,
        ) ? "채점 방식이 바뀌어 이전 면접과 비교하지 않습니다." : undefined,
      },
      motivation: competencyVersion &&
        typeof feedback.scoreBreakdown?.motivation?.score === "number" &&
        Number.isFinite(feedback.scoreBreakdown.motivation.score) &&
        feedback.scoreBreakdown.motivation.score >= 0 && feedback.scoreBreakdown.motivation.score <= 100
        ? {
          score: feedback.scoreBreakdown.motivation.score,
          verdictLabel: feedback.scoreBreakdown.motivation.verdict
            ? VERDICT_LABEL[feedback.scoreBreakdown.motivation.verdict]
            : undefined,
          note: "종합 점수에는 포함되지 않습니다.",
        }
        : undefined,
      showPersonaFeedback: (interview?.mode ?? feedback.mode) === "MULTI",
      personaFeedbacks: (feedback.personas ?? []).map((persona, index) => ({
        title: persona.personaRole?.trim() || `면접관 ${index + 1}`,
        imageUrl:
          persona.imageUrl ??
          (persona.personaId === interview?.persona?.id
            ? interview?.persona?.imageUrl
            : undefined),
        comment: persona.comment?.trim() || "면접관 코멘트가 제공되지 않았습니다.",
        score: getOptionalScore(persona.score),
        hasNoAnswer: persona.answeredCount === 0,
      })),
    },
    bottomSection: {
      reliability: {
        title: "응답 신뢰성",
        scoreLabel: reliabilityScore === null ? "—" : `${reliabilityScore}%`,
        levelLabel: reliabilityScore === null
          ? competencyVersion
            ? feedback.scoreBreakdown?.response?.gradedCount === 1
              ? "판단 불가 (답변 1개)"
              : "판단 불가"
            : "미제공"
          : getReliabilityLevel(reliabilityScore),
        issues: competencyVersion ? credibilityIssues : undefined,
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
      .map((answer) => [String(answer.question), answer.content]),
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
      questionListTitle: "상세 피드백",
      questionTitle: "질문",
      intentionTitle: "질문 의도",
      myAnswerTitle: "내 답변",
      showMyAnswerLabel: "내 답변 보기",
      hideMyAnswerLabel: "내 답변 숨기기",
      modelAnswerTitle: "모범 답변",
      followUpTitle: "예상 꼬리질문",
      questions: (feedback.feedbacks ?? []).map((item, index) =>
        getFeedbackQuestion(
          item,
          index,
          answersByQuestionId.get(String(item.questionId)),
          typeof item.personaId === "number"
            ? personaRoleById.get(item.personaId) ?? "면접관"
            : undefined,
        ),
      ),
    },
    middleSection: {
      cards: [
        {
          title: "장점",
          tone: "positive",
          paragraphs: feedback.strengths ?? ["강점 분석 결과가 아직 없습니다."],
        },
        {
          title: "단점",
          tone: "negative",
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
