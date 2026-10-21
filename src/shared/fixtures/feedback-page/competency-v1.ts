import type { FeedbackData } from "@/features/feedback-page/feedback-list/api/getAllInterviews";

export const COMPETENCY_SOLO_FEEDBACK: FeedbackData = {
  mode: "SOLO",
  totalScore: 68,
  intentAlignmentScore: 88,
  reliabilityScore: 75,
  summary: "문제 해결 과정이 구체적입니다. 일부 답변은 본인의 기여와 결과를 더 설명할 수 있습니다.",
  answeredCount: 6,
  questionCount: 6,
  scoreBreakdown: {
    scoringVersion: "competency-v1",
    axes: [
      { axis: "PROBLEM_SOLVING", score: 75, weight: 30, verdict: "SOLID", evidenceCount: 3 },
      { axis: "KNOWLEDGE", score: 58, weight: 25, verdict: "BORDERLINE", evidenceCount: 2 },
      { axis: "OWNERSHIP", score: 70, weight: 25, verdict: "SOLID", evidenceCount: 3 },
      { axis: "COLLABORATION", score: null, weight: null, verdict: null, evidenceCount: 0 },
      { axis: "GROWTH", score: 50, weight: 10, verdict: "BORDERLINE", evidenceCount: 1 },
    ],
    response: { score: 88, hitCount: 5, gradedCount: 6 },
    motivation: null,
    credibility: {
      score: 75,
      issues: [{
        kind: "ROLE",
        questionIds: ["101", "105"],
        quotes: ["결제 모듈은 제가 전부 맡았습니다", "결제 쪽은 동료가 개발했고"],
      }],
    },
  },
  feedbacks: [
    {
      questionId: "101",
      questionContent: "결제 모듈에서 맡은 역할은 무엇이었나요?",
      intention: "프로젝트에서 본인이 맡은 업무와 기여를 확인합니다.",
      userAnswer: "결제 모듈은 제가 전부 맡았습니다.",
      responseLevel: 4,
      competencies: [{
        competency: "OWNERSHIP",
        role: "PRIMARY",
        level: 3,
        score: 75,
        evidence: [{ slot: "action", quote: "결제 모듈은 제가 전부 맡았습니다" }],
      }],
    },
    {
      questionId: "105",
      questionContent: "결제 모듈 개발에는 누가 참여했나요?",
      intention: "담당 역할이 일관되게 설명되는지 확인합니다.",
      userAnswer: "결제 쪽은 동료가 개발했고 저는 테스트를 도왔습니다.",
      responseLevel: 4,
      competencies: [{
        competency: "PROBLEM_SOLVING",
        role: "PRIMARY",
        level: 3,
        score: 75,
        evidence: [{ slot: "reason", quote: "테스트를 도왔습니다" }],
      }],
    },
    {
      questionId: "102",
      questionContent: "분산 락을 선택한 이유는 무엇인가요?",
      userAnswer: "DB 락과 비교해 동시성 요구에 맞는 방식을 선택했습니다.",
      responseLevel: 3,
      competencies: [{ competency: "PROBLEM_SOLVING", role: "PRIMARY", level: 3, score: 75, evidence: [] }],
    },
    {
      questionId: "103",
      questionContent: "락 만료는 어떤 방식으로 처리하나요?",
      userAnswer: "TTL이 지나면 락이 자동으로 풀립니다.",
      responseLevel: 3,
      competencies: [{ competency: "KNOWLEDGE", role: "PRIMARY", level: 2, score: 50, evidence: [] }],
    },
    {
      questionId: "104",
      questionContent: "이후 어떤 점을 개선했나요?",
      userAnswer: "실패 이후 테스트 시나리오를 먼저 정리하는 습관을 들였습니다.",
      responseLevel: 3,
      competencies: [{ competency: "GROWTH", role: "PRIMARY", level: 2, score: 50, evidence: [] }],
    },
    {
      questionId: "106",
      questionContent: "팀에서 본인이 맡은 실행 업무는 무엇인가요?",
      userAnswer: "배포 자동화 스크립트를 만들고 배포 시간을 줄였습니다.",
      responseLevel: 4,
      competencies: [{ competency: "OWNERSHIP", role: "PRIMARY", level: 3, score: 75, evidence: [] }],
    },
  ],
};

export const COMPETENCY_MULTI_FEEDBACK: FeedbackData = {
  ...COMPETENCY_SOLO_FEEDBACK,
  mode: "MULTI",
  answeredCount: 4,
  questionCount: 4,
  feedbacks: COMPETENCY_SOLO_FEEDBACK.feedbacks?.slice(0, 4),
  scoreBreakdown: {
    ...COMPETENCY_SOLO_FEEDBACK.scoreBreakdown,
    motivation: { score: 75, verdict: "SOLID", evidenceCount: 2 },
  },
  personas: [{
    personaId: 1,
    personaRole: "실무 면접관",
    score: 72,
    answeredCount: 0,
    questionCount: 2,
  }],
};
