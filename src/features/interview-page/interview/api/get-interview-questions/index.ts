import { apiInstance } from "@/shared/api/axiosInstance";

import {
  getErrorMessage,
  getNumericValue,
  getRecord,
  getTrimmedString,
} from "../shared";
import type {
  GetInterviewQuestionsParams,
  InterviewOriginalQuestion,
} from "../type";

const GET_INTERVIEW_QUESTIONS_URL = "/api/question/getAll";

const normalizeQuestion = (
  value: unknown,
  index: number,
): InterviewOriginalQuestion | null => {
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

const normalizeQuestions = (payload: unknown) => {
  const responseRecord = getRecord(payload);
  const questions = Array.isArray(responseRecord?.data)
    ? responseRecord.data
    : Array.isArray(payload)
      ? payload
      : [];

  return questions.reduce<InterviewOriginalQuestion[]>((accumulator, question, index) => {
    const normalizedQuestion = normalizeQuestion(question, index);

    if (normalizedQuestion) {
      accumulator.push(normalizedQuestion);
    }

    return accumulator;
  }, []);
};

export const getInterviewQuestions = async (
  params: GetInterviewQuestionsParams,
) => {
  try {
    const response = await apiInstance.get(GET_INTERVIEW_QUESTIONS_URL, {
      params: {
        interviewId: params.interviewId,
      },
    });
    const responseRecord = getRecord(response.data);

    if (responseRecord?.success === false) {
      return {
        data: null,
        errorMessage: "면접 질문을 불러오지 못했습니다.",
      };
    }

    return {
      data: normalizeQuestions(response.data),
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: getErrorMessage(error, "면접 질문을 불러오지 못했습니다."),
    };
  }
};
