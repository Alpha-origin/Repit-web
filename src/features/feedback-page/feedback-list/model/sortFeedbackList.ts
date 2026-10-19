import type { FeedbackListItem } from "@/widgets/feedback-page/feedback-list/type";

export type FeedbackListSortKey = "date" | "score";
export type FeedbackListSortOrder = "asc" | "desc";

export interface FeedbackListSort {
  key: FeedbackListSortKey;
  order: FeedbackListSortOrder;
}

export const DEFAULT_FEEDBACK_LIST_SORT: FeedbackListSort = {
  key: "date",
  order: "desc",
};

export const FEEDBACK_LIST_SORT_KEY_LABELS: Record<FeedbackListSortKey, string> = {
  date: "날짜",
  score: "종합 점수",
};

const SORT_ORDER_LABELS: Record<FeedbackListSortKey, Record<FeedbackListSortOrder, string>> = {
  date: { desc: "최신순", asc: "오래된 순" },
  score: { desc: "높은 점수순", asc: "낮은 점수순" },
};

export const getFeedbackListSortLabel = ({ key, order }: FeedbackListSort) =>
  SORT_ORDER_LABELS[key][order];

const isSortKey = (value: string | null): value is FeedbackListSortKey =>
  value === "date" || value === "score";

const isSortOrder = (value: string | null): value is FeedbackListSortOrder =>
  value === "asc" || value === "desc";

// 쿼리가 없거나 값이 틀리면 기본값(날짜 · 내림차순)을 쓴다.
export const readFeedbackListSort = (
  searchParams: URLSearchParams,
): FeedbackListSort => {
  const key = searchParams.get("sort");
  const order = searchParams.get("order");

  return isSortKey(key) && isSortOrder(order)
    ? { key, order }
    : DEFAULT_FEEDBACK_LIST_SORT;
};

// 기본값이면 sort·order 쿼리를 붙이지 않는다.
export const writeFeedbackListSort = (
  searchParams: URLSearchParams,
  sort: FeedbackListSort,
) => {
  const next = new URLSearchParams(searchParams);

  if (
    sort.key === DEFAULT_FEEDBACK_LIST_SORT.key &&
    sort.order === DEFAULT_FEEDBACK_LIST_SORT.order
  ) {
    next.delete("sort");
    next.delete("order");
  } else {
    next.set("sort", sort.key);
    next.set("order", sort.order);
  }

  return next;
};

const getCreatedTime = (item: FeedbackListItem) => {
  const time = item.createdAt ? Date.parse(item.createdAt) : Number.NaN;

  return Number.isNaN(time) ? 0 : time;
};

const getScore = (item: FeedbackListItem) =>
  typeof item.totalScore === "number" && Number.isFinite(item.totalScore)
    ? item.totalScore
    : null;

export const sortFeedbackList = <T extends FeedbackListItem>(
  items: readonly T[],
  { key, order }: FeedbackListSort,
): T[] => {
  const direction = order === "asc" ? 1 : -1;
  const latestFirst = (left: T, right: T) =>
    getCreatedTime(right) - getCreatedTime(left);

  if (key === "date") {
    return [...items].sort(
      (left, right) => direction * (getCreatedTime(left) - getCreatedTime(right)),
    );
  }

  // 점수가 없는 항목은 방향과 관계없이 맨 뒤, 그 안과 동점은 최신순.
  return [...items].sort((left, right) => {
    const leftScore = getScore(left);
    const rightScore = getScore(right);

    if (leftScore === null || rightScore === null) {
      if (leftScore !== rightScore) {
        return leftScore === null ? 1 : -1;
      }

      return latestFirst(left, right);
    }

    return direction * (leftScore - rightScore) || latestFirst(left, right);
  });
};
