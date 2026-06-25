const TOKEN_RECORD_KEYS = ["accessToken", "token", "authorization"] as const;
let accessToken: string | null = null;

export const normalizeAccessToken = (value?: string | null) => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  return /^Bearer\s+/i.test(trimmedValue)
    ? trimmedValue
    : `Bearer ${trimmedValue}`;
};

const getTokenFromRecord = (value: unknown): string | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  for (const key of TOKEN_RECORD_KEYS) {
    const tokenValue = record[key];

    if (typeof tokenValue === "string") {
      return normalizeAccessToken(tokenValue);
    }
  }

  if ("data" in record) {
    return getTokenFromRecord(record.data);
  }

  return null;
};

export const getAccessToken = () => accessToken;

export const setAccessToken = (token?: string | null) => {
  accessToken = normalizeAccessToken(token);
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const syncAccessTokenFromResponse = (params: {
  data?: unknown;
  headers?: Record<string, unknown> | null;
}) => {
  const headerAuthorization =
    typeof params.headers?.authorization === "string"
      ? params.headers.authorization
      : typeof params.headers?.Authorization === "string"
        ? params.headers.Authorization
        : null;
  const nextToken =
    normalizeAccessToken(headerAuthorization) ?? getTokenFromRecord(params.data);

  if (!nextToken) {
    return null;
  }

  setAccessToken(nextToken);
  return nextToken;
};
