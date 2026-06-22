import { CHAT_URL } from "@/shared/api/axiosInstance";
import { getAccessToken } from "@/shared/api/accessToken";

import { getInterviewEvent, getTrimmedString } from "../shared";

let interviewSocket: WebSocket | null = null;
let activeInterviewSocketSessionId: string | null = null;

const createInterviewSocketUrl = (sessionId: string) => {
  const baseUrl =
    CHAT_URL || (typeof window !== "undefined" ? window.location.origin : "");

  if (!baseUrl) {
    return "";
  }

  const socketUrl = new URL("/ws/chat/interviews", baseUrl);
  socketUrl.searchParams.set("sessionId", sessionId);

  const accessToken = getAccessToken()?.replace(/^Bearer\s+/i, "").trim();

  if (accessToken) {
    socketUrl.searchParams.set("accessToken", accessToken);
  }

  socketUrl.protocol = socketUrl.protocol === "https:" ? "wss:" : "ws:";

  return socketUrl.toString();
};

export const connectInterviewSocket = (sessionId: string) => {
  const normalizedSessionId = getTrimmedString(sessionId);

  if (!normalizedSessionId) {
    return null;
  }

  if (
    interviewSocket &&
    activeInterviewSocketSessionId === normalizedSessionId &&
    (interviewSocket.readyState === WebSocket.CONNECTING ||
      interviewSocket.readyState === WebSocket.OPEN)
  ) {
    return interviewSocket;
  }

  if (interviewSocket) {
    interviewSocket.close();
    interviewSocket = null;
    activeInterviewSocketSessionId = null;
  }

  const socketUrl = createInterviewSocketUrl(normalizedSessionId);

  if (!socketUrl) {
    return null;
  }

  const socket = new WebSocket(socketUrl);

  activeInterviewSocketSessionId = normalizedSessionId;
  interviewSocket = socket;

  socket.addEventListener("close", () => {
    if (interviewSocket !== socket) {
      return;
    }

    interviewSocket = null;
    activeInterviewSocketSessionId = null;
  });

  return socket;
};

export const parseInterviewSocketMessage = (data: unknown) => {
  if (typeof data !== "string") {
    return {
      status: null,
      question: null,
      message: null,
    };
  }

  try {
    return getInterviewEvent(JSON.parse(data));
  } catch {
    return getInterviewEvent(data);
  }
};

export const disconnectInterviewSocket = (sessionId?: string) => {
  if (!interviewSocket) {
    return;
  }

  const normalizedSessionId =
    sessionId === undefined ? null : getTrimmedString(sessionId);

  if (
    normalizedSessionId &&
    activeInterviewSocketSessionId !== normalizedSessionId
  ) {
    return;
  }

  const socket = interviewSocket;

  interviewSocket = null;
  activeInterviewSocketSessionId = null;

  if (
    socket.readyState === WebSocket.OPEN ||
    socket.readyState === WebSocket.CONNECTING
  ) {
    socket.close();
  }
};
