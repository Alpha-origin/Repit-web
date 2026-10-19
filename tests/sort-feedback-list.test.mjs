import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/features/feedback-page/feedback-list/model/sortFeedbackList.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } });
const sorter = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const { sortFeedbackList, readFeedbackListSort, writeFeedbackListSort, getFeedbackListSortLabel } = sorter;

const item = (id, createdAt, totalScore) => ({ id, createdAt, totalScore, date: createdAt.slice(0, 10) });
const items = [
  item(1, "2026-10-17T09:00:00Z", 70),
  item(2, "2026-10-19T03:00:00Z", 89),
  item(3, "2026-10-19T12:10:00Z", undefined),
  item(4, "2026-10-18T05:00:00Z", 89),
  item(5, "2026-10-16T05:00:00Z", undefined),
  item(6, "2026-10-19T08:00:00Z", 55),
];
const ids = (key, order) => sortFeedbackList(items, { key, order }).map((entry) => entry.id);

test("four combinations", () => {
  assert.deepEqual(ids("date", "desc"), [3, 6, 2, 4, 1, 5]);
  assert.deepEqual(ids("date", "asc"), [5, 1, 4, 2, 6, 3]);
  assert.deepEqual(ids("score", "desc"), [2, 4, 1, 6, 3, 5]);
  assert.deepEqual(ids("score", "asc"), [6, 1, 2, 4, 3, 5]);
});
test("same day at different times is ordered by timestamp", () => {
  const sameDay = ids("date", "desc").filter((id) => [2, 3, 6].includes(id));
  assert.deepEqual(sameDay, [3, 6, 2]);
});
test("missing scores stay last in both directions, latest first", () => {
  for (const order of ["asc", "desc"]) assert.deepEqual(ids("score", order).slice(-2), [3, 5]);
});
test("ties on score break by latest first", () => {
  for (const order of ["asc", "desc"]) {
    const tied = ids("score", order).filter((id) => id === 2 || id === 4);
    assert.deepEqual(tied, [2, 4]);
  }
});
test("does not mutate input", () => {
  const copy = [...items];
  sortFeedbackList(items, { key: "score", order: "asc" });
  assert.deepEqual(items, copy);
});
test("query read/write: default omitted, invalid falls back", () => {
  assert.deepEqual(readFeedbackListSort(new URLSearchParams("")), { key: "date", order: "desc" });
  assert.deepEqual(readFeedbackListSort(new URLSearchParams("sort=score&order=asc")), { key: "score", order: "asc" });
  for (const query of ["sort=name&order=asc", "sort=score", "sort=score&order=up"]) {
    assert.deepEqual(readFeedbackListSort(new URLSearchParams(query)), { key: "date", order: "desc" });
  }
  assert.equal(writeFeedbackListSort(new URLSearchParams("sort=score&order=asc&x=1"), { key: "date", order: "desc" }).toString(), "x=1");
  assert.equal(writeFeedbackListSort(new URLSearchParams(""), { key: "score", order: "desc" }).toString(), "sort=score&order=desc");
});
test("labels", () => {
  assert.deepEqual(
    [["date", "desc"], ["date", "asc"], ["score", "desc"], ["score", "asc"]].map(([key, order]) => getFeedbackListSortLabel({ key, order })),
    ["최신순", "오래된 순", "높은 점수순", "낮은 점수순"],
  );
});
