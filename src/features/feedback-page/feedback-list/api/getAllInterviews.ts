import type { CompanyBadge } from "@/features/interview-page/company/model/type";
import axios from "axios";
import {
  apiInstance,
  ensureAccessToken,
} from "@/shared/api/axiosInstance";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import { getInterviewStatus } from "@/features/feedback-page/api/getInterviewStatus";

export interface InterviewPersona {
  id?: number;
  personaRole?: string;
  personaName?: string;
  major?: string;
  jobTitle?: string | null;
  type?: string;
  career?: number;
  gender?: string;
  level?: string;
  tone?: string;
  imageUrl?: string;
}

export interface InterviewSummary {
  company?: CompanyBadge | null;
  id?: number;
  interviewId?: number;
  userId?: number;
  mode?: "SOLO" | "MULTI" | null;
  answerMode?: "TEXT" | "VOICE" | null;
  personaId?: number | null;
  personaIds?: number[];
  persona?: InterviewPersona | null;
  sessionId?: string;
  status?: string;
  createdAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
}

const GET_ALL_INTERVIEWS_URL = "/api/interviews/getAll";
const GET_FEEDBACK_URL = "/api/feedbacks";
const GET_ALL_FEEDBACKS_URL = "/api/feedbacks/getAll";

export interface FrequentWord {
  word: string;
  count: number;
}

export interface QuestionFeedback {
  questionId?: string | number;
  personaId?: number;
  questionContent?: string;
  intention?: string;
  userAnswer?: string;
  modelAnswer?: string;
  strengths?: string[];
  improvements?: string[];
  comment?: string;
  followUpQuestion?: string | null;
  responseLevel?: number | null;
  axisScores?: Record<string, number | null> | null;
  competencies?: QuestionCompetency[] | null;
}

export type CompetencyCode =
  | "PROBLEM_SOLVING"
  | "KNOWLEDGE"
  | "OWNERSHIP"
  | "COLLABORATION"
  | "GROWTH";

export type Verdict = "STRONG" | "SOLID" | "BORDERLINE" | "WEAK";

export interface QuestionCompetency {
  competency: CompetencyCode | "MOTIVATION";
  role: "PRIMARY" | "SECONDARY";
  level: number;
  score: number;
  evidence: { slot: string; quote: string }[];
}

export interface CredibilityIssue {
  kind: "ROLE" | "TECH_CHOICE" | "CAUSE" | "DETAIL" | "OTHER";
  questionIds: string[];
  quotes: string[];
}

export interface FeedbackPersona {
  personaId?: number;
  personaRole?: string;
  imageUrl?: string;
  score?: number;
  comment?: string;
  strengths?: string[];
  improvements?: string[];
  answeredCount?: number;
  questionCount?: number;
  scoreBreakdown?: ScoreBreakdown | null;
}

export interface ScoreBreakdown {
  scoringVersion?: string;
  axes?: {
    axis: string;
    score: number | null;
    weight: number | null;
    verdict?: Verdict | null;
    evidenceCount?: number;
  }[];
  consistencyScore?: number | null;
  response?: { score: number; hitCount: number; gradedCount: number } | null;
  motivation?: { score: number | null; verdict?: Verdict | null; evidenceCount: number } | null;
  credibility?: { score: number | null; issues: CredibilityIssue[] } | null;
}

export interface FeedbackData {
  mode?: "SOLO" | "MULTI" | null;
  scoreBreakdown?: ScoreBreakdown | null;
  company?: CompanyBadge | null;
  companyFit?: unknown;
  feedbackId?: number;
  interviewId?: number;
  sessionId?: string;
  style?: string;
  level?: string;
  status?: string;
  totalScore?: number;
  intentAlignmentScore?: number;
  reliabilityScore?: number;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  frequentWords?: FrequentWord[];
  answeredCount?: number;
  questionCount?: number;
  errorMessage?: string;
  personas?: FeedbackPersona[];
  feedbacks?: QuestionFeedback[];
  createdAt?: string;
}

interface FeedbackApiResponse {
  success: boolean;
  data?: FeedbackData;
}

interface FeedbackAcceptedResponse {
  jobId?: string;
  sessionId?: string;
  status?: string;
  message?: string;
}

export class FeedbackInterviewPolicyError extends Error {
  readonly interviewStatus: string | null;

  constructor(interviewStatus: string | null) {
    super(interviewStatus === "ABANDONED"
      ? "중단된 면접은 피드백을 생성하지 않습니다."
      : "면접이 완료된 것을 확인한 뒤 피드백을 생성할 수 있습니다.");
    this.interviewStatus = interviewStatus;
  }
}

const feedbackRequests = new Map<number, Promise<FeedbackData>>();
const feedbackLookups = new Map<number, Promise<FeedbackData>>();

const isFeedbackApiResponse = (
  payload: FeedbackData | FeedbackApiResponse,
): payload is FeedbackApiResponse => "data" in payload;

const normalizeFeedback = (
  payload: FeedbackData | FeedbackApiResponse | null | undefined,
): FeedbackData | null => {
  if (!payload) {
    return null;
  }

  if (isFeedbackApiResponse(payload)) {
    return payload.data ?? null;
  }

  return payload;
};

const normalizeInterviews = (
  payload: InterviewSummary[] | ApiResponse<InterviewSummary[]>,
) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
};

const normalizeFeedbacks = (
  payload: FeedbackData[] | ApiResponse<FeedbackData[]>,
) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
};

export const getAllInterviews = async () => {
  const response = await apiInstance.get<
    InterviewSummary[] | ApiResponse<InterviewSummary[]>
  >(GET_ALL_INTERVIEWS_URL);

  return normalizeInterviews(response.data);
};

export const getAllFeedbacks = async () => {
  const response = await apiInstance.get<
    FeedbackData[] | ApiResponse<FeedbackData[]>
  >(GET_ALL_FEEDBACKS_URL);

  return normalizeFeedbacks(response.data);
};

export const getFeedback = async (interviewId: number, signal?: AbortSignal) => {
  if (!Number.isInteger(interviewId) || interviewId <= 0) {
    throw new Error("피드백을 조회할 interviewId가 없습니다.");
  }

  const authorizationHeader = await ensureAccessToken();
  try {
    const response = await apiInstance.get<
      FeedbackData | FeedbackApiResponse
    >(GET_FEEDBACK_URL, {
      params: { interviewId },
      headers: {
        Authorization: authorizationHeader,
      },
      signal,
    });

    return normalizeFeedback(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};

export const requestFeedback = (interviewId: number, signal?: AbortSignal): Promise<FeedbackData> => {
  const existingRequest = feedbackRequests.get(interviewId);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async (): Promise<FeedbackData> => {
    // 목록에 남아 있는 이전 상태로 중단된 면접의 생성·재생성을 요청하지 않는다.
    const status = await getInterviewStatus(interviewId, { signal, timeout: 15_000 });
    if (status !== "COMPLETED") {
      throw new FeedbackInterviewPolicyError(status);
    }

    const response = await apiInstance.post<ApiResponse<FeedbackAcceptedResponse>>(
      GET_FEEDBACK_URL,
      undefined,
      { params: { interviewId }, signal },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(
        extractErrorMessage(response.data, "피드백 생성을 요청하지 못했습니다."),
      );
    }

    return {
      interviewId,
      sessionId: response.data.data.sessionId,
      status: response.data.data.status === "FAILED" ? "FAILED" : "PENDING",
      errorMessage: response.data.data.status === "FAILED"
        ? response.data.data.message
        : undefined,
    };
  })().finally(() => {
    feedbackRequests.delete(interviewId);
  });

  feedbackRequests.set(interviewId, request);
  return request;
};

export const getOrRequestFeedback = (interviewId: number, signal?: AbortSignal) => {
  const existingRequest = feedbackRequests.get(interviewId) ?? feedbackLookups.get(interviewId);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const feedback = await getFeedback(interviewId, signal);
    return feedback ?? requestFeedback(interviewId, signal);
  })().finally(() => {
    feedbackLookups.delete(interviewId);
  });

  feedbackLookups.set(interviewId, request);
  return request;
};
