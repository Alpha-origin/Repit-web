import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
const origin = process.env.INTERVIEW_TEST_ORIGIN ?? "http://127.0.0.1:5173";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE_PATH ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH } : {}),
});
const delayMessage = "피드백 분석이 지연되고 있습니다. 잠시 후 다시 확인해주세요.";
const failedMessage = "분석 실패 확인";
const pendingMessage = (view) => view === "detail"
  ? "질문별 피드백을 분석 중입니다. 완료되면 자동으로 표시됩니다."
  : "피드백을 분석 중입니다. 완료되면 자동으로 표시됩니다.";
const completedFeedback = {
  interviewId: 42,
  status: "SUCCEEDED",
  totalScore: 80,
  summary: "회복 확인 코멘트",
  feedbacks: [{ questionId: 101, questionContent: "회복 확인 질문", comment: "회복 확인 코멘트" }],
};
let passed = 0;
const report = (label) => { passed++; console.log(`PASS ${label}`); };

async function fixture({ status = "PENDING", view = "overall", steps = [], postSteps = [], initialCode, interviewIds = [42] } = {}) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(5_000);
  const errors = [];
  const state = { reads: 0, posts: 0, steps, postSteps };
  page.on("pageerror", (error) => errors.push(error.message));
  await page.clock.install();
  await page.route("**/*", async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (!pathname.startsWith("/api/")) return route.continue();
    const json = (body, code = 200) => route.fulfill({ status: code, contentType: "application/json", body: JSON.stringify(body) });
    if (pathname.endsWith("/refresh")) return json({ accessToken: "test-only-token" });
    if (pathname.endsWith("/me")) return json({ data: { id: 7, name: "테스트", nickname: "테스트", email: "test@example.com" } });
    if (pathname === "/api/interviews/getAll") return json({ success: true, data: interviewIds.map((id) => ({ id, status: "COMPLETED", createdAt: "2026-10-15T00:00:00Z" })) });
    if (pathname === "/api/interviews/get") return json({ success: true, data: { status: "COMPLETED" } });
    if (pathname === "/api/feedbacks/getAll") return json({ success: true, data: [] });
    if (pathname === "/api/answer/getAll") return json({ success: true, data: [{ answerId: 1, interview: 42, question: 101, content: "테스트 답변", createdAt: "2026-10-15T00:00:00Z" }] });
    if (pathname === "/api/feedbacks") {
      if (request.method() !== "GET") {
        state.posts++;
        const step = state.postSteps.shift() ?? {};
        if (step.waitFor) await step.waitFor;
        if (step.code) return json({ message: step.message ?? `테스트 오류 ${step.code}` }, step.code);
        return json(step.response ?? { success: true, data: { status: "PENDING" } });
      }
      state.reads++;
      if (state.reads === 1) return initialCode
        ? json({ message: "피드백 없음" }, initialCode)
        : json({ success: true, data: { interviewId: 42, status, errorMessage: status === "FAILED" ? failedMessage : undefined } });
      const step = state.steps.shift() ?? { feedback: completedFeedback };
      if (step.network) return route.abort("connectionfailed");
      if (step.code) return json({ message: step.message ?? `테스트 오류 ${step.code}` }, step.code);
      return json({ success: true, data: step.feedback });
    }
    return json({ success: true, data: [] });
  });
  await page.goto(`${origin}/main/feedback/${view}/42`);
  await page.getByText(status === "FAILED" ? failedMessage : pendingMessage(view), { exact: true }).waitFor();
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100));

  return {
    page,
    state,
    close: async () => {
      assert.deepEqual(errors, []);
      await context.close();
    },
  };
}

async function expectNoMoreRequests(f, expectedPosts = 0) {
  const reads = f.state.reads;
  await f.page.clock.runFor(60_000);
  assert.equal(f.state.reads, reads);
  assert.equal(f.state.posts, expectedPosts);
}

try {
  for (const view of ["overall", "detail"]) {
    const f = await fixture({ status: "FAILED", view, steps: [{ feedback: { status: "PENDING" } }, { feedback: completedFeedback }] });
    assert.equal(f.state.posts, 0);
    await f.page.getByRole("button", { name: "다시 시도", exact: true }).click();
    await f.page.getByText(pendingMessage(view), { exact: true }).waitFor();
    assert.equal(f.state.posts, 1);
    assert.equal(f.state.reads, 1);
    const pendingResponse = f.page.waitForResponse((response) =>
      new URL(response.url()).pathname === "/api/feedbacks" && response.request().method() === "GET");
    await f.page.clock.runFor(5_000);
    await (await pendingResponse).finished();
    await f.page.clock.runFor(5_000);
    await f.page.getByText("회복 확인 코멘트", { exact: true }).first().waitFor();
    assert.equal(f.state.reads, 3);
    await expectNoMoreRequests(f, 1);
    await f.close();
    report(`${view}: FAILED retry posts once, polls and displays completed feedback`);
  }

  for (const status of ["PENDING", "SUCCEEDED"]) {
    const f = await fixture({
      status: "FAILED",
      postSteps: [{ code: 409 }],
      steps: [{ feedback: status === "PENDING" ? { status } : completedFeedback }],
    });
    await f.page.getByRole("button", { name: "다시 시도", exact: true }).click();
    await f.page.getByText(status === "PENDING" ? pendingMessage("overall") : "회복 확인 코멘트", { exact: true }).first().waitFor();
    assert.equal(f.state.posts, 1);
    assert.equal(f.state.reads, 2);
    if (status === "PENDING") {
      await f.page.clock.runFor(5_000);
      await f.page.getByText("회복 확인 코멘트", { exact: true }).first().waitFor();
    }
    await expectNoMoreRequests(f, 1);
    await f.close();
    report(`retry conflict reloads actual ${status} state`);
  }

  for (const view of ["overall", "detail"]) {
    const conflictMissing = await fixture({ status: "FAILED", view, postSteps: [{ code: 409 }], steps: [{ code: 404 }] });
    await conflictMissing.page.getByRole("button", { name: "다시 시도", exact: true }).click();
    await conflictMissing.page.getByText("피드백 상태를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.", { exact: true }).waitFor();
    assert.equal(await conflictMissing.page.getByRole("button", { name: "다시 시도", exact: true }).isEnabled(), true);
    assert.equal(conflictMissing.state.posts, 1);
    assert.equal(conflictMissing.state.reads, 2);
    await expectNoMoreRequests(conflictMissing, 1);
    await conflictMissing.page.getByRole("button", { name: "다시 시도", exact: true }).click();
    await conflictMissing.page.getByText(pendingMessage(view), { exact: true }).waitFor();
    assert.equal(conflictMissing.state.posts, 2);
    await conflictMissing.page.clock.runFor(5_000);
    await conflictMissing.page.getByText("회복 확인 코멘트", { exact: true }).first().waitFor();
    await conflictMissing.close();
    report(`${view}: retry conflict with missing feedback keeps FAILED and retries with POST`);
  }

  const rejected = await fixture({ status: "FAILED", postSteps: [{ code: 500, message: "재채점 접수 실패" }] });
  await rejected.page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await rejected.page.getByText("재채점 접수 실패", { exact: true }).waitFor();
  assert.equal(await rejected.page.getByRole("button", { name: "다시 시도", exact: true }).isEnabled(), true);
  assert.equal(rejected.state.posts, 1);
  assert.equal(rejected.state.reads, 1);
  await expectNoMoreRequests(rejected, 1);
  await rejected.page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await rejected.page.getByText(pendingMessage("overall"), { exact: true }).waitFor();
  assert.equal(rejected.state.posts, 2);
  await rejected.page.clock.runFor(5_000);
  await rejected.page.getByText("회복 확인 코멘트", { exact: true }).first().waitFor();
  await rejected.close();
  report("retry failure shows the new error, stops polling and allows another request");

  let releasePost;
  const delayedPost = new Promise((resolve) => { releasePost = resolve; });
  const duplicate = await fixture({ status: "FAILED", postSteps: [{ waitFor: delayedPost }] });
  await duplicate.page.getByRole("button", { name: "다시 시도", exact: true }).evaluate((button) => {
    button.click();
    button.click();
  });
  await duplicate.page.getByRole("button", { name: "요청 중…", exact: true }).waitFor();
  assert.equal(await duplicate.page.getByRole("button", { name: "요청 중…", exact: true }).isDisabled(), true);
  releasePost();
  await duplicate.page.getByText(pendingMessage("overall"), { exact: true }).waitFor();
  assert.equal(duplicate.state.posts, 1);
  await duplicate.page.clock.runFor(5_000);
  await duplicate.page.getByText("회복 확인 코멘트", { exact: true }).first().waitFor();
  await duplicate.close();
  report("rapid retry clicks issue one POST and disable the button until accepted");

  const missing = await fixture({ initialCode: 404 });
  assert.equal(missing.state.posts, 1);
  await missing.page.clock.runFor(5_000);
  await missing.page.getByText("회복 확인 코멘트", { exact: true }).first().waitFor();
  await missing.close();
  report("missing feedback still requests initial generation automatically");

  const acceptedFailure = await fixture({
    status: "FAILED",
    postSteps: [{ response: { success: true, data: { status: "FAILED", message: "재채점 작업 실패" } } }],
  });
  await acceptedFailure.page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await acceptedFailure.page.getByText("재채점 작업 실패", { exact: true }).waitFor();
  assert.equal(await acceptedFailure.page.getByRole("button", { name: "다시 시도", exact: true }).isEnabled(), true);
  await expectNoMoreRequests(acceptedFailure, 1);
  await acceptedFailure.close();
  report("a FAILED acceptance response displays its message without polling");

  let releaseStalePost;
  const stalePost = new Promise((resolve) => { releaseStalePost = resolve; });
  const stale = await fixture({
    status: "FAILED",
    interviewIds: [42, 43],
    postSteps: [{ waitFor: stalePost }],
    steps: [{ feedback: { interviewId: 43, status: "FAILED", errorMessage: "다른 면접의 분석 실패" } }],
  });
  await stale.page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await stale.page.getByRole("button", { name: "요청 중…", exact: true }).waitFor();
  await stale.page.clock.resume();
  await stale.page.evaluate(() => {
    window.history.pushState(window.history.state, "", "/main/feedback/overall/43");
    window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
  });
  await stale.page.getByText("다른 면접의 분석 실패", { exact: true }).waitFor();
  await stale.page.clock.pauseAt(await stale.page.evaluate(() => Date.now() + 100));
  const staleResponse = stale.page.waitForResponse((response) =>
    new URL(response.url()).pathname === "/api/feedbacks" && response.request().method() === "POST");
  releaseStalePost();
  await (await staleResponse).finished();
  await expectNoMoreRequests(stale, 1);
  await stale.page.getByText("다른 면접의 분석 실패", { exact: true }).waitFor();
  assert.equal(await stale.page.getByRole("button", { name: "다시 시도", exact: true }).isEnabled(), true);
  await stale.close();
  report("a late retry response cannot overwrite feedback after switching interviews");

  for (const status of ["PENDING", "IN_PROGRESS"]) {
    for (const failure of [{ code: 503 }, { network: true }]) {
      const view = status === "PENDING" ? "overall" : "detail";
      const f = await fixture({ status, view, steps: [failure] });
      await f.page.clock.runFor(5_000);
      const message = failure.network ? "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요." : "테스트 오류 503";
      await f.page.getByText(message, { exact: true }).waitFor();
      await f.page.clock.runFor(5_000);
      await f.page.getByText("회복 확인 코멘트", { exact: true }).first().waitFor();
      assert.equal(await f.page.getByText(message, { exact: true }).count(), 0);
      assert.equal(f.state.reads, 3);
      await expectNoMoreRequests(f);
      await f.close();
      report(`${view}: ${status} recovers after ${failure.network ? "network failure" : "503"}, clears error and stops at completion`);
    }
  }

  for (const code of [408, 429]) {
    const f = await fixture({ steps: [{ code }] });
    await f.page.clock.runFor(5_000);
    await f.page.getByText(`테스트 오류 ${code}`, { exact: true }).waitFor();
    await f.page.clock.runFor(5_000);
    await f.page.getByText("회복 확인 코멘트", { exact: true }).first().waitFor();
    await f.close();
    report(`${code} is retried`);
  }

  for (const code of [400, 403]) {
    const f = await fixture({ steps: [{ code }] });
    await f.page.clock.runFor(5_000);
    await f.page.getByText(`테스트 오류 ${code}`, { exact: true }).waitFor();
    await expectNoMoreRequests(f);
    await f.close();
    report(`${code} stops automatic retries`);
  }

  const failed = await fixture({ steps: [{ code: 503 }, { feedback: { status: "FAILED", errorMessage: "분석 실패 확인" } }] });
  await failed.page.clock.runFor(5_000);
  await failed.page.getByText("테스트 오류 503", { exact: true }).waitFor();
  await failed.page.clock.runFor(5_000);
  await failed.page.getByText("분석 실패 확인", { exact: true }).waitFor();
  await expectNoMoreRequests(failed);
  await failed.close();
  report("terminal FAILED result stops polling after a recovered request");

  const deadline = await fixture({ steps: [{ code: 503 }, { code: 503, message: "두 번째 일시 오류" }] });
  await deadline.page.clock.runFor(5_000);
  await deadline.page.getByText("테스트 오류 503", { exact: true }).waitFor();
  await deadline.page.clock.runFor(5_000);
  await deadline.page.getByText("두 번째 일시 오류", { exact: true }).waitFor();
  const readsBeforeDeadline = deadline.state.reads;
  await deadline.page.clock.fastForward(5 * 60_000);
  await deadline.page.getByText(delayMessage, { exact: true }).waitFor();
  assert.equal(deadline.state.reads, readsBeforeDeadline);
  await expectNoMoreRequests(deadline);
  await deadline.close();
  report("repeated transient errors still stop at the five-minute deadline");

  const leaving = await fixture({ steps: [{ code: 503 }] });
  await leaving.page.clock.runFor(5_000);
  await leaving.page.getByText("테스트 오류 503", { exact: true }).waitFor();
  await leaving.page.getByRole("button", { name: "마이페이지", exact: true }).click();
  await leaving.page.waitForURL("**/main/mypage");
  await leaving.page.getByRole("heading", { name: "마이페이지", exact: true }).waitFor();
  await expectNoMoreRequests(leaving);
  await leaving.close();
  report("leaving the page clears a scheduled retry");

  console.log(`${passed} feedback polling scenarios passed`);
} finally {
  await browser.close();
}
