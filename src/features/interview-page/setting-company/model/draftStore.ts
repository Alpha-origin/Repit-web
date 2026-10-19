import { create } from "zustand";
import { useUserStore } from "@/shared/store/userStore";
import type { CreateInterviewParams } from "@/features/interview-page/interview/api";
import { getJobRole } from "@/shared/constants/job/jobRoles";
import { readInterviewDraft, type InterviewDraft } from "./draft";

const PREFIX = "repit:interview-setup:";
const TTL = 2 * 60 * 60_000;
const uuid = (value: unknown): value is string => typeof value === "string" && /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(value);
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const positiveId = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value > 0;

export interface SetupDraft {
  draftId: string;
  ownerKey: string;
  mode: InterviewDraft["mode"];
  settings: InterviewDraft;
  companyId: number | null;
  updatedAt: string;
  submission: {
    idempotencyKey: string;
    requestBody: CreateInterviewParams;
    interviewId: number | null;
    state: "SUBMITTING" | "UNKNOWN" | "CREATED";
  } | null;
}

export const currentOwnerKey = () => {
  const { id, isLoaded } = useUserStore.getState();
  return isLoaded && positiveId(id) ? String(id) : null;
};

const validBody = (body: unknown, draft: SetupDraft): body is CreateInterviewParams => {
  if (!record(body) || (draft.companyId === null && "companyId" in body) || (body.companyId !== undefined && body.companyId !== draft.companyId) ||
    (draft.companyId !== null && body.companyId !== draft.companyId)) return false;
  if (body.answerMode !== undefined && body.answerMode !== null &&
    body.answerMode !== (draft.settings.answerMode === "text" ? "TEXT" : "VOICE")) return false;
  if (draft.mode === "MULTI") return Object.keys(body).every((key) => ["personaIds", "companyId", "answerMode"].includes(key)) &&
    Array.isArray(body.personaIds) && body.personaIds.length === (draft.settings.mode === "MULTI" ? draft.settings.slots.length : 0) &&
    body.personaIds.every(positiveId) && new Set(body.personaIds).size === body.personaIds.length;
  return Object.keys(body).every((key) => ["personaName", "major", "type", "career", "gender", "companyId", "answerMode"].includes(key)) &&
    typeof body.personaName === "string" && body.personaName.length > 0 && body.personaName.length < 200 &&
    ["FRIENDLY", "REALISTIC", "METICULOUS"].includes(String(body.type)) &&
    typeof body.career === "number" && Number.isFinite(body.career) && body.career >= 0 &&
    ["MALE", "FEMALE"].includes(String(body.gender)) &&
    (body.major === undefined || getJobRole(String(body.major)) !== undefined);
};

export const parseSetupDraft = (value: unknown, ownerKey: string, now = Date.now()): SetupDraft | null => {
  if (!record(value) || !uuid(value.draftId) || value.ownerKey !== ownerKey ||
    (value.companyId !== null && !positiveId(value.companyId)) || typeof value.updatedAt !== "string") return null;
  const settings = readInterviewDraft({ draft: value.settings });
  const updatedAt = Date.parse(value.updatedAt);
  if (!settings || settings.mode !== value.mode || !Number.isFinite(updatedAt) || updatedAt > now + 60_000) return null;
  const draft: SetupDraft = { draftId: value.draftId, ownerKey, mode: settings.mode, settings,
    companyId: value.companyId as number | null, updatedAt: value.updatedAt, submission: null };
  if (value.submission !== null) {
    const submission = value.submission;
    if (!record(submission) || !uuid(submission.idempotencyKey) ||
      !["SUBMITTING", "UNKNOWN", "CREATED"].includes(String(submission.state)) ||
      !validBody(submission.requestBody, draft) ||
      (submission.interviewId !== null && !positiveId(submission.interviewId)) ||
      (submission.state === "CREATED" ? !positiveId(submission.interviewId) : submission.interviewId !== null)) return null;
    draft.submission = { idempotencyKey: submission.idempotencyKey, requestBody: submission.requestBody,
      interviewId: submission.interviewId as number | null, state: submission.state as NonNullable<SetupDraft["submission"]>["state"] };
  }
  // 결과 불명인 제출도 TTL로 버리면 중복 생성될 수 있어 복구할 때까지 유지한다.
  return !draft.submission && now - updatedAt > TTL ? null : draft;
};

export const useSetupDraftStore = create<{ drafts: Record<string, SetupDraft> }>(() => ({ drafts: {} }));
const storageKey = (owner: string, id: string) => `${PREFIX}${owner}:${id}`;

export const saveSetupDraft = (draft: SetupDraft) => {
  if (currentOwnerKey() !== draft.ownerKey) throw new Error("사용자가 변경되었습니다. 사전 설정부터 다시 시작해주세요.");
  const validated = parseSetupDraft(draft, draft.ownerKey);
  if (!validated) throw new Error("면접 설정을 다시 확인해주세요.");
  try {
    sessionStorage.setItem(storageKey(draft.ownerKey, draft.draftId), JSON.stringify(validated));
  } catch {
    throw new Error("설정을 저장할 수 없습니다. 브라우저 저장 공간을 확인해주세요.");
  }
  useSetupDraftStore.setState((state) => ({ drafts: { ...state.drafts, [draft.draftId]: validated } }));
  return validated;
};

export const loadSetupDraft = (id: string | null): SetupDraft | null => {
  const owner = currentOwnerKey();
  if (!owner || !uuid(id)) return null;
  const key = storageKey(owner, id);
  try {
    const stored = useSetupDraftStore.getState().drafts[id] ?? JSON.parse(sessionStorage.getItem(key) ?? "null");
    const draft = parseSetupDraft(stored, owner);
    if (draft && draft.draftId === id) return draft;
    sessionStorage.removeItem(key);
  } catch {
    try { sessionStorage.removeItem(key); } catch { /* 저장소 접근이 차단된 경우 */ }
  }
  return null;
};

export const upsertSettingsDraft = (settings: InterviewDraft, id: string | null) => {
  const ownerKey = currentOwnerKey();
  if (!ownerKey) throw new Error("로그인 정보를 확인한 뒤 다시 시도해주세요.");
  const existing = loadSetupDraft(id);
  if (existing?.submission) return existing;
  return saveSetupDraft({ draftId: existing?.draftId ?? crypto.randomUUID(), ownerKey,
    mode: settings.mode, settings, companyId: existing?.companyId ?? null,
    updatedAt: new Date().toISOString(), submission: null });
};

export const clearOwnerDrafts = (owner: string) => {
  try {
    const keys = Array.from({ length: sessionStorage.length }, (_, index) => sessionStorage.key(index));
    keys.forEach((key) => { if (key?.startsWith(`${PREFIX}${owner}:`)) sessionStorage.removeItem(key); });
  } catch { /* 메모리 초안도 함께 제거한다. */ }
  useSetupDraftStore.setState((state) => ({ drafts: Object.fromEntries(Object.entries(state.drafts).filter(([, draft]) => draft.ownerKey !== owner)) }));
};

useUserStore.subscribe((next, previous) => {
  if (previous.id !== null && next.id !== previous.id) clearOwnerDrafts(String(previous.id));
  if (!next.isLoaded || next.id === null) return;
  // 새로고침 후에도 이전 사용자의 기능 초안만 제거한다.
  try {
    const keys = Array.from({ length: sessionStorage.length }, (_, index) => sessionStorage.key(index));
    keys.forEach((key) => {
      if (key?.startsWith(PREFIX) && !key.startsWith(`${PREFIX}${next.id}:`)) sessionStorage.removeItem(key);
    });
  } catch { /* 저장소가 차단되면 제출 전 저장 단계에서 안내한다. */ }
});
