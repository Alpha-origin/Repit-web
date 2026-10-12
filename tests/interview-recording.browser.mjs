import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
const origin = process.env.INTERVIEW_TEST_ORIGIN ?? "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true, args: [
  "--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream",
  "--autoplay-policy=no-user-gesture-required",
] });
const question = (id) => ({ questionId: id, parentId: 0, type: "ORIGINAL", intention: "경험", content: `질문 ${id}: 프로젝트 경험을 설명해주세요.`, personaId: 1 });
const results = [];
const report = (result) => { results.push(result); console.log(`PASS ${result}`); };

async function fixture({ multi = false, answerMode = "voice", timeout = false, denied = false, fail = false, delayUploads = false, complete = false, mimeMode, socketOnAnswer = false, preparationFailed = false, recorderFails = false, slowStop = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(({ timeout, denied, mimeMode, recorderFails, slowStop }) => {
    window.__tracks = [];
    window.__captures = [];
    window.__sockets = [];
    window.__mediaRequests = 0;
    const originalClone = MediaStreamTrack.prototype.clone;
    MediaStreamTrack.prototype.clone = function () {
      const track = originalClone.call(this);
      window.__tracks.push(track);
      return track;
    };
    const originalMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (constraints) => {
      window.__mediaRequests++;
      if (denied) throw new DOMException("denied", "NotAllowedError");
      const stream = await originalMedia(constraints);
      window.__tracks.push(...stream.getTracks());
      return stream;
    };
    const NativeRecorder = MediaRecorder;
    window.MediaRecorder = class extends NativeRecorder {
      static isTypeSupported(type) {
        return (!mimeMode || type.includes(mimeMode)) && NativeRecorder.isTypeSupported(type);
      }
      constructor(stream, options) {
        super(stream, options);
        this.__info = { kinds: stream.getTracks().map((track) => track.kind), mimeType: this.mimeType, options, stops: 0 };
        window.__captures.push(this.__info);
      }
      start(...args) {
        if (recorderFails) throw new Error("테스트 녹화 시작 실패");
        super.start(...args);
      }
      stop() {
        this.__info.stops++;
        if (slowStop) setTimeout(() => super.stop(), 500);
        else super.stop();
      }
    };
    window.SpeechRecognition = class {
      start() {
        this.onstart?.();
        setTimeout(() => this.onresult?.({ results: [{ isFinal: true, 0: { transcript: "팀 프로젝트에서 성능을 개선하고 문제를 해결했습니다." } }] }), 20);
      }
      stop() { this.onend?.(); }
      abort() { this.onend?.(); }
    };
    window.WebSocket = class extends EventTarget {
      static CONNECTING = 0;
      static OPEN = 1;
      static CLOSING = 2;
      static CLOSED = 3;
      readyState = 1;
      constructor() { super(); window.__sockets.push(this); }
      close() { this.readyState = 3; this.dispatchEvent(new Event("close")); }
      send() {}
    };
    if (timeout) {
      const originalTimeout = window.setTimeout.bind(window);
      window.setTimeout = (callback, delay, ...args) => originalTimeout(callback, delay === 210_000 ? 1_200 : delay, ...args);
    }
  }, { timeout, denied, mimeMode, recorderFails, slowStop });
  const uploads = [];
  const answers = [];
  const quits = [];
  const releases = [];
  let current = question(101);
  let shouldFail = fail;
  await page.route("**/*", async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (!pathname.startsWith("/api/") && !pathname.startsWith("/chat/")) return route.continue();
    const json = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (pathname.endsWith("/recordings")) {
      assert.match(request.headers()["content-type"], /multipart\/form-data; boundary=/);
      assert.match(request.headers().authorization, /^Bearer /);
      const body = request.postDataBuffer().toString("latin1");
      const field = (name) => body.match(new RegExp(`name="${name}"\\r\\n\\r\\n([^\\r]+)`))?.[1];
      uploads.push({ kind: field("kind"), questionId: field("questionId"), endReason: field("endReason"),
        filename: body.match(/filename="([^"]+)"/)?.[1], type: body.match(/Content-Type: ([^\r]+)/)?.[1] });
      if (delayUploads) await new Promise((resolve) => releases.push(resolve));
      return json(shouldFail ? { message: "테스트 업로드 실패" } : { data: { recordingId: uploads.length } }, shouldFail ? 500 : 201);
    }
    if (pathname.endsWith("/answers")) {
      answers.push(request.postDataJSON());
      current = question(102);
      if (socketOnAnswer) await page.evaluate(() => window.__sockets.filter((socket) => socket.readyState === 1).forEach((socket) => socket.dispatchEvent(new MessageEvent("message", { data: JSON.stringify({ status: "COMPLETED" }) }))));
      return json({ status: complete ? "COMPLETED" : "IN_PROGRESS", question: complete ? undefined : current });
    }
    if (pathname.endsWith("/quit")) { quits.push(pathname); return json({ status: "ABANDONED" }); }
    if (pathname.endsWith("/question")) return json(current);
    if (pathname === "/api/questions/tailor") return json({ data: { status: preparationFailed ? "FAILED" : "SUCCEEDED", preparationStatus: preparationFailed ? "FAILED" : "READY", errorMessage: preparationFailed ? "테스트 면접 준비 실패" : null, retryable: false, chatDelivered: !preparationFailed, questions: [current, question(102)], interviewId: 42 } });
    if (pathname.endsWith("/me")) return json({ data: { id: 7, name: "테스트", nickname: "테스트" } });
    if (pathname.includes("/elevenlabs/") || pathname.includes("/supertone/")) return json({ message: "TTS mock" }, 503);
    if (pathname.endsWith("/refresh")) return json({ accessToken: "test-only-token" });
    return json({ data: [] });
  });
  await page.goto(origin);
  await page.getByRole("button", { name: "면접 시작하기", exact: true }).first().waitFor();
  await page.evaluate(async ({ multi, answerMode }) => {
    const { setAccessToken } = await import("/src/shared/api/accessToken.ts");
    setAccessToken("test-only-token");
    const routerUrl = performance.getEntriesByType("resource").map((entry) => entry.name).find((url) => new URL(url).pathname === "/src/app/router.tsx");
    const { default: router } = await import(routerUrl);
    window.__router = router;
    await router.navigate("/main/interview/42", { state: { preparedInterview: {
      sessionId: "test-session", interviewId: 42, userId: 7, personaId: 1, personaName: "테스트 면접관", role: "TECH", major: "FRONTEND",
      type: "FRIENDLY", personaType: "FRIENDLY", level: "EASY", career: 0, gender: "FEMALE", tone: "GENTLE", jobId: "test-job", status: "IN_PROGRESS", currentQuestionIndex: 0,
      questions: [], mode: multi ? "MULTI" : "SOLO", answerMode,
      interviewers: [{ personaId: 1, name: "테스트 면접관", roleLabel: "기술 면접관" }],
    } } });
  }, { multi, answerMode });
  const start = page.getByRole("button", { name: multi ? "음성 답변 시작" : "시작하기", exact: true });
  const finish = page.getByRole("button", { name: multi ? "답변 끝내기" : "끝내기", exact: true });
  if (answerMode === "voice" && !denied && !preparationFailed) {
    try { await start.waitFor({ state: "visible" }); }
    catch (error) {
      console.error("Fixture failed:", page.url(), errors, await page.locator("body").innerText());
      throw error;
    }
  }
  return { page, context, start, finish, uploads, answers, quits, releases, errors,
    recover: () => { shouldFail = false; },
    release: () => { for (const resolve of releases.splice(0)) resolve(); },
  };
}
async function assertReleased(f) {
  await f.page.waitForFunction(() => window.__tracks.every((track) => track.readyState === "ended"));
  assert.deepEqual(f.errors, []);
  const captures = await f.page.evaluate(() => window.__captures);
  for (const capture of captures) assert.equal(capture.stops, 1, "each capture stops once");
}
async function waitUntil(check) {
  for (let i = 0; i < 100; i++) { if (check()) return; await new Promise((resolve) => setTimeout(resolve, 50)); }
  assert.fail("timed out waiting for network assertion");
}
const unloadWarns = (page) => page.evaluate(() => !window.dispatchEvent(new Event("beforeunload", { cancelable: true })));
try {
  for (const options of [{ denied: true }, { preparationFailed: true }, { recorderFails: true }]) {
    const f = await fixture(options);
    await f.page.getByText(options.denied ? "카메라와 마이크 권한을 허용해주세요." : options.preparationFailed ? "테스트 면접 준비 실패" : "테스트 녹화 시작 실패", { exact: false }).first().waitFor();
    assert.equal(await unloadWarns(f.page), false);
    assert.equal(f.uploads.length, 0);
    await f.page.getByRole("button", { name: options.preparationFailed ? "메인으로 돌아가기" : "그만두기", exact: true }).click();
    await f.page.waitForURL("**/main");
    assert.equal(await unloadWarns(f.page), false);
    await f.context.close();
    report(`unload without recording: ${Object.keys(options)[0]}`);
  }
  const stopping = await fixture({ slowStop: true, delayUploads: true });
  await stopping.start.click();
  await stopping.finish.waitFor();
  await stopping.page.waitForTimeout(250);
  await stopping.page.getByRole("button", { name: "그만두기", exact: true }).click();
  assert.equal(await unloadWarns(stopping.page), true, "finalizing files stays protected");
  await stopping.page.waitForURL("**/main");
  await waitUntil(() => stopping.uploads.length === 2);
  assert.equal(await unloadWarns(stopping.page), true, "queued files stay protected after navigation");
  stopping.release();
  await stopping.page.getByText("업로드 완료", { exact: true }).first().waitFor();
  await stopping.page.waitForFunction(async () => !(await import("/src/features/interview-page/interview/model/interviewRecordingStore.ts")).hasUnsavedRecordings());
  assert.equal(await unloadWarns(stopping.page), false);
  await assertReleased(stopping);
  await stopping.context.close();
  report("unload covers file finalization and uploads, clears after success");
  for (const multi of [false, true]) {
    const f = await fixture({ multi });
    await f.start.click();
    await f.finish.waitFor();
    assert.equal(await f.page.evaluate(() => !window.dispatchEvent(new Event("beforeunload", { cancelable: true }))), true);
    await f.page.waitForTimeout(250);
    await f.finish.click();
    await waitUntil(() => f.answers.length === 1);
    assert.deepEqual(f.uploads.map(({ kind, questionId, endReason }) => ({ kind, questionId, endReason })), [{ kind: "ANSWER", questionId: "101", endReason: "user" }]);
    assert.equal(f.answers[0].questionId, 101);
    assert.match(f.uploads[0].type, /^audio\//);
    assert.match(f.uploads[0].filename, /\.(webm|m4a|ogg)$/);
    const captures = await f.page.evaluate(() => window.__captures);
    assert.deepEqual(captures[0].kinds.sort(), ["audio", "video"]);
    assert.deepEqual(captures[1].kinds, ["audio"]);
    assert.equal(captures[0].options.videoBitsPerSecond, 1_000_000);
    await f.page.getByRole("button", { name: "그만두기", exact: true }).click();
    await f.page.waitForURL("**/main");
    await waitUntil(() => f.uploads.length === 2);
    assert.equal(f.uploads[1].kind, "FULL_INTERVIEW");
    assert.equal(f.uploads[1].questionId, undefined);
    assert.equal(f.uploads[1].endReason, undefined);
    assert.match(f.uploads[1].type, /^video\//);
    assert.ok(f.uploads[1].filename.endsWith(f.uploads[1].type.startsWith("video/mp4") ? ".mp4" : ".webm"));
    await assertReleased(f);
    await f.context.close();
    report(`${multi ? "MULTI" : "SOLO"}: answer + full capture, multipart contract, track cleanup`);
  }
  for (const action of ["quit", "header", "back", "logout"]) {
    const f = await fixture({ multi: action === "header", delayUploads: action === "logout" || action === "header" });
    await f.start.click();
    await f.finish.waitFor();
    await f.page.waitForTimeout(250);
    if (action === "back") await f.page.goBack();
    else await f.page.getByRole("button", { name: action === "quit" ? "그만두기" : action === "header" ? "피드백" : "로그아웃", exact: true }).click();
    await waitUntil(() => f.uploads.length === 2);
    assert.equal(f.uploads.find((upload) => upload.kind === "ANSWER").endReason, "interrupted");
    assert.equal(f.quits.length, 1);
    if (action === "logout") {
      assert.match(f.page.url(), /interview\/42$/);
      assert.ok(await f.page.evaluate(async () => (await import("/src/shared/api/accessToken.ts")).getAccessToken()));
      f.release();
      await f.page.waitForURL("**/login");
      assert.equal(await f.page.evaluate(async () => (await import("/src/shared/api/accessToken.ts")).getAccessToken()), null);
    } else {
      await f.page.waitForURL(action === "header" ? "**/main/feedback/list" : action === "back" ? `${origin}/` : "**/main");
      if (action === "header") {
        assert.equal(await f.page.getByText("업로드 중입니다.", { exact: false }).count(), 2);
        assert.equal(await f.page.evaluate(() => !window.dispatchEvent(new Event("beforeunload", { cancelable: true }))), true);
        f.release();
      }
    }
    await assertReleased(f);
    await f.context.close();
    report(`${action}: interrupted audio + full video once; auth preserved until uploads finish`);
  }
  for (const multi of [false, true]) {
    const f = await fixture({ multi, timeout: true });
    await f.start.click();
    await waitUntil(() => f.answers.length === 1);
    assert.equal(f.uploads[0].endReason, "timeout");
    await f.start.waitFor();
    await f.page.getByRole("button", { name: "그만두기", exact: true }).click();
    await f.page.waitForURL("**/main");
    await assertReleased(f);
    await f.context.close();
    report(`${multi ? "MULTI" : "SOLO"}: 210s automatic completion through shared path`);
  }
  for (const source of ["http", "socket", "both"]) {
    const f = await fixture({ complete: source !== "socket", socketOnAnswer: source === "both", mimeMode: source === "socket" ? "webm" : undefined });
    await f.start.click();
    await f.finish.waitFor();
    await f.page.waitForTimeout(250);
    if (source !== "socket") await f.finish.click();
    if (source === "socket") await f.page.evaluate(() => window.__sockets.filter((socket) => socket.readyState === 1).forEach((socket) => socket.dispatchEvent(new MessageEvent("message", { data: JSON.stringify({ status: "COMPLETED" }) }))));
    await f.page.waitForURL("**/main/interview/completed");
    await waitUntil(() => f.uploads.length === 2);
    assert.equal(f.uploads.filter((upload) => upload.kind === "FULL_INTERVIEW").length, 1);
    assert.equal(f.quits.length, 0);
    await assertReleased(f);
    await f.context.close();
    report(`${source}: completed finalization without duplicate uploads`);
  }
  const mp4 = await fixture({ mimeMode: "mp4", complete: true });
  await mp4.start.click();
  await mp4.finish.waitFor();
  await mp4.page.waitForTimeout(250);
  await mp4.finish.click();
  await mp4.page.waitForURL("**/main/interview/completed");
  await waitUntil(() => mp4.uploads.length === 2);
  assert.match(mp4.uploads.find((upload) => upload.kind === "ANSWER").filename, /\.m4a$/);
  assert.match(mp4.uploads.find((upload) => upload.kind === "FULL_INTERVIEW").filename, /\.mp4$/);
  await assertReleased(mp4);
  await mp4.context.close();
  report("MP4-only browser format: audio m4a + video mp4");
  const failed = await fixture({ fail: true });
  await failed.start.click();
  await failed.finish.waitFor();
  await failed.page.waitForTimeout(250);
  await failed.page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await failed.page.getByText("업로드에 실패한 파일이 있습니다.", { exact: false }).waitFor();
  assert.match(failed.page.url(), /interview\/42$/);
  failed.recover();
  while (await failed.page.getByRole("button", { name: "다시 시도", exact: true }).count()) {
    await failed.page.getByRole("button", { name: "다시 시도", exact: true }).first().click();
  }
  await waitUntil(() => failed.uploads.length === 4);
  await failed.page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await failed.page.waitForURL("**/login");
  await assertReleased(failed);
  await failed.context.close();
  report("failed upload: visible failure, retry preserved files, logout deferred");
  const discarded = await fixture({ fail: true });
  await discarded.start.click();
  await discarded.finish.waitFor();
  await discarded.page.waitForTimeout(250);
  await discarded.page.getByRole("button", { name: "그만두기", exact: true }).click();
  await discarded.page.waitForURL("**/main");
  await discarded.page.getByRole("button", { name: "파일 폐기", exact: true }).first().waitFor();
  assert.equal(await unloadWarns(discarded.page), true);
  while (await discarded.page.getByRole("button", { name: "파일 폐기", exact: true }).count()) {
    await discarded.page.getByRole("button", { name: "파일 폐기", exact: true }).first().click();
  }
  assert.equal(await unloadWarns(discarded.page), false);
  await assertReleased(discarded);
  await discarded.context.close();
  report("discarding failed files clears unload warning");
  for (const multi of [false, true]) {
    const f = await fixture({ multi, answerMode: "text", complete: true });
    assert.equal(await unloadWarns(f.page), false);
    await f.page.getByRole("textbox").first().fill("프로젝트 경험에 대한 텍스트 답변입니다.");
    await f.page.getByRole("button", { name: "제출하기", exact: true }).click();
    await f.page.waitForURL("**/main/interview/completed");
    assert.equal(await f.page.evaluate(() => window.__mediaRequests), 0);
    assert.equal(f.uploads.length, 0);
    assert.equal(f.answers.length, 1);
    assert.deepEqual(f.errors, []);
    await f.context.close();
    report(`${multi ? "MULTI" : "SOLO"}: text mode without device permissions or recording`);
  }
  const denied = await fixture({ denied: true });
  await denied.page.getByText("카메라와 마이크 권한을 허용해주세요.", { exact: false }).waitFor();
  assert.equal(await denied.start.isDisabled(), true);
  assert.equal(denied.uploads.length, 0);
  await denied.page.getByRole("button", { name: "그만두기", exact: true }).click();
  await denied.page.waitForURL("**/main");
  await denied.context.close();
  report("permission denied: voice blocked, setup text choice remains separate");
  const f = await fixture({ answerMode: "text" });
  await f.page.getByRole("button", { name: "그만두기", exact: true }).click();
  await f.page.waitForURL("**/main");
  for (const path of ["/main/setting/interview", "/main/setting/interview/multi"]) {
    await f.page.evaluate((path) => window.__router.navigate(path), path);
    const textChoice = f.page.getByRole("button", { name: "단순 텍스트 면접", exact: false });
    await textChoice.click();
    const voiceChoice = f.page.getByRole("button", { name: "음성/영상 면접", exact: false });
    const labelBox = await voiceChoice.locator("span").first().boundingBox();
    assert.ok(labelBox.width > 200, "answer mode text has enough width");
    assert.equal(await textChoice.getAttribute("aria-pressed"), "true");
    await f.page.screenshot({ path: `/tmp/repit-${path.endsWith("multi") ? "multi" : "solo"}-setup.png`, fullPage: true });
  }
  await f.context.close();
  report("SOLO + MULTI setup: selectable fixed answer modes");
  console.log(`${results.length} browser scenarios passed`);
} finally { await browser.close(); }
