import { chatInstance } from "@/shared/api/axiosInstance";
import { INTERVIEW_DEFAULT_QUESTION } from "@/shared/constants/interview-page/interview";

import {
  getCurrentUserId,
  getErrorMessage,
  getNumericValue,
  getRecord,
  getTrimmedString,
  isInterviewProgressStatus,
  isPersonaType,
} from "../shared";
import type {
  PrepareInterviewParams,
  PrepareInterviewQuestion,
  PreparedInterviewData,
} from "../type";

const PREPARE_INTERVIEW_URL = "/chat/interviews";
const FALLBACK_PREPARE_QUESTION: PrepareInterviewQuestion = {
  questionId: 1,
  intention: "기본 질문",
  content: INTERVIEW_DEFAULT_QUESTION.text,
};

interface PrepareInterviewRequestData extends PreparedInterviewData {
  jobId: string;
}

const normalizeQuestion = (
  value: unknown,
  fallbackQuestion: PrepareInterviewQuestion,
  index: number,
): PrepareInterviewQuestion => {
  const questionRecord = getRecord(value);

  return {
    questionId:
      getNumericValue(questionRecord?.questionId ?? questionRecord?.id) ??
      fallbackQuestion.questionId ??
      index + 1,
    intention:
      getTrimmedString(questionRecord?.intention ?? questionRecord?.purpose) ??
      fallbackQuestion.intention,
    content:
      getTrimmedString(
        questionRecord?.content ?? questionRecord?.question ?? questionRecord?.text,
      ) ?? fallbackQuestion.content,
  };
};

const buildPrepareInterviewRequest = (
  params: PrepareInterviewParams,
  sessionId: string,
  jobId: string,
): PrepareInterviewRequestData => {
  const sourceQuestions =
    params.questions.length > 0 ? params.questions : [FALLBACK_PREPARE_QUESTION];
  const normalizedQuestions = sourceQuestions.map((question, index) => ({
    questionId: getNumericValue(question.questionId) ?? index + 1,
    intention: question.intention.trim(),
    content: question.content.trim(),
  }));

  return {
    sessionId,
    interviewId:
      (() => {
        const interviewId = getNumericValue(params.interviewId);
        return interviewId !== null && interviewId > 0 ? interviewId : Date.now();
      })(),
    userId:
      (() => {
        const userId = getNumericValue(params.userId);
        return userId !== null && userId >= 0 ? userId : getCurrentUserId();
      })(),
    personaId: params.personaId,
    personaType: params.personaType,
    jobId,
    status: "IN_PROGRESS",
    currentQuestionIndex: 0,
    questions: normalizedQuestions,
  };
};

const normalizePreparedInterview = (
  payload: unknown,
  fallbackData: PrepareInterviewRequestData,
): PreparedInterviewData => {
  const responseRecord = getRecord(payload);
  const responseDataRecord = getRecord(responseRecord?.data);
  const sourceRecord = responseDataRecord ?? responseRecord;
  const responseQuestions =
    sourceRecord?.questions ?? sourceRecord?.interviewQuestions;
  const normalizedQuestions = Array.isArray(responseQuestions)
    ? responseQuestions.map((question, index) =>
        normalizeQuestion(question, fallbackData.questions[index] ?? {
          questionId: index + 1,
          intention: "",
          content: "",
        }, index),
      )
    : fallbackData.questions;
  const totalQuestionCount =
    normalizedQuestions.length > 0
      ? normalizedQuestions.length
      : fallbackData.questions.length;
  const currentQuestionIndexCandidate =
    getNumericValue(sourceRecord?.currentQuestionIndex) ??
    fallbackData.currentQuestionIndex;
  const currentQuestionIndex =
    totalQuestionCount > 0
      ? Math.min(Math.max(currentQuestionIndexCandidate, 0), totalQuestionCount - 1)
      : 0;

  return {
    sessionId: getTrimmedString(sourceRecord?.sessionId) ?? fallbackData.sessionId,
    interviewId:
      getNumericValue(sourceRecord?.interviewId) ?? fallbackData.interviewId,
    userId: getNumericValue(sourceRecord?.userId) ?? fallbackData.userId,
    personaId: getNumericValue(sourceRecord?.personaId) ?? fallbackData.personaId,
    personaType: isPersonaType(sourceRecord?.personaType)
      ? sourceRecord.personaType
      : fallbackData.personaType,
    jobId: getTrimmedString(sourceRecord?.jobId) ?? fallbackData.jobId,
    status: isInterviewProgressStatus(sourceRecord?.status)
      ? sourceRecord.status
      : fallbackData.status,
    currentQuestionIndex,
    questions:
      normalizedQuestions.length > 0 ? normalizedQuestions : fallbackData.questions,
  };
};

export const prepareInterview = async (params: PrepareInterviewParams) => {
  const normalizedSessionId = getTrimmedString(params.sessionId);
  const normalizedJobId = getTrimmedString(params.jobId);

  if (!normalizedSessionId) {
    return {
      data: null,
      errorMessage: "면접 세션 정보가 없어 면접을 시작할 수 없습니다.",
    };
  }

  if (!normalizedJobId) {
    return {
      data: null,
      errorMessage: "jobId가 없어 면접을 시작할 수 없습니다.",
    };
  }

  const requestData = buildPrepareInterviewRequest(
    params,
    normalizedSessionId,
    normalizedJobId,
  );

  try {
    const requestPayload = {
      sessionId: requestData.sessionId,
      interviewId: requestData.interviewId,
      userId: requestData.userId,
      personaId: requestData.personaId,
      personaType: requestData.personaType,
      jobId: requestData.jobId,
    };

    console.log("[chat/interviews] request payload", requestPayload);
    const response = await chatInstance.post(PREPARE_INTERVIEW_URL, requestPayload);
    const responseRecord = getRecord(response.data);

    if (responseRecord?.success === false) {
      return {
        data: null,
        errorMessage: "면접 준비에 실패했습니다.",
      };
    }

    const preparedInterview = normalizePreparedInterview(response.data, requestData);

    if (!preparedInterview.sessionId) {
      return {
        data: null,
        errorMessage: "면접 세션 정보를 받지 못했습니다.",
      };
    }

    return {
      data: preparedInterview,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: getErrorMessage(error, "면접 준비에 실패했습니다."),
    };
  }
};
