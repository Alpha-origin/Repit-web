import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const modules = {
  react: {},
  "@/features/feedback-page/feedback-list/api/getAllInterviews": {},
  "@/shared/api/errorMessage": {},
};
function load(path) {
  const source = readFileSync(new URL(`../src/${path}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  vm.runInNewContext(outputText, { exports, require: (name) => {
    if (name.endsWith("?url")) return name;
    assert.ok(name in modules, `Unexpected module: ${name}`);
    return modules[name];
  } });
  return exports;
}
modules["@/shared/constants/job/jobRoles"] = load("shared/constants/job/jobRoles.ts");
modules["@/features/interview-page/company/model/type"] = load("features/interview-page/company/model/type.ts");
modules["@/features/feedback-page/model/interviewDisplay"] = load("features/feedback-page/model/interviewDisplay.ts");
const { getListItems } = load("features/feedback-page/feedback-list/model/useFeedbackList.ts");
const interview = (status, mode = "SOLO") => ({ id: 42, status, mode, sessionId: "s42", createdAt: "2026-10-19T01:00:00Z" });

for (const mode of ["SOLO", "MULTI"]) {
  test(`${mode}: unfinished and unknown interviews are hidden even if feedback exists`, () => {
    for (const status of ["IN_PROGRESS", "ABANDONED", "FAILED", "READY", "PENDING", "UNKNOWN", undefined, null]) {
      for (const feedbackStatus of [undefined, "PENDING", "SUCCEEDED", "FAILED"]) {
        const feedback = feedbackStatus ? { interviewId: 42, sessionId: "s42", status: feedbackStatus } : null;
        for (const matchBySession of [false, true]) {
          const byId = new Map(feedback && !matchBySession ? [[42, feedback]] : []);
          const bySession = new Map(feedback && matchBySession ? [["s42", feedback]] : []);
          assert.equal(getListItems([interview(status, mode)], byId, bySession).length, 0);
        }
      }
    }
  });
  test(`${mode}: only completed interviews show actual feedback status or analysis waiting`, () => {
    const labels = [[undefined, "분석 대기"], ["PENDING", "분석중"], ["SUCCEEDED", "분석완료"], ["FAILED", "분석실패"]];
    for (const [status, label] of labels) {
      const feedback = status ? new Map([[42, { interviewId: 42, status }]]) : new Map();
      const items = getListItems([interview("COMPLETED", mode)], feedback, new Map());
      assert.equal(items.length, 1);
      assert.equal(items[0].statusLabel, label);
      assert.equal(items[0].id, 42);
    }
  });
}

test("mixed list keeps completed interviews newest-first without mutating input", () => {
  const items = [interview("COMPLETED"), { ...interview("IN_PROGRESS"), id: 44, createdAt: "2026-10-19T05:00:00Z" },
    { ...interview("COMPLETED", "MULTI"), id: 43, createdAt: "2026-10-19T03:00:00Z" }];
  const result = getListItems(items, new Map(), new Map());
  assert.equal(JSON.stringify(result.map((item) => item.id)), "[43,42]");
  assert.deepEqual(items.map((item) => item.id), [42,44,43]);
});
