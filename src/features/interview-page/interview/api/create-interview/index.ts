import { apiInstance } from "@/shared/api/axiosInstance";

import {
  getErrorMessage,
  getNumericValue,
  getRecord,
  getTrimmedString,
} from "../shared";
import type {
  CreateInterviewParams,
  CreatedInterviewData,
  InterviewLifecycleStatus,
  PrepareInterviewQuestion,
} from "../type";

const CREATE_INTERVIEW_URL = "/api/interviews/create";
const INTERVIEW_LIFECYCLE_STATUSES: readonly InterviewLifecycleStatus[] = [
  "IN_PROGRESS",
  "COMPLETED",
  "ABANDONED",
] as const;

const isInterviewLifecycleStatus = (
  value: unknown,
): value is InterviewLifecycleStatus =>
  typeof value === "string" &&
  INTERVIEW_LIFECYCLE_STATUSES.includes(value as InterviewLifecycleStatus);

const normalizeQuestion = (
  value: unknown,
  index: number,
): PrepareInterviewQuestion | null => {
  const questionRecord = getRecord(value);
  const content = getTrimmedString(
    questionRecord?.content ?? questionRecord?.question ?? questionRecord?.text,
  );

  if (!content) {
    return null;
  }

  return {
    questionId:
      getNumericValue(questionRecord?.questionId ?? questionRecord?.id) ??
      index + 1,
    intention:
      getTrimmedString(questionRecord?.intention ?? questionRecord?.purpose) ??
      "",
    content,
  };
};

const normalizeQuestions = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<PrepareInterviewQuestion[]>((accumulator, question, index) => {
    const normalizedQuestion = normalizeQuestion(question, index);

    if (normalizedQuestion) {
      accumulator.push(normalizedQuestion);
    }

    return accumulator;
  }, []);
};

const normalizeCreatedInterview = (payload: unknown) => {
  const responseRecord = getRecord(payload);
  const responseDataRecord = getRecord(responseRecord?.data);
  const sourceRecord = responseDataRecord ?? responseRecord;
  const sessionId = getTrimmedString(sourceRecord?.sessionId);
  const interviewId = getNumericValue(sourceRecord?.interviewId);
  const userId = getNumericValue(sourceRecord?.userId);
  const personaId = getNumericValue(sourceRecord?.personaId);
  const questions = normalizeQuestions(
    sourceRecord?.questions ?? sourceRecord?.interviewQuestions,
  );

  if (
    !sessionId ||
    interviewId === null ||
    userId === null ||
    personaId === null
  ) {
    return null;
  }

  return {
    interviewId,
    userId,
    personaId,
    sessionId,
    status: isInterviewLifecycleStatus(sourceRecord?.status)
      ? sourceRecord.status
      : "IN_PROGRESS",
    createdAt: getTrimmedString(sourceRecord?.createdAt),
    currentQuestionIndex:
      questions.length > 0
        ? Math.min(
            Math.max(getNumericValue(sourceRecord?.currentQuestionIndex) ?? 0, 0),
            questions.length - 1,
          )
        : 0,
    questions,
  } satisfies CreatedInterviewData;
};

export const createInterview = async (params: CreateInterviewParams) => {
  try {
    const response = await apiInstance.post(CREATE_INTERVIEW_URL, params);
    const responseRecord = getRecord(response.data);

    if (responseRecord?.success === false) {
      return {
        data: null,
        errorMessage: "면접 시작에 실패했습니다.",
      };
    }

    const createdInterview = normalizeCreatedInterview(response.data);

    if (!createdInterview) {
      return {
        data: null,
        errorMessage: "면접 세션 정보를 받지 못했습니다.",
      };
    }

    return {
      data: createdInterview,
      errorMessage: null,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error, "면접 시작에 실패했습니다.");

    return {
      data: null,
      errorMessage:
        errorMessage === "Internal Server Error"
          ? "면접 시작 서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          : errorMessage,
    };
  }
};
