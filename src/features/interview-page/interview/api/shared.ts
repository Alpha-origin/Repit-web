import { getAccessToken } from "@/shared/api/accessToken";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import type {
  CurrentInterviewQuestion,
  InterviewProgressStatus,
  PersonaType,
} from "./type";

const PERSONA_TYPES: readonly PersonaType[] = ["FRIENDLY", "NEUTRAL", "STRESS"];
const INTERVIEW_PROGRESS_STATUSES: readonly InterviewProgressStatus[] = [
  "IN_PROGRESS",
  "COMPLETED",
  "READY",
  "ABANDONED",
];

export const getErrorMessage = (error: unknown, fallback: string) => {
  return extractErrorMessage(error, fallback);
};

export const getRecord = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as Record<string, unknown>;
};

export const getTrimmedString = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
};

export const getNumericValue = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return null;
    }

    const parsedValue = Number(trimmedValue);

    if (Number.isFinite(parsedValue)) {
      return Math.trunc(parsedValue);
    }
  }

  return null;
};

export const isPersonaType = (value: unknown): value is PersonaType =>
  typeof value === "string" &&
  PERSONA_TYPES.includes(value as PersonaType);

export const isInterviewProgressStatus = (
  value: unknown,
): value is InterviewProgressStatus =>
  typeof value === "string" &&
  INTERVIEW_PROGRESS_STATUSES.includes(value as InterviewProgressStatus);

export const getInterviewQuestion = (
  value: unknown,
): CurrentInterviewQuestion | null => {
  const questionRecord = getRecord(value);
  const questionId =
    getNumericValue(questionRecord?.questionId ?? questionRecord?.id);
  const content = getTrimmedString(
    questionRecord?.content ?? questionRecord?.question ?? questionRecord?.text,
  );

  if (questionId === null || !content) {
    return null;
  }

  return {
    questionId,
    parentId: getNumericValue(questionRecord?.parentId) ?? 0,
    type: getTrimmedString(questionRecord?.type) ?? "ORIGINAL",
    intention:
      getTrimmedString(questionRecord?.intention ?? questionRecord?.purpose) ??
      "",
    content,
  };
};

export const getInterviewEvent = (value: unknown) => {
  const responseRecord = getRecord(value);
  const responseDataRecord = getRecord(responseRecord?.data);
  const sourceRecord = responseDataRecord ?? responseRecord;
  const statusValue = sourceRecord?.status ?? responseRecord?.status;

  return {
    status: isInterviewProgressStatus(statusValue) ? statusValue : null,
    question: getInterviewQuestion(sourceRecord?.question ?? sourceRecord),
    message: getTrimmedString(
      sourceRecord?.message ?? responseRecord?.message,
    ),
  };
};

export const getCurrentUserId = () => {
  const currentAccessToken = getAccessToken();
  const trimmedValue = currentAccessToken?.replace(/^Bearer\s+/i, "").trim();

  if (!trimmedValue) {
    return 0;
  }

  const payload = trimmedValue.split(".")[1];

  if (!payload) {
    return 0;
  }

  try {
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decodedPayload = globalThis.atob(normalizedPayload);
    const record = getRecord(JSON.parse(decodedPayload));

    if (!record) {
      return 0;
    }

    for (const claimKey of ["userId", "id", "memberId", "sub"]) {
      const candidate = getNumericValue(record[claimKey]);

      if (candidate !== null && candidate >= 0) {
        return candidate;
      }
    }
  } catch {
    return 0;
  }

  return 0;
};
