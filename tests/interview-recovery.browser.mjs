import assert from "node:assert/strict";
import { browser, fixture, waitUntil } from "./interview-browser-fixture.mjs";

let passed = 0;
const report = (label) => { passed++; console.log(`PASS ${label}`); };
const retry = (page) => page.getByRole("button", { name: "다시 시도", exact: true });
const waitForQuitError = (page) => page.getByText("면접 종료를 저장하지 못했어요. 다시 시도해 주세요.", { exact: true }).waitFor();
try {
  for (const multi of [false, true]) {
    const label = multi ? "MULTI" : "SOLO";
    const recovered = await fixture({ multi, answerMode: "text", recoveredSessionId: "recovered-session" });
    await recovered.page.getByText("질문 101: 프로젝트 경험을 설명해주세요.", { exact: true }).waitFor();
    assert.equal(recovered.recovery.starts, 1, "session ID change must not restart preparation");
    assert.equal(await recovered.page.evaluate(() => sessionStorage.getItem("activeInterviewSessionId")), "recovered-session");
    await recovered.page.getByPlaceholder(/이곳에 답변을 입력/).fill("복구한 면접의 답변입니다.");
    await recovered.page.getByRole("button", { name: "제출하기", exact: true }).click();
    await waitUntil(() => recovered.answers.length === 1);
    await recovered.page.getByRole("button", { name: "그만두기", exact: true }).click();
    await recovered.page.waitForURL("**/main");
    assert.equal(recovered.feedbackRequests.length, 0, "quit must not generate feedback");
    assert.ok(recovered.chatRequests.some((request) => request.path.endsWith("/audio")));
    assert.ok(recovered.chatRequests.every((request) => request.path.startsWith("/chat/interviews/recovered-session/")));
    const sockets = await recovered.page.evaluate(() => window.__sockets.map((socket) => socket.url).filter((url) => new URL(url).pathname === "/ws/chat/interviews"));
    assert.ok(sockets.length > 0 && sockets.every((url) => new URL(url).searchParams.get("sessionId") === "recovered-session"));
    assert.deepEqual(recovered.errors, []);
    await recovered.context.close();
    report(`${label}: recovery ID used by question, audio, answer, socket and quit; start only once`);

    for (const [button, path] of [["마이페이지", "/main/mypage"], ["피드백", "/main/feedback/list"], ["로그아웃", "/login"]]) {
      const f = await fixture({ multi, answerMode: "text", quitStatuses: [502, 200] });
      await f.page.getByRole("button", { name: "그만두기", exact: true }).waitFor();
      await f.page.getByRole("button", { name: button, exact: true }).click();
      await waitForQuitError(f.page);
      assert.match(f.page.url(), /\/main\/interview\/42$/);
      await retry(f.page).click();
      await f.page.waitForURL((url) => url.pathname === path);
      assert.equal(f.quits.length, 2);
      assert.equal(f.feedbackRequests.length, 0, "quit retry and navigation must not generate feedback");
      if (button === "로그아웃") {
        assert.equal(await f.page.evaluate(async () => (await import("/src/shared/api/accessToken.ts")).getAccessToken()), null);
        await waitUntil(async () => !(await f.page.evaluate(async () => (await import("/src/shared/store/userStore.ts")).useUserStore.getState().isLoaded)));
      }
      assert.deepEqual(f.errors, []);
      await f.context.close();
      report(`${label}: quit retry resumes ${button}`);
    }

    const forceLeave = await fixture({ multi, answerMode: "text", quitStatuses: [502] });
    await forceLeave.page.getByRole("button", { name: "그만두기", exact: true }).waitFor();
    await forceLeave.page.getByRole("button", { name: "로그아웃", exact: true }).click();
    await waitForQuitError(forceLeave.page);
    await forceLeave.page.getByRole("button", { name: "저장하지 않고 나가기", exact: true }).click();
    await forceLeave.page.waitForURL("**/main");
    assert.equal(await forceLeave.page.evaluate(async () => (await import("/src/shared/api/accessToken.ts")).getAccessToken()), "Bearer test-only-token");
    assert.equal(forceLeave.quits.length, 1);
    assert.equal(forceLeave.feedbackRequests.length, 0, "forced leave must not generate feedback");
    assert.deepEqual(forceLeave.errors, []);
    await forceLeave.context.close();
    report(`${label}: explicit leave discards pending logout`);
  }
  console.log(`${passed} review recovery scenarios passed`);
} finally { await browser.close(); }
