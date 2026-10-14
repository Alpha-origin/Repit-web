import {
  apiInstance,
  ensureAccessToken,
} from "@/shared/api/axiosInstance";

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

export const getFeedback = async (interviewId: number) => {
  if (!Number.isInteger(interviewId) || interviewId <= 0) {
    throw new Error("피드백을 조회할 interviewId가 없습니다.");
  }

  const authorizationHeader = await ensureAccessToken();
  const response = await apiInstance.get<
    FeedbackData | FeedbackApiResponse
  >(GET_FEEDBACK_URL, {
    params: { interviewId },
    headers: {
      Authorization: authorizationHeader,
    },
  });

  return normalizeFeedback(response.data);
};
