import axios from "axios";

const getRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as Record<string, unknown>;
};

const getTrimmedString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
};

const getMessageFromValue = (value: unknown, depth = 0): string | null => {
  if (depth > 4) {
    return null;
  }

  const directMessage = getTrimmedString(value);

  if (directMessage) {
    return directMessage;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nextMessage = getMessageFromValue(item, depth + 1);

      if (nextMessage) {
        return nextMessage;
      }
    }

    return null;
  }

  const record = getRecord(value);

  if (!record) {
    return null;
  }

  for (const key of [
    "message",
    "error",
    "detail",
    "title",
    "statusText",
    "reason",
  ]) {
    const nextMessage = getMessageFromValue(record[key], depth + 1);

    if (nextMessage) {
      return nextMessage;
    }
  }

  return getTrimmedString(record.code);
};

export const extractErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
    }

    const responseMessage = getMessageFromValue(error.response.data);

    if (responseMessage) {
      return responseMessage;
    }
  }

  const nestedMessage = getMessageFromValue(error);

  if (nestedMessage) {
    return nestedMessage;
  }

  if (error instanceof Error) {
    const errorMessage = getTrimmedString(error.message);

    if (errorMessage) {
      return errorMessage;
    }
  }

  return fallback;
};
