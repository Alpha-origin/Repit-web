import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
export const origin = process.env.INTERVIEW_TEST_ORIGIN ?? "http://127.0.0.1:5173";
export const browser = await chromium.launch({ headless: true, args: [
  "--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream",
  "--autoplay-policy=no-user-gesture-required",
] });
export const question = (id) => ({ questionId: id, parentId: 0, type: "ORIGINAL", intention: "경험", content: `질문 ${id}: 프로젝트 경험을 설명해주세요.`, personaId: 1 });

export async function fixture({ multi = false, answerMode = "voice", timeout = false, denied = false, fail = false, delayUploads = false, complete = false, mimeMode, socketOnAnswer = false, preparationFailed = false, recorderFails = false, slowStop = false, audioResponses = null, holdAudio = false, fastAudioTimers = false, audioDeadline = false, playback = "native" } = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(({ timeout, denied, mimeMode, recorderFails, slowStop, fastAudioTimers, audioDeadline, playback }) => {
    window.__audioEvents = [];
    window.__audios = [];
    window.__releasePlay = [];
    window.__retryDelays = [];
    window.__timeOffset = 0;
    const nativeNow = Date.now;
    Date.now = () => nativeNow() + window.__timeOffset;
    const NativeAudio = window.Audio;
    window.Audio = class extends NativeAudio {
      constructor(...args) { super(...args); window.__audios.push(this); }
    };
    const nativePlay = HTMLMediaElement.prototype.play;
    const nativePause = HTMLMediaElement.prototype.pause;
    let blocked = playback === "blocked";
    HTMLMediaElement.prototype.play = function () {
      if (!(this instanceof HTMLAudioElement)) return nativePlay.call(this);
      window.__audioEvents.push({ type: "play", src: this.src });
      if (blocked) { blocked = false; return Promise.reject(new DOMException("test", "NotAllowedError")); }
      if (playback === "failed") return Promise.reject(new DOMException("test", "NotSupportedError"));
      if (playback === "delayed") return new Promise((resolve) => window.__releasePlay.push(resolve));
      return nativePlay.call(this);
    };
    HTMLMediaElement.prototype.pause = function () {
      if (this instanceof HTMLAudioElement) window.__audioEvents.push({ type: "pause", src: this.src });
      return nativePause.call(this);
    };
    if (fastAudioTimers || audioDeadline) {
      const nativeTimeout = window.setTimeout.bind(window);
      window.setTimeout = (callback, delay, ...args) => {
        if (fastAudioTimers && [1000, 2000, 4000].includes(delay)) {
          window.__retryDelays.push(delay);
          delay = 25;
        }
        if (audioDeadline && delay === 180000) delay = 200;
        return nativeTimeout(callback, delay, ...args);
      };
    }
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
  }, { timeout, denied, mimeMode, recorderFails, slowStop, fastAudioTimers, audioDeadline, playback });
  const audioRequests = [];
  const audioReleases = [];
  const failedRequests = [];
  const directTtsRequests = [];
  const audioCounts = new Map();
  page.on("requestfailed", (request) => { if (new URL(request.url()).pathname.endsWith("/audio")) failedRequests.push(request.url()); });
  const wav = Buffer.alloc(44 + 8000 * 2 * 30);
  wav.write("RIFF"); wav.writeUInt32LE(wav.length - 8, 4); wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8000, 24); wav.writeUInt32LE(16000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write("data", 36); wav.writeUInt32LE(wav.length - 44, 40);
  const uploads = [];
  const answers = [];
  const quits = [];
  const releases = [];
  let current = question(101);
  let shouldFail = fail;
  await page.route("**/*", async (route) => {
    const request = route.request();
    const requestUrl = new URL(request.url());
    const pathname = requestUrl.pathname;
    if (requestUrl.hostname === "tts.example.test") return route.fulfill({ contentType: "audio/wav", body: wav });
    if (pathname.includes("/elevenlabs/") || pathname.includes("/supertone/")) directTtsRequests.push(pathname);
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
    if (pathname.endsWith("/audio")) {
      const id = Number(pathname.split("/").at(-2));
      audioRequests.push({ id, wait: requestUrl.searchParams.get("wait"), authorization: request.headers().authorization });
      const count = audioCounts.get(id) ?? 0;
      audioCounts.set(id, count + 1);
      if (holdAudio && id === 101) await new Promise((resolve) => audioReleases.push(resolve));
      const item = audioResponses?.[Math.min(count, audioResponses.length - 1)] ?? "FAILED";
      if (item === "NETWORK") return route.abort("failed");
      if (item === "NOT_FOUND") return json({ message: "NOT_FOUND" }, 404);
      if (item === "MALFORMED") return json({ questionId: id, status: "READY", url: "http://insecure.test/audio" });
      if (item === "WRONG_QUESTION") return json({ questionId: id + 1, status: "READY", url: "https://tts.example.test/wrong.wav" });
      const body = typeof item === "object" ? item : { questionId: id, status: item, url: item === "READY" ? `https://tts.example.test/${id}.wav` : null, errorCode: item === "FAILED" ? "TTS_DISABLED" : null };
      return json(body);
    }
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
  return { page, context, start, finish, uploads, answers, quits, releases, errors, audioRequests, failedRequests, directTtsRequests,
    releaseAudio: () => { for (const resolve of audioReleases.splice(0)) resolve(); },
    recover: () => { shouldFail = false; },
    release: () => { for (const resolve of releases.splice(0)) resolve(); },
  };
}
export async function assertReleased(f) {
  await f.page.waitForFunction(() => window.__tracks.every((track) => track.readyState === "ended"));
  assert.deepEqual(f.errors, []);
  const captures = await f.page.evaluate(() => window.__captures);
  for (const capture of captures) assert.equal(capture.stops, 1, "each capture stops once");
}
export async function waitUntil(check) {
  for (let i = 0; i < 100; i++) { if (await check()) return; await new Promise((resolve) => setTimeout(resolve, 50)); }
  assert.fail("timed out waiting for network assertion");
}
export const unloadWarns = (page) => page.evaluate(() => !window.dispatchEvent(new Event("beforeunload", { cancelable: true })));
