import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PreparedInterviewData } from "@/features/interview-page/interview/api";
import { getCreatedInterview } from "@/features/interview-page/interview/api/create-interview";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import { loadSetupDraft } from "./draftStore";

// 진행 URL의 히스토리 state가 남아 있어도 종료 여부와 기업명은 서버에서 다시 확인한다.
export const useInterviewEntry = (
  prepared: PreparedInterviewData | null,
  draftId: string | null,
  userId: number | null,
  isLoaded: boolean,
) => {
  const navigate = useNavigate();
  const key = `${draftId}:${prepared?.interviewId}:${userId}`;
  const [entry, setEntry] = useState<{ key: string; data: PreparedInterviewData | null; error: string | null } | null>(null);
  useEffect(() => {
    if (!draftId || !prepared || !isLoaded || userId !== prepared.userId) return;
    const controller = new AbortController();
    void (async () => {
      try {
        const draft = loadSetupDraft(draftId);
        if (!draft?.submission || draft.submission.interviewId !== prepared.interviewId) {
          throw new Error("면접 설정을 복구할 수 없습니다. 사전 설정에서 다시 시작해주세요.");
        }
        const data = await getCreatedInterview(prepared.interviewId, draft.submission.requestBody, controller.signal);
        if (controller.signal.aborted) return;
        if (data.userId !== userId) throw new Error("면접 접근 권한이 없습니다.");
        if (data.status === "COMPLETED") {
          void navigate(`/main/feedback/overall/${data.interviewId}`, { replace: true });
          return;
        }
        if (data.status === "ABANDONED") throw new Error("종료된 면접입니다. 새 면접을 만들어주세요.");
        setEntry({ key, data: { ...prepared, answerMode: data.answerMode === "TEXT" ? "text" : data.answerMode === "VOICE" ? "voice" : prepared.answerMode, sessionId: data.sessionId, company: data.company, status: data.status }, error: null });
      } catch (error) {
        if (!controller.signal.aborted) setEntry({ key, data: null, error: extractErrorMessage(error, "면접 정보를 확인하지 못했습니다.") });
      }
    })();
    return () => controller.abort();
  }, [draftId, prepared, userId, isLoaded, key, navigate]);
  return {
    isChecking: !!draftId && entry?.key !== key,
    prepared: draftId ? (entry?.key === key ? entry.data : null) : prepared,
    error: entry?.key === key ? entry.error : null,
  };
};
