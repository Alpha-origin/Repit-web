import { useEffect, useState } from "react";

const TICK_INTERVAL_MS = 1_000;

const getStartedAtKey = (sessionId: string | null) =>
  sessionId ? `interview-started-at:${sessionId}` : null;

const readStoredStartedAt = (storageKey: string | null) => {
  if (!storageKey) {
    return null;
  }

  const storedValue = Number(window.sessionStorage.getItem(storageKey));

  return Number.isFinite(storedValue) && storedValue > 0 ? storedValue : null;
};

const toElapsedSeconds = (startedAt: number) =>
  Math.max(0, Math.floor((Date.now() - startedAt) / 1_000));

/**
 * 면접 전체 경과 시간. 첫 질문이 도착하면 시작하고 답변 방식이나 질문 전환과
 * 관계없이 계속 누적한다. 시작 시각을 sessionStorage에 남겨 새로고침해도 이어진다.
 */
export const useInterviewElapsedTime = (
  sessionId: string | null,
  isStarted: boolean,
) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isStarted) {
      return;
    }

    const storageKey = getStartedAtKey(sessionId);
    const startedAt = readStoredStartedAt(storageKey) ?? Date.now();

    if (storageKey) {
      window.sessionStorage.setItem(storageKey, String(startedAt));
    }

    const tick = () => setElapsedSeconds(toElapsedSeconds(startedAt));

    // 누적 카운터가 아니라 시작 시각과의 차이로 계산해야 백그라운드 탭에서
    // 타이머가 눌려도 실제 경과 시간과 어긋나지 않는다.
    const intervalId = window.setInterval(tick, TICK_INTERVAL_MS);

    tick();

    return () => window.clearInterval(intervalId);
  }, [isStarted, sessionId]);

  return isStarted ? elapsedSeconds : 0;
};
