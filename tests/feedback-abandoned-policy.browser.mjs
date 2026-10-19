import assert from "node:assert/strict";
import { browser, fixture, waitUntil } from "./interview-browser-fixture.mjs";

const message = "중단된 면접은 피드백을 생성하지 않습니다.";
let passed = 0;
const report = (label) => { passed++; console.log(`PASS ${label}`); };
const succeeded = { interviewId: 42, status: "SUCCEEDED", totalScore: 80, summary: "숨겨야 할 과거 피드백", feedbacks: [{ questionId: 101, questionContent: "과거 질문", comment: "과거 코멘트" }] };

async function openFeedback({ route = "overall", listStatus = "COMPLETED", feedbackStatus = "PENDING", reject = "initial", storedStatuses = ["ABANDONED"] } = {}) {
  const f = await fixture({ answerMode: "text" });
  const state = { gets: 0, posts: 0, audio: 0, status: 0, reject: false };
  await f.page.route("**/api/**", async (handler) => {
    const req = handler.request();
    const pathname = new URL(req.url()).pathname;
    const json = (data, status = 200) => handler.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });
    if (pathname === "/api/interviews/getAll") return json({ data: [
      { id: 42, status: listStatus, answerMode: "VOICE", mode: "SOLO", createdAt: "2026-10-20T12:00:00Z" },
      { id: 41, status: "ABANDONED", createdAt: "2026-10-19T12:00:00Z" },
      { id: 40, status: "COMPLETED", createdAt: "2026-10-18T12:00:00Z" },
    ] });
    if (pathname === "/api/interviews/get") {
      const status = storedStatuses[Math.min(state.status++, storedStatuses.length - 1)];
      return json({ data: { status } });
    }
    if (pathname === "/api/feedbacks/getAll") return json({ data: [
      { interviewId: 41, status: "SUCCEEDED", totalScore: 99 },
      { interviewId: 40, status: "SUCCEEDED", totalScore: 70 },
    ] });
    if (pathname === "/api/feedbacks") {
      if (req.method() === "POST") { state.posts++; return json({ message: "정책에 따라 거절되었습니다." }, 409); }
      state.gets++;
      if (reject === "initial" || (reject === "poll" && state.gets > 1)) return json({ message: "정책에 따라 거절되었습니다." }, 409);
      return json({ success: true, data: { ...succeeded, status: reject === "audioAfterPoll" && state.gets > 1 ? "SUCCEEDED" : feedbackStatus } });
    }
    if (pathname.endsWith("/audio-analysis")) {
      state.audio++;
      if ((reject === "audio" || reject === "audioAfterPoll")) return json({ message: "정책에 따라 거절되었습니다." }, 409);
      return json({ success: true, data: { status: "UNAVAILABLE", answers: [] } });
    }
    if (pathname === "/api/answer/getAll") return json({ success: true, data: [] });
    return handler.fallback();
  });
  await f.page.evaluate((route) => window.__router.navigate(`/main/feedback/${route}/42`), route);
  return { ...f, state };
}
const closed = async (f) => { assert.deepEqual(f.errors, []); await f.context.close(); };
try {
  for (const route of ["overall", "detail"]) for (const feedbackStatus of ["PENDING", "SUCCEEDED", "FAILED"]) {
    const f = await openFeedback({ route, feedbackStatus, listStatus: "ABANDONED" });
    await f.page.getByText(message, { exact: true }).waitFor();
    assert.equal(f.state.gets, 0);
    assert.equal(f.state.posts, 0);
    assert.equal(f.state.audio, 0);
    assert.equal(await f.page.getByRole("button", { name: /PDF/ }).count(), 0);
    assert.equal(await f.page.getByText(succeeded.summary, { exact: true }).count(), 0);
    await closed(f);
    report(`${route}/${feedbackStatus}: abandoned direct URL hides old results and PDF, reads/generation/media zero`);
  }

  for (const reject of ["initial", "poll", "audio", "audioAfterPoll"]) {
    const f = await openFeedback({ reject, feedbackStatus: reject === "audio" ? "SUCCEEDED" : "PENDING" });
    await f.page.getByText(message, { exact: true }).waitFor({ timeout: 15_000 });
    const gets = f.state.gets;
    const audio = f.state.audio;
    await f.page.clock.install();
    await f.page.clock.runFor(60_000);
    assert.equal(f.state.gets, gets);
    assert.equal(f.state.audio, audio);
    assert.equal(f.state.posts, 0);
    assert.equal(f.state.status, 1);
    assert.equal(await f.page.getByText(succeeded.summary, { exact: true }).count(), 0);
    assert.equal(await f.page.getByRole("button", { name: /PDF/ }).count(), 0);
    await closed(f);
    report(`${reject} 409: latest status clears results and stops polling without POST`);
  }

  const retry = await openFeedback({ feedbackStatus: "FAILED", reject: "retry", storedStatuses: ["COMPLETED", "ABANDONED"] });
  await retry.page.getByText("피드백 분석에 실패했습니다.", { exact: true }).waitFor();
  await retry.page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await retry.page.getByText(message, { exact: true }).waitFor();
  assert.equal(retry.state.posts, 1);
  assert.equal(retry.state.gets, 1, "policy rejection must not look up a duplicate feedback");
  assert.equal(retry.state.audio, 0);
  await closed(retry);
  report("regrade 409 checks latest state before duplicate lookup");

  const duplicate = await openFeedback({ feedbackStatus: "FAILED", reject: "retry", storedStatuses: ["COMPLETED"] });
  await duplicate.page.getByText("피드백 분석에 실패했습니다.", { exact: true }).waitFor();
  await duplicate.page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await waitUntil(() => duplicate.state.gets === 2);
  assert.equal(duplicate.state.posts, 1);
  assert.equal(duplicate.state.status, 2);
  await closed(duplicate);
  report("completed duplicate 409 retains existing feedback lookup");

  const previous = await openFeedback({ reject: "none", feedbackStatus: "SUCCEEDED" });
  await previous.page.getByText(succeeded.summary, { exact: true }).first().waitFor();
  const text = await previous.page.locator("body").innerText();
  assert.match(text, /70/);
  assert.doesNotMatch(text, /99점/);
  await closed(previous);
  report("previous score uses completed interview and excludes abandoned historical score");
  console.log(`${passed} feedback policy scenarios passed`);
} finally { await browser.close(); }
