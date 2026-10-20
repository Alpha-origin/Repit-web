import assert from "node:assert/strict";
import { browser, fixture, waitUntil, assertReleased, origin } from "./interview-browser-fixture.mjs";

let passed = 0;
const report = (name) => { passed++; console.log(`PASS ${name}`); };
const emit = (page, payload) => page.evaluate((payload) => {
  window.__sockets.filter((socket) => socket.readyState === 1).forEach((socket) =>
    socket.dispatchEvent(new MessageEvent("message", { data: JSON.stringify(payload) })));
}, payload);
const ready = (f) => f.page.getByText("질문 101: 프로젝트 경험을 설명해주세요.", { exact: true }).waitFor();
const close = async (f) => { assert.deepEqual(f.errors, []); assert.equal(f.feedbackRequests.length, 0); await f.context.close(); };
try {
  for (const multi of [false, true]) for (const answerMode of ["text", "voice"]) {
    const label = `${multi ? "MULTI" : "SOLO"}/${answerMode}`;
    const abandoned = await fixture({ multi, answerMode, complete: true, socketOnAnswer: true, socketAnswerStatus: "ABANDONED", delayAnswers: true });
    await ready(abandoned);
    if (answerMode === "voice") {
      await abandoned.start.click();
      await abandoned.page.waitForFunction(() => window.__recognitions.some((item) => item.active));
      await abandoned.finish.click();
    } else {
      await abandoned.page.getByPlaceholder(/이곳에 답변을 입력/).fill("마지막 답변과 중단의 경합 확인");
      await abandoned.page.getByRole("button", { name: "제출하기", exact: true }).click();
    }
    await abandoned.page.waitForURL("**/main");
    abandoned.releaseAnswers();
    await assertReleased(abandoned);
    assert.equal(abandoned.quits.length, 0, "confirmed socket ABANDONED never sends QUIT again");
    assert.equal(new URL(abandoned.page.url()).pathname, "/main");
    await close(abandoned);
    report(`${label}: ABANDONED END wins over late COMPLETED answer and cleans media once`);

    const completed = await fixture({ multi, answerMode, quitResult: "COMPLETED" });
    await ready(completed);
    await completed.page.getByRole("button", { name: "그만두기", exact: true }).click();
    await completed.page.waitForURL("**/main/interview/completed");
    assert.equal(completed.quits.length, 1);
    await assertReleased(completed);
    await close(completed);
    report(`${label}: QUIT response COMPLETED opens completion`);
  }

  for (const storedStatus of ["COMPLETED", "ABANDONED", "IN_PROGRESS"]) {
    const f = await fixture({ answerMode: "text", quitStatuses: [404], storedStatus });
    await ready(f);
    await f.page.getByRole("button", { name: "그만두기", exact: true }).click();
    if (storedStatus === "IN_PROGRESS") {
      await f.page.getByText("면접 종료 저장을 확인하지 못했어요. 다시 시도해 주세요.", { exact: true }).waitFor();
      assert.match(f.page.url(), /\/interview\/42$/);
      await f.page.getByRole("button", { name: "다시 시도", exact: true }).click();
      await waitUntil(() => f.quits.length === 2 && f.statusReads.length === 2);
    } else await f.page.waitForURL(storedStatus === "COMPLETED" ? "**/main/interview/completed" : "**/main");
    assert.ok(f.statusReads.length >= 1);
    await close(f);
    report(`QUIT 404 checks stored ${storedStatus}`);
  }

  for (const storedStatus of ["COMPLETED", "ABANDONED", "IN_PROGRESS"]) {
    const f = await fixture({ answerMode: "text", storedStatus });
    await ready(f);
    await emit(f.page, { type: "END" });
    if (storedStatus === "IN_PROGRESS") {
      await f.page.getByText("면접 종료 저장을 확인하지 못했어요. 다시 시도해 주세요.", { exact: true }).waitFor();
      assert.match(f.page.url(), /\/interview\/42$/);
    } else await f.page.waitForURL(storedStatus === "COMPLETED" ? "**/main/interview/completed" : "**/main");
    assert.equal(f.quits.length, 0);
    assert.equal(f.statusReads.length, 1);
    await close(f);
    report(`legacy END checks stored ${storedStatus}, never infers completion`);
  }

  const pendingQuit = await fixture({ answerMode: "text", delayQuit: true, quitResult: "COMPLETED" });
  await ready(pendingQuit);
  await pendingQuit.page.getByRole("button", { name: "그만두기", exact: true }).click();
  await waitUntil(() => pendingQuit.quits.length === 1);
  pendingQuit.releaseQuit();
  await pendingQuit.page.waitForURL("**/main/interview/completed");
  await close(pendingQuit);
  report("delayed QUIT response uses the server terminal status");

  const back = await fixture({ answerMode: "text", quitResult: "COMPLETED" });
  await ready(back);
  await back.page.evaluate(() => window.__router.navigate("/main/mypage"));
  await back.page.waitForURL("**/main/interview/completed");
  await close(back);
  report("blocked navigation respects completed QUIT response");
  const answerFirst = await fixture({ answerMode: "text", complete: true, delayAnswers: true, delayQuit: true });
  await ready(answerFirst);
  await answerFirst.page.getByPlaceholder(/이곳에 답변을 입력/).fill("답변 완료가 먼저 확정된 경우");
  await answerFirst.page.getByRole("button", { name: "제출하기", exact: true }).click();
  await waitUntil(() => answerFirst.answers.length === 1);
  await answerFirst.page.getByRole("button", { name: "그만두기", exact: true }).click();
  await waitUntil(() => answerFirst.quits.length === 1);
  answerFirst.releaseAnswers();
  await answerFirst.page.waitForURL("**/main/interview/completed");
  answerFirst.releaseQuit();
  await close(answerFirst);
  report("confirmed answer received during local quit keeps COMPLETED over a later opposite response");

  for (const button of ["피드백", "로그아웃"]) {
    const f = await fixture({ answerMode: "text", quitResult: "COMPLETED" });
    await ready(f);
    await f.page.getByRole("button", { name: button, exact: true }).click();
    await f.page.waitForURL("**/main/interview/completed");
    assert.notEqual(await f.page.evaluate(async () => (await import("/src/shared/api/accessToken.ts")).getAccessToken()), null);
    await close(f);
    report(`${button}: late QUIT COMPLETED keeps completion destination`);
  }
  for (const multi of [false, true]) for (const answerMode of ["text", "voice"]) {
    for (const action of ["quit", "header", "back", "logout"]) {
      const f = await fixture({ multi, answerMode });
      await ready(f);
      if (answerMode === "voice") {
        await f.start.click();
        await f.finish.waitFor();
        await f.page.waitForFunction(() => window.__recognitions.some((item) => item.active));
        await f.page.waitForTimeout(250);
      }
      if (action === "back") await f.page.goBack();
      else await f.page.getByRole("button", { name: action === "quit" ? "그만두기" : action === "header" ? "피드백" : "로그아웃", exact: true }).click();
      await waitUntil(() => f.quits.length === 1);
      await f.page.waitForURL(action === "quit" ? "**/main" : action === "header" ? "**/main/feedback/list" : action === "logout" ? "**/login" : `${origin}/`);
      assert.equal(f.quits.length, 1);
      if (answerMode === "voice") {
        await waitUntil(() => f.uploads.length === 2);
        assert.equal(f.uploads.find((upload) => upload.kind === "ANSWER").endReason, "interrupted");
      } else assert.equal(f.uploads.length, 0);
      await assertReleased(f);
      await close(f);
      report(`${multi ? "MULTI" : "SOLO"}/${answerMode}/${action}: one QUIT, preserved files, no generation`);
    }
  }
  console.log(`${passed} terminal status scenarios passed`);
} finally { await browser.close(); }
