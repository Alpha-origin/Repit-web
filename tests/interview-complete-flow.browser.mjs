import assert from "node:assert/strict";
import { browser, fixture, origin, waitUntil } from "./interview-browser-fixture.mjs";

let passed = 0;
const report = (label) => { passed++; console.log(`PASS ${label}`); };
const savingMessage = "면접 기록을 저장하고 있어요";
const notCompletedMessage = "아직 완료되지 않은 면접입니다. 면접을 마친 뒤 피드백을 확인해주세요.";
const pendingMessage = "피드백을 분석 중입니다. 완료되면 자동으로 표시됩니다.";
const completedFeedback = {
  interviewId: 42,
  status: "SUCCEEDED",
  totalScore: 80,
  summary: "완료 흐름 확인 코멘트",
  feedbacks: [{ questionId: 101, questionContent: "완료 흐름 질문", comment: "완료 흐름 확인 코멘트" }],
};

// 종합 피드백 화면이 읽는 API. interviewStatuses는 GET /api/interviews/get 응답 순서다(숫자는 HTTP 오류 코드).
async function routeFeedbackApis(page, { listStatus = "IN_PROGRESS", interviewStatuses = ["COMPLETED"], feedbacks = [{ status: "PENDING" }] } = {}) {
  const state = { gets: 0, feedbackReads: 0, posts: 0 };
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (!pathname.startsWith("/api/")) return route.fallback();
    const json = (body, code = 200) => route.fulfill({ status: code, contentType: "application/json", body: JSON.stringify(body) });
    if (pathname === "/api/interviews/getAll") return json({ success: true, data: [{ id: 42, mode: "SOLO", status: listStatus, createdAt: "2026-10-19T03:10:00Z" }] });
    if (pathname === "/api/interviews/get") {
      assert.equal(new URL(request.url()).searchParams.get("interviewId"), "42");
      const status = interviewStatuses[Math.min(state.gets, interviewStatuses.length - 1)];
      state.gets++;
      if (typeof status === "number") return json({ message: `테스트 면접 조회 오류 ${status}` }, status);
      return json({ success: true, data: { interviewId: 42, status } });
    }
    if (pathname === "/api/feedbacks/getAll") return json({ success: true, data: [] });
    if (pathname === "/api/answer/getAll") return json({ success: true, data: [] });
    if (pathname === "/api/feedbacks") {
      if (request.method() !== "GET") { state.posts++; return json({ success: true, data: { status: "PENDING" } }); }
      const feedback = feedbacks[Math.min(state.feedbackReads, feedbacks.length - 1)];
      state.feedbackReads++;
      return json({ success: true, data: { interviewId: 42, ...feedback } });
    }
    if (pathname.endsWith("/refresh")) return json({ accessToken: "test-only-token" });
    if (pathname.endsWith("/me")) return json({ data: { id: 7, name: "테스트", nickname: "테스트" } });
    return json({ success: true, data: [] });
  });
  return state;
}

// 가짜 시계로 종합 피드백 화면에 들어간다. fromCompletion이면 완료 화면에서 넘긴 state를 붙인다.
async function openOverall({ fromCompletion = true, ...apiOptions } = {}) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const state = await routeFeedbackApis(page, apiOptions);
  await page.goto(origin);
  await page.getByRole("button", { name: "면접 시작하기", exact: true }).first().waitFor();
  // 가짜 시계가 performance를 바꾸므로 앱이 쓰는 라우터 모듈 URL을 먼저 읽고 시계를 건다.
  const routerUrl = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name).find((url) => new URL(url).pathname === "/src/app/router.tsx"));
  await page.clock.install();
  await page.evaluate(async ({ routerUrl, fromCompletion }) => {
    const { default: router } = await import(routerUrl);
    await router.navigate("/main/feedback/overall/42", fromCompletion ? { state: { fromCompletion: true } } : undefined);
  }, { routerUrl, fromCompletion });
  return { page, state, close: async () => { assert.deepEqual(errors, []); await context.close(); } };
}

const advance = async (f, ms, expectedGets) => {
  await f.page.clock.runFor(ms);
  await waitUntil(() => f.state.gets === expectedGets);
};

try {
  // 2-1: SOLO는 텍스트·음성 모두 InterviewContentView를 쓴다.
  for (const answerMode of ["text", "voice"]) {
    const f = await fixture({ answerMode });
    await f.page.getByText("Question 01 / 02", { exact: true }).waitFor();
    assert.equal(await f.page.getByText(/^Question [\d-]+ \/ 10$/).count(), 0);
    assert.deepEqual(f.errors, []);
    await f.context.close();
    report(`SOLO ${answerMode}: label uses prepared question count`);
  }
  const empty = await fixture({ answerMode: "text", preparationQuestions: [] });
  // 준비 응답에 질문이 없으면 개수는 0으로 남고, 질문은 Chat 조회로 들어온다.
  await empty.page.getByText("Question 01 / --", { exact: true }).waitFor();
  await empty.context.close();
  report("SOLO text: unknown total question count shows --");
  const multi = await fixture({ multi: true, answerMode: "voice" });
  await multi.page.getByText("Question 01 / 2", { exact: true }).waitFor();
  await multi.context.close();
  report("MULTI voice: dashboard label unchanged");

  // 2-2: 완료 → 버튼 → 종합 피드백, IN_PROGRESS 재확인 뒤 PENDING 표시(실시간 3초 간격).
  const done = await fixture({ answerMode: "text", complete: true });
  await done.page.getByText("Question 01 / 02", { exact: true }).waitFor();
  await done.page.getByPlaceholder(/이곳에 답변을 입력/).fill("완료 흐름 확인 답변입니다.");
  await done.page.getByRole("button", { name: "제출하기", exact: true }).click();
  await done.page.waitForURL("**/main/interview/completed");
  assert.deepEqual(await done.page.evaluate(() => window.history.state?.usr), { answeredQuestionCount: 1, interviewId: 42 });
  const doneApi = await routeFeedbackApis(done.page, { interviewStatuses: ["IN_PROGRESS", "COMPLETED"] });
  await done.page.getByRole("button", { name: "피드백 보러가기", exact: true }).click();
  await done.page.waitForURL("**/main/feedback/overall/42");
  assert.deepEqual(await done.page.evaluate(() => window.history.state?.usr), { fromCompletion: true });
  await done.page.getByText(savingMessage, { exact: true }).waitFor();
  await done.page.getByText(pendingMessage, { exact: true }).waitFor({ timeout: 15_000 });
  assert.equal(doneApi.gets, 2);
  assert.equal(await done.page.getByText(notCompletedMessage, { exact: true }).count(), 0);
  assert.deepEqual(done.errors, []);
  await done.context.close();
  report("completed button opens overall feedback and waits for COMPLETED");

  const stateless = await fixture({ answerMode: "text" });
  await stateless.page.evaluate(() => window.__router.navigate("/main/interview/completed"));
  await stateless.page.getByRole("button", { name: "피드백 보러가기", exact: true }).click();
  await stateless.page.waitForURL((url) => url.pathname === "/main/feedback/list");
  await stateless.context.close();
  report("completed screen without state opens feedback list");

  const recovered = await openOverall({
    interviewStatuses: ["IN_PROGRESS", "COMPLETED"],
    feedbacks: [{ status: "PENDING" }, completedFeedback],
  });
  await recovered.page.getByText(savingMessage, { exact: true }).waitFor();
  await recovered.page.clock.pauseAt(await recovered.page.evaluate(() => Date.now() + 100));
  await advance(recovered, 3_000, 1);
  await recovered.page.getByText(savingMessage, { exact: true }).waitFor();
  await advance(recovered, 3_000, 2);
  await recovered.page.getByText(pendingMessage, { exact: true }).waitFor();
  assert.equal(recovered.state.posts, 0);
  await recovered.page.clock.runFor(5_000);
  await recovered.page.getByText("완료 흐름 확인 코멘트", { exact: true }).first().waitFor();
  await recovered.page.clock.runFor(60_000);
  assert.equal(recovered.state.gets, 2);
  await recovered.close();
  report("IN_PROGRESS then COMPLETED switches to feedback PENDING polling");

  const transient = await openOverall({ interviewStatuses: [503, "COMPLETED"] });
  await transient.page.getByText(savingMessage, { exact: true }).waitFor();
  await transient.page.clock.pauseAt(await transient.page.evaluate(() => Date.now() + 100));
  await advance(transient, 3_000, 1);
  await advance(transient, 3_000, 2);
  await transient.page.getByText(pendingMessage, { exact: true }).waitFor();
  await transient.close();
  report("retryable re-check error keeps checking");

  const rejected = await openOverall({ interviewStatuses: [403] });
  await rejected.page.getByText(savingMessage, { exact: true }).waitFor();
  await rejected.page.clock.pauseAt(await rejected.page.evaluate(() => Date.now() + 100));
  await advance(rejected, 3_000, 1);
  await rejected.page.getByText("테스트 면접 조회 오류 403", { exact: true }).waitFor();
  await rejected.page.clock.runFor(60_000);
  assert.equal(rejected.state.gets, 1);
  assert.equal(await rejected.page.getByText(notCompletedMessage, { exact: true }).count(), 0);
  await rejected.close();
  report("non-retryable re-check error stops with its message");

  const timedOut = await openOverall({ interviewStatuses: ["IN_PROGRESS"] });
  await timedOut.page.getByText(savingMessage, { exact: true }).waitFor();
  await timedOut.page.clock.pauseAt(await timedOut.page.evaluate(() => Date.now() + 100));
  for (let check = 1; check <= 20; check++) await advance(timedOut, 3_000, check);
  await timedOut.page.getByText(notCompletedMessage, { exact: true }).waitFor();
  await timedOut.page.clock.runFor(60_000);
  assert.equal(timedOut.state.gets, 20);
  assert.equal(timedOut.state.feedbackReads, 0);
  await timedOut.close();
  report("still IN_PROGRESS after 60s shows existing message and stops");

  for (const [label, options] of [
    ["entry without fromCompletion", { fromCompletion: false }],
    ["ABANDONED interview", { listStatus: "ABANDONED" }],
  ]) {
    const f = await openOverall(options);
    await f.page.getByText(options.listStatus === "ABANDONED" ? "중단된 면접은 피드백을 생성하지 않습니다." : notCompletedMessage, { exact: true }).waitFor();
    await f.page.clock.runFor(10_000);
    assert.equal(f.state.gets, 0);
    await f.close();
    report(`${label}: no re-check, existing message immediately`);
  }

  const alreadyDone = await openOverall({ listStatus: "COMPLETED" });
  await alreadyDone.page.getByText(pendingMessage, { exact: true }).waitFor();
  assert.equal(alreadyDone.state.gets, 0);
  await alreadyDone.close();
  report("already COMPLETED skips re-check");

  console.log(`${passed} interview completion flow scenarios passed`);
} finally { await browser.close(); }
