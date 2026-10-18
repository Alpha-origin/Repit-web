import axios from "axios";
import { readCompanyBadge } from "@/features/interview-page/company/model/type";
import { apiInstance } from "@/shared/api/axiosInstance";

import {
  getErrorMessage,
  getNumericValue,
  getRecord,
  getTrimmedString,
} from "../shared";
import type {
  CreateInterviewParams,
  InterviewMode,
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

const isInterviewMode = (value: unknown): value is InterviewMode =>
  value === "SOLO" || value === "MULTI";

const getPersonaIds = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<number[]>((personaIds, item) => {
    const personaId = getNumericValue(item);

    if (personaId !== null && Number.isSafeInteger(personaId) && personaId > 0 && !personaIds.includes(personaId)) {
      personaIds.push(personaId);
    }

    return personaIds;
  }, []);
};

const isMultiInterviewParams = (
  params: CreateInterviewParams,
): params is Extract<CreateInterviewParams, { personaIds: number[] }> =>
  "personaIds" in params;

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
    personaId: getNumericValue(questionRecord?.personaId) ?? undefined,
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

const normalizeCreatedInterview = (
  payload: unknown,
  fallbackParams: CreateInterviewParams,
) => {
  const responseRecord = getRecord(payload);
  const responseDataRecord = getRecord(responseRecord?.data);
  const sourceRecord = responseDataRecord ?? responseRecord;
  const sessionId = getTrimmedString(sourceRecord?.sessionId);
  const interviewId = getNumericValue(sourceRecord?.interviewId);
  const userId = getNumericValue(sourceRecord?.userId);
  const personaId = getNumericValue(sourceRecord?.personaId);
  const fallbackPersonaIds = isMultiInterviewParams(fallbackParams)
    ? fallbackParams.personaIds
    : [];
  const responsePersonaIds = getPersonaIds(sourceRecord?.personaIds);
  const personaIds =
    responsePersonaIds.length > 0 ? responsePersonaIds : fallbackPersonaIds;
  const mode = isInterviewMode(sourceRecord?.mode)
    ? sourceRecord.mode
    : personaIds.length > 1
      ? "MULTI"
      : "SOLO";
  const questions = normalizeQuestions(
    sourceRecord?.questions ?? sourceRecord?.interviewQuestions,
  );

  if (
    !sessionId ||
    interviewId === null || !Number.isSafeInteger(interviewId) || interviewId <= 0 ||
    userId === null || !Number.isSafeInteger(userId) || userId <= 0 ||
    (mode === "SOLO" && (personaId === null || !Number.isSafeInteger(personaId) || personaId <= 0)) ||
    (mode === "MULTI" && personaIds.length === 0)
  ) {
    return null;
  }

  const normalizedPersonaIds =
    mode === "SOLO" && personaId !== null && personaIds.length === 0
      ? [personaId]
      : personaIds;

  return {
    interviewId,
    company: readCompanyBadge(sourceRecord?.company),
    userId,
    personaId,
    personaIds: normalizedPersonaIds,
    mode,
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

export const createInterview = async (params: CreateInterviewParams, idempotencyKey: string) => {
  try {
    const response = await apiInstance.post(CREATE_INTERVIEW_URL, params, {
      headers: { "Idempotency-Key": idempotencyKey },
      timeout: 30_000,
    });
    const responseRecord = getRecord(response.data);

    if (responseRecord?.success === false) {
      return {
        data: null,
        statusCode: null,
        code: null,
        definitive: false,
        errorMessage: "면접 시작에 실패했습니다.",
      };
    }

    const createdInterview = normalizeCreatedInterview(response.data, params);

    if (!createdInterview) {
      return {
        data: null,
        statusCode: null,
        code: null,
        definitive: false,
        errorMessage: "면접 세션 정보를 받지 못했습니다.",
      };
    }

    return {
      data: createdInterview,
      statusCode: null,
      code: null,
      definitive: false,
      errorMessage: null,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error, "면접 시작에 실패했습니다.");

    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const payload = axios.isAxiosError(error) ? getRecord(error.response?.data) : null;
    const code = getTrimmedString(payload?.code);
    return {
      data: null,
      code,
      statusCode: status ?? null,
      definitive: status !== undefined && [400, 404, 422].includes(status),
      errorMessage:
        errorMessage === "Internal Server Error"
          ? "면접 시작 서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          : errorMessage,
    };
  }
};

export const getCreatedInterview = async (interviewId: number, params: CreateInterviewParams, signal?: AbortSignal) => {
  const response = await apiInstance.get("/api/interviews/get", { params: { interviewId }, signal, timeout: 15_000 });
  const data = normalizeCreatedInterview(response.data, params);
  if (!data || data.interviewId !== interviewId) throw new Error("면접 정보를 확인하지 못했습니다.");
  if ("personaIds" in params && (params.personaIds.length !== data.personaIds.length ||
    params.personaIds.some((id, index) => data.personaIds[index] !== id))) {
    throw new Error("생성된 면접관 정보가 선택한 설정과 일치하지 않습니다.");
  }
  return data;
};
