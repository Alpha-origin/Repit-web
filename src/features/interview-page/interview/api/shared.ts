import axios from "axios";
import type { InterviewProgressStatus, PersonaType } from "./type";

interface ErrorResponse {
  message?: string;
  error?: string;
}

const PERSONA_TYPES: readonly PersonaType[] = ["FRIENDLY", "NORMAL", "PRESSURE"];
const INTERVIEW_PROGRESS_STATUSES: readonly InterviewProgressStatus[] = [
  "IN_PROGRESS",
  "COMPLETED",
  "READY",
];
const ACCESS_TOKEN_STORAGE_KEYS = [
  "accessToken",
  "ACCESS_TOKEN",
  "authorization",
  "Authorization",
  "authToken",
  "token",
] as const;

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
    }

    const data = error.response.data as ErrorResponse | undefined;

    if (data?.message) return data.message;
    if (data?.error) return data.error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
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

export const getCurrentUserId = () => {
  if (typeof window === "undefined") {
    return 0;
  }

  for (const key of ACCESS_TOKEN_STORAGE_KEYS) {
    const storedValue =
      window.sessionStorage.getItem(key) ?? window.localStorage.getItem(key);
    const trimmedValue = storedValue?.replace(/^Bearer\s+/i, "").trim();

    if (!trimmedValue) {
      continue;
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
  }

  return 0;
};
