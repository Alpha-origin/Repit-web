import axios from "axios";
import {
  apiInstance,
  ensureAccessToken,
} from "@/shared/api/axiosInstance";
import { extractErrorMessage } from "@/shared/api/errorMessage";

export interface InterviewPersona {
  id?: number;
  personaRole?: string;
  personaName?: string;
  major?: string;
  type?: string;
  career?: number;
  gender?: string;
  level?: string;
  tone?: string;
  imageUrl?: string;
}

export interface InterviewSummary {
  id?: number;
  interviewId?: number;
  userId?: number;
  mode?: "SOLO" | "MULTI";
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
}

export interface FeedbackData {
  feedbackId?: number;
  interviewId?: number;
  sessionId?: string;
  style?: string;
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

export const requestFeedback = (interviewId: number): Promise<FeedbackData> => {
  const existingRequest = feedbackRequests.get(interviewId);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async (): Promise<FeedbackData> => {
    const response = await apiInstance.post<ApiResponse<FeedbackAcceptedResponse>>(
      GET_FEEDBACK_URL,
      undefined,
      { params: { interviewId } },
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

export const getOrRequestFeedback = (interviewId: number) => {
  const existingRequest = feedbackRequests.get(interviewId) ?? feedbackLookups.get(interviewId);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const feedback = await getFeedback(interviewId);
    return feedback ?? requestFeedback(interviewId);
  })().finally(() => {
    feedbackLookups.delete(interviewId);
  });

  feedbackLookups.set(interviewId, request);
  return request;
};
