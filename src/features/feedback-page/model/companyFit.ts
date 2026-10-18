import type { QuestionFeedback } from "@/features/feedback-page/feedback-list/api/getAllInterviews";

export interface CompanyFitItem {
  factId: string;
  kind: string;
  focus: string;
  text: string;
  questions: { questionId: string; label: string }[];
}
export interface CompanyFit {
  comment: string;
  matchedFocus: CompanyFitItem[];
  gaps: CompanyFitItem[];
}
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown, max: number): value is string => typeof value === "string" &&
  [...value.trim()].length >= 1 && [...value.trim()].length <= max;

export const readCompanyFit = (value: unknown, feedbacks: readonly QuestionFeedback[]): CompanyFit | null => {
  if (!record(value) || !text(value.comment, 300) || !Array.isArray(value.matchedFocus) || !Array.isArray(value.gaps) ||
    value.matchedFocus.length > 3 || value.gaps.length > 3) return null;
  const questions = new Map<string, { questionId: string; label: string }>();
  (Array.isArray(feedbacks) ? feedbacks : []).forEach((question, index) => {
    if (!record(question) || (typeof question.questionId !== "string" && typeof question.questionId !== "number")) return;
    if (question.questionId === undefined || question.questionId === null || !String(question.questionId).trim()) return;
    const id = String(question.questionId);
    if (!questions.has(id)) questions.set(id, { questionId: id, label: `문항 ${index + 1}` });
  });
  const readItems = (items: unknown[], field: "evidence" | "suggestion") => {
    const seen = new Set<string>();
    const valid: CompanyFitItem[] = [];
    for (const item of items) {
      if (!record(item) || !text(item.factId, 32) || !text(item.focus, 20) || !text(item[field], 150) ||
        !["BUSINESS", "PROBLEM", "TALENT", "MISSION_VISION", "TECH_STACK"].includes(String(item.kind)) || !Array.isArray(item.questionIds)) continue;
      const links = [...new Set(item.questionIds.filter((id): id is string => typeof id === "string" && !!id.trim()))]
        .flatMap((id) => questions.get(id) ? [questions.get(id)!] : []);
      const factId = item.factId.trim();
      if (!links.length || seen.has(factId)) continue;
      seen.add(factId);
      valid.push({ factId, kind: String(item.kind), focus: item.focus.trim(), text: String(item[field]).trim(), questions: links });
    }
    return valid;
  };
  const matchedFocus = readItems(value.matchedFocus, "evidence");
  const gaps = readItems(value.gaps, "suggestion");
  if (value.matchedFocus.length + value.gaps.length > 0 && matchedFocus.length + gaps.length === 0) return null;
  return { comment: value.comment.trim(), matchedFocus, gaps };
};
