import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

// 실제 API 모듈을 실행하고 HTTP 경계만 대체한다.
function fixture({ status = "COMPLETED", mode = "SOLO", feedback = null, statusError = null } = {}) {
  const calls = [];
  const state = { status, statusError };
  const apiInstance = {
    async get(url, options) {
      calls.push({ method: "GET", url, options });
      if (url === "/api/interviews/get") {
        if (state.statusError) throw state.statusError;
        return { data: { data: { status: state.status, mode } } };
      }
      if (feedback) return { data: { success: true, data: feedback } };
      throw { isAxiosError: true, response: { status: 404 } };
    },
    async post(url, body, options) {
      calls.push({ method: "POST", url, body, options });
      return { data: { success: true, data: { status: "PENDING", sessionId: "test-session" } } };
    },
  };
  const modules = {
    axios: { isAxiosError: (error) => error?.isAxiosError === true },
    "@/shared/api/axiosInstance": { apiInstance, ensureAccessToken: async () => "test-only-token" },
    "@/shared/api/errorMessage": { extractErrorMessage: (_error, fallback) => fallback },
  };
  function load(path) {
    const source = readFileSync(new URL(`../src/${path}`, import.meta.url), "utf8");
    const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
    const exports = {};
    vm.runInNewContext(outputText, { exports, require: (name) => {
      assert.ok(name in modules, `Unexpected import: ${name}`);
      return modules[name];
    } });
    return exports;
  }
  modules["@/features/feedback-page/api/getInterviewStatus"] = load("features/feedback-page/api/getInterviewStatus.ts");
  return { ...load("features/feedback-page/feedback-list/api/getAllInterviews.ts"), calls, state };
}

for (const mode of ["SOLO", "MULTI"]) {
  for (const status of ["ABANDONED", "IN_PROGRESS", null, "UNKNOWN"]) {
    test(`${mode}: no generation for latest status ${status}`, async () => {
      const f = fixture({ mode, status });
      await assert.rejects(f.getOrRequestFeedback(42), status === "ABANDONED" ? /중단된 면접/ : /면접이 완료된 것/);
      assert.equal(f.calls.filter((call) => call.method === "POST").length, 0);
      assert.equal(f.calls.find((call) => call.url === "/api/interviews/get").options.params.interviewId, 42);
    });
  }
  test(`${mode}: completed interview generates once, including simultaneous requests`, async () => {
    const f = fixture({ mode });
    const [first, second] = await Promise.all([f.getOrRequestFeedback(42), f.getOrRequestFeedback(42)]);
    assert.equal(first.status, "PENDING");
    assert.equal(second.status, "PENDING");
    assert.equal(f.calls.filter((call) => call.method === "POST").length, 1);
    assert.equal(f.calls.at(-2).url, "/api/interviews/get");
    assert.equal(f.calls.at(-1).url, "/api/feedbacks");
  });
  test(`${mode}: failed-feedback retry also blocks abandoned interviews`, async () => {
    const f = fixture({ mode, status: "ABANDONED" });
    await assert.rejects(f.requestFeedback(42), /중단된 면접/);
    assert.equal(f.calls.filter((call) => call.method === "POST").length, 0);
    f.state.status = "COMPLETED";
    assert.equal((await f.requestFeedback(42)).status, "PENDING");
  });
}

test("status lookup failure never creates feedback and can be retried", async () => {
  const f = fixture({ statusError: new Error("lookup failed") });
  await assert.rejects(f.requestFeedback(42), /lookup failed/);
  assert.equal(f.calls.filter((call) => call.method === "POST").length, 0);
  f.state.statusError = null;
  assert.equal((await f.requestFeedback(42)).status, "PENDING");
});

test("existing feedback is read without a generation request", async () => {
  const f = fixture({ feedback: { interviewId: 42, status: "SUCCEEDED", totalScore: 80 } });
  assert.equal((await f.getOrRequestFeedback(42)).status, "SUCCEEDED");
  assert.equal(f.calls.length, 1);
});
