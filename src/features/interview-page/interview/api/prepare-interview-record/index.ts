import { apiInstance } from "@/shared/api/axiosInstance";

import {
  getErrorMessage,
  getInterviewQuestion,
  getNumericValue,
  getRecord,
  getTrimmedString,
} from "../shared";
import type { CurrentInterviewQuestion } from "../type";


const PREPARE_INTERVIEW_RECORD_URL = "/api/interviews";
const PREPARE_INTERVIEW_RECORD_BODY = 0;
const PREPARATION_STATUS_VALUES = ["NOT_REQUESTED", "PREPARING", "READY", "FAILED"] as const;
const TAILOR_STATUS_VALUES = ["NOT_REQUESTED", "WAITING", "PENDING", "SUCCEEDED", "FAILED"] as const;

export type InterviewPreparationStatus = (typeof PREPARATION_STATUS_VALUES)[number];
export type InterviewTailorStatus = (typeof TAILOR_STATUS_VALUES)[number];

export interface InterviewPreparationData {
  chatDelivered: boolean;
  preparationStatus: InterviewPreparationStatus;
  failureStage: "QUESTION_GENERATION" | "CHAT_DELIVERY" | null;
  retryable: boolean;
  errorMessage: string | null;
  interviewId: number;
  jobId: string | null;
  questions: CurrentInterviewQuestion[];
  retryAfterMs: number | null;
  status: InterviewTailorStatus;
}

const getInterviewId = (payload: unknown) => {
  const responseRecord = getRecord(payload);
  const data = responseRecord?.data;
  const dataRecord = getRecord(data);

  return (
    getNumericValue(dataRecord?.interviewId ?? dataRecord?.id) ??
    getNumericValue(responseRecord?.interviewId ?? responseRecord?.id) ??
    getNumericValue(data) ??
    getNumericValue(payload)
  );
};

const getSessionId = (payload: unknown) => {
  const responseRecord = getRecord(payload);
  const dataRecord = getRecord(responseRecord?.data);

  return (
    getTrimmedString(dataRecord?.sessionId) ??
    getTrimmedString(responseRecord?.sessionId)
  );
};

const getJobId = (payload: unknown) => {
  const responseRecord = getRecord(payload);
  const dataRecord = getRecord(responseRecord?.data);

  return (
    getTrimmedString(dataRecord?.jobId) ??
    getTrimmedString(responseRecord?.jobId)
  );
};

const getRetryAfterMs = (payload: unknown) => {
  const retryAfterMs = getNumericValue(payload);

  return retryAfterMs !== null && retryAfterMs >= 0 ? retryAfterMs : null;
};

export const prepareInterviewRecord = async (interviewId: number) => {
  const requestUrl = `${PREPARE_INTERVIEW_RECORD_URL}/${encodeURIComponent(
    interviewId,
  )}`;

  if (!Number.isInteger(interviewId) || interviewId <= 0) {
    return {
      data: null,
      errorMessage: "유효한 인터뷰 ID가 없습니다.",
    };
  }

  try {
    const response = await apiInstance.post(
      requestUrl,
      PREPARE_INTERVIEW_RECORD_BODY,
    );
    const responseInterviewId = getInterviewId(response.data);

    if (responseInterviewId === null || responseInterviewId <= 0) {
      return {
        data: null,
        errorMessage: "인터뷰 ID를 받지 못했습니다.",
      };
    }

    return {
      data: {
        interviewId: responseInterviewId,
        jobId: getJobId(response.data) ?? undefined,
        sessionId: getSessionId(response.data) ?? undefined,
      },
      errorMessage: null,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(
      error,
      "면접 준비 요청에 실패했습니다.",
    );

    return {
      data: null,
      errorMessage,
    };
  }
};


export const retryInterviewPreparation = async (interviewId: number) => {
  if (!Number.isInteger(interviewId) || interviewId <= 0) {
    return { data: null, errorMessage: "유효한 인터뷰 ID가 없습니다." };
  }

  try {
    const response = await apiInstance.post(
      `${PREPARE_INTERVIEW_RECORD_URL}/${encodeURIComponent(interviewId)}/preparation/retry`,
    );
    const responseRecord = getRecord(response.data);
    const sourceRecord = getRecord(responseRecord?.data) ?? responseRecord;
    const preparationStatus = getTrimmedString(sourceRecord?.preparationStatus)?.toUpperCase() ?? null;

    if (!isPreparationStatus(preparationStatus)) {
      return { data: null, errorMessage: "재시도 상태를 확인하지 못했습니다." };
    }

    return {
      data: {
        preparationStatus,
        retryable: sourceRecord?.retryable === true,
        errorMessage: getTrimmedString(sourceRecord?.errorMessage),
      },
      errorMessage: null,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error, "면접 준비 재시도에 실패했습니다.");
    // 이미 준비 중이면 서버가 중복 요청을 거절하므로 상태 조회를 계속한다.
    if (errorMessage.includes("준비하는 중")) {
      return { data: { preparationStatus: "PREPARING" as const, retryable: false, errorMessage: null }, errorMessage: null };
    }
    return { data: null, errorMessage };
  }
};

const isPreparationStatus = (value: string | null): value is InterviewPreparationStatus =>
  value !== null && PREPARATION_STATUS_VALUES.includes(value as InterviewPreparationStatus);

const isTailorStatus = (value: string | null): value is InterviewTailorStatus =>
  value !== null && TAILOR_STATUS_VALUES.includes(value as InterviewTailorStatus);

export const getInterviewPreparation = async (interviewId: number) => {
  if (!Number.isInteger(interviewId) || interviewId <= 0) {
    return {
      data: null,
      errorMessage: "유효한 인터뷰 ID가 없습니다.",
    };
  }

  try {
    const response = await apiInstance.get("/api/questions/tailor", {
      params: { interviewId },
    });
    const responseRecord = getRecord(response.data);
    const sourceRecord = getRecord(responseRecord?.data) ?? responseRecord;
    const preparationStatus = getTrimmedString(sourceRecord?.preparationStatus)?.toUpperCase() ?? null;
    const status = getTrimmedString(sourceRecord?.status)?.toUpperCase() ?? null;

    if (!isPreparationStatus(preparationStatus) || !isTailorStatus(status)) {
      return {
        data: null,
        errorMessage: "면접 준비 상태를 확인하지 못했습니다.",
      };
    }

    const questions = Array.isArray(sourceRecord?.questions)
      ? sourceRecord.questions.reduce<CurrentInterviewQuestion[]>(
          (items, question) => {
            const normalizedQuestion = getInterviewQuestion(question);

            if (normalizedQuestion) {
              items.push(normalizedQuestion);
            }

            return items;
          },
          [],
        )
      : [];

    return {
      data: {
        chatDelivered: sourceRecord?.chatDelivered === true,
        preparationStatus,
        failureStage: sourceRecord?.failureStage === "QUESTION_GENERATION" || sourceRecord?.failureStage === "CHAT_DELIVERY" ? sourceRecord.failureStage : null,
        retryable: sourceRecord?.retryable === true,
        errorMessage: getTrimmedString(sourceRecord?.errorMessage),
        interviewId:
          getNumericValue(sourceRecord?.interviewId) ?? interviewId,
        jobId: getTrimmedString(sourceRecord?.jobId),
        questions,
        retryAfterMs: getRetryAfterMs(sourceRecord?.retryAfterMs),
        status,
      } satisfies InterviewPreparationData,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: getErrorMessage(error, "면접 준비 상태를 확인하지 못했습니다."),
    };
  }
};
