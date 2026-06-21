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

const normalizeCreatedInterview = (payload: unknown) => {
  const responseRecord = getRecord(payload);
  const responseDataRecord = getRecord(responseRecord?.data);
  const sourceRecord = responseDataRecord ?? responseRecord;
  const sessionId = getTrimmedString(sourceRecord?.sessionId);
  const interviewId = getNumericValue(sourceRecord?.interviewId);
  const userId = getNumericValue(sourceRecord?.userId);
  const personaId = getNumericValue(sourceRecord?.personaId);

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
    return {
      data: null,
      errorMessage: getErrorMessage(error, "면접 시작에 실패했습니다."),
    };
  }
};
