import { createInterview } from "@/features/interview-page/interview/api";
import { buildSoloInterviewPayload } from "@/features/interview-page/setting-interview/model/submitSoloInterview";
import { buildMultiInterviewPayload } from "@/features/interview-page/setting-multi-interview/model/submitMultiInterview";
import { currentOwnerKey, loadSetupDraft, saveSetupDraft, type SetupDraft } from "./draftStore";

const requests = new Map<string, Promise<SetupDraft>>();
export const COMPANY_ERRORS: Record<string, string> = {
  COMPANY_UNAVAILABLE: "현재 선택할 수 없는 기업입니다. 다른 기업을 선택하거나 기업 없이 시작해주세요.",
  COMPANY_CONTEXT_UNAVAILABLE: "선택한 기업의 자료를 사용할 수 없습니다. 다른 기업을 선택하거나 기업 없이 시작해주세요.",
  IDEMPOTENCY_KEY_REUSED: "다른 설정으로 처리 중인 요청이 있습니다. 기존 제출 결과를 다시 확인해주세요.",
};

export const submitSetupDraft = (draftId: string): Promise<SetupDraft> => {
  const existing = requests.get(draftId);
  if (existing) return existing;
  const request = (async () => {
    let draft = loadSetupDraft(draftId);
    if (!draft) throw new Error("설정이 만료되었거나 복구할 수 없습니다. 사전 설정부터 다시 시작해주세요.");
    if (draft.submission?.interviewId) return draft;
    if (!draft.submission) {
      const body = await (draft.settings.mode === "SOLO"
        ? buildSoloInterviewPayload(draft.settings) : buildMultiInterviewPayload(draft.settings));
      // 페르소나 저장 대기 중 사용자 전환/초안 변경도 확인한다.
      const latest = loadSetupDraft(draftId);
      if (!latest || currentOwnerKey() !== draft.ownerKey) throw new Error("사용자가 변경되었습니다.");
      if (JSON.stringify(latest.settings) !== JSON.stringify(draft.settings) || latest.companyId !== draft.companyId) {
        throw new Error("면접 설정이 변경되었습니다. 변경된 설정으로 다시 시작해주세요.");
      }
      draft = saveSetupDraft({ ...latest, updatedAt: new Date().toISOString(), submission: {
        idempotencyKey: crypto.randomUUID(),
        requestBody: { ...body, answerMode: latest.settings.answerMode === "text" ? "TEXT" : "VOICE", ...(latest.companyId !== null ? { companyId: latest.companyId } : {}) },
        interviewId: null, state: "SUBMITTING",
      } });
    }
    const submission = draft.submission!;
    // 새로고침에서 SUBMITTING도 같은 본문과 키로만 재전송한다.
    const result = await createInterview(submission.requestBody, submission.idempotencyKey);
    if (currentOwnerKey() !== draft.ownerKey) throw new Error("사용자가 변경되었습니다.");
    if (!result.data) {
      const definitive = result.definitive || result.code === "COMPANY_UNAVAILABLE" || result.code === "COMPANY_CONTEXT_UNAVAILABLE";
      saveSetupDraft({ ...draft, submission: definitive ? null : { ...submission, state: "UNKNOWN" } });
      throw new Error(([401, 403].includes(result.statusCode ?? 0) ? result.errorMessage : null) || (result.code && COMPANY_ERRORS[result.code]) ||
        (definitive ? result.errorMessage ?? "면접 설정을 확인해주세요." : "생성 결과를 확인하지 못했습니다. 같은 요청으로 결과를 다시 확인해주세요."));
    }
    if (String(result.data.userId) !== draft.ownerKey) throw new Error("면접 접근 권한을 확인하지 못했습니다.");
    return saveSetupDraft({ ...draft, submission: { ...submission, interviewId: result.data.interviewId, state: "CREATED" } });
  })().finally(() => requests.delete(draftId));
  requests.set(draftId, request);
  return request;
};
