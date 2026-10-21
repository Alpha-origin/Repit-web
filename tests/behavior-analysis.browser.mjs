import assert from "node:assert/strict";
import { readFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE_PATH ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH } : {}),
});
const origin = process.env.INTERVIEW_TEST_ORIGIN ?? "http://127.0.0.1:5185";
const offOrigin = process.env.BEHAVIOR_OFF_ORIGIN;
const folder = new URL("../docs/behavior-analysis/contracts/", import.meta.url);
const payload = (name) => JSON.parse(readFileSync(new URL(`${name}.json`, folder), "utf8"));
const succeeded = { interviewId: 42, status: "SUCCEEDED", totalScore: 80, summary: "내용 분석 완료", feedbacks: [] };
let passed = 0;
const report = (name) => { passed++; console.log(`PASS ${name}`); };
const pending = () => ({ success: true, data: { status: "ANALYZING", result: null, canRetry: false, reasonCode: null, error: null, behavior: null, latestAnalysisId: "102", behaviorAnalysisId: null, showingPreviousResult: false } });

async function fixture({ value = payload("api-ready"), steps = [], post = pending(), code, network, feedback = succeeded, mode = "VOICE", storedMode = mode, status = "COMPLETED", storedStatus = status, url = origin, viewport } = {}) {
  const context = await browser.newContext({ viewport: viewport ?? { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const errors = [];
  const state = { gets: 0, posts: 0, policyGets: 0, uploads: [], storedStatus, value, steps, post, code, network };
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("https://cdn.jsdelivr.net/**", (handler) => handler.abort());
  await page.clock.install();
  await page.route("**/api/**", async (handler) => {
    const request = handler.request();
    const path = new URL(request.url()).pathname;
    if (!path.startsWith("/api/")) return handler.continue();
    const json = (value, code = 200) => handler.fulfill({ status: code, contentType: "application/json", body: JSON.stringify(value) });
    if (path.endsWith("/refresh")) return json({ accessToken: "behavior-fixture-only" });
    if (path.endsWith("/me")) return json({ data: { id: 7, name: "검증", nickname: "검증", email: "fixture@example.com" } });
    if (path === "/api/interviews/getAll") return json({ success: true, data: [42, 43].map((id) => ({ id, status, answerMode: mode, mode: "SOLO", createdAt: "2026-10-20T00:00:00Z" })) });
    if (path === "/api/interviews/get") { state.policyGets++; return json({ data: { status: state.storedStatus, ...(storedMode === "MISSING" ? {} : { answerMode: storedMode }) } }); }
    if (path.endsWith("/recordings")) {
      state.uploads.push(request.postData());
      state.value = payload("api-ready");
      return json({ success: true, data: { recordingId: 501 } });
    }
    if (path === "/api/feedbacks/getAll" || path === "/api/answer/getAll") return json({ success: true, data: [] });
    if (path === "/api/feedbacks") return json({ success: true, data: feedback });
    if (path.endsWith("/audio-analysis")) return json({ success: true, data: { status: "READY", answers: [{}] } });
    if (path.endsWith("/video-analysis/retry")) {
      state.posts++;
      if (state.post.waitFor) await state.post.waitFor;
      if (state.post.network) return handler.abort("connectionfailed");
      return json(state.post.value ?? state.post, state.post.code ?? 202);
    }
    if (path.endsWith("/video-analysis")) {
      state.gets++;
      const step = state.steps.shift();
      if (step?.waitFor) await step.waitFor;
      if (step?.network || state.network) return handler.abort("connectionfailed");
      return json(step?.value ?? state.value, step?.code ?? state.code ?? 200);
    }
    return json({ success: true, data: [] });
  });
  await page.goto(`${url}/main/feedback/overall/42`);
  const policyRejected = storedStatus === "ABANDONED";
  await page.getByText(policyRejected ? "중단된 면접은 피드백을 생성하지 않습니다." : storedStatus !== "COMPLETED" ? "아직 완료되지 않은 면접입니다. 면접을 마친 뒤 피드백을 확인해주세요." : feedback.status === "FAILED" ? "피드백 분석에 실패했습니다." : feedback.status === "PENDING" ? "피드백을 분석 중입니다. 완료되면 자동으로 표시됩니다." : "내용 분석 완료", { exact: true }).first().waitFor();
  if ((storedMode === "VOICE" || storedMode === null) && storedStatus === "COMPLETED" && url === origin) {
    await page.getByRole("heading", { name: "영상 행동 관찰", exact: true }).waitFor();
    await page.waitForFunction(() => document.querySelector('[aria-labelledby] [role="status"]')?.textContent !== "영상 행동 관찰 정보를 불러오고 있습니다.");
  }
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100));
  return {
    page, state, context,
    section: page.getByRole("region", { name: "영상 행동 관찰", exact: true }),
    close: async () => { assert.deepEqual(errors, []); await context.close(); },
  };
}

try {
  for (const [name, text] of [["api-ready", "관찰 완료"], ["api-partial", "일부 관찰 완료. 측정 가능한 항목만 표시합니다."], ["api-zero-face", "일부 관찰 완료. 측정 가능한 항목만 표시합니다."], ["api-disabled", "영상 행동 관찰 기능을 준비 중입니다."], ["api-unavailable", "이 영상에서는 행동 지표를 측정할 수 있는 구간이 충분하지 않습니다."], ["api-no-recording", "분석할 면접 영상이 없습니다."]]) {
    const f = await fixture({ value: payload(name) });
    await f.section.getByText(text, { exact: true }).waitFor();
    assert.equal(f.state.policyGets, 1, "진입 시 단건 면접 조회");
    assert.equal(await f.section.getByRole("button", { name: "다시 확인", exact: true }).count(), name === "api-no-recording" ? 1 : 0);
    if (name === "api-zero-face") {
      assert.equal(await f.section.getByRole("article", { name: "얼굴 관찰", exact: true }).getByText("0.0%", { exact: true }).count(), 1);
      assert.equal(await f.section.getByText("측정 불가", { exact: true }).count(), 4);
    }
    if (name === "api-partial") {
      await f.section.getByLabel("시간 요약 지표").selectOption("shoulderLevelRatio");
      await f.section.getByText("이 지표는 측정 불가로 시간별 수치를 제공하지 않습니다.").waitFor();
      assert.equal(await f.section.getByRole("table").count(), 0);
      assert.equal(await f.section.getByRole("img", { name: /시간대별 그래프/ }).count(), 0);
    }
    const gets = f.state.gets;
    await f.page.clock.runFor(60_000);
    assert.equal(f.state.gets, gets); assert.equal(f.state.posts, 0);
    await f.close(); report(`${name}: 표시·0%/null·terminal 폴링 종료`);
  }

  for (const feedbackStatus of ["PENDING", "FAILED"]) {
    const f = await fixture({ feedback: { ...succeeded, status: feedbackStatus } });
    await f.section.getByText("관찰 완료", { exact: true }).waitFor();
    assert.equal(f.state.gets, 1);
    await f.close(); report(`내용 ${feedbackStatus} 중에도 독립 표시`);
  }

  const previous = await fixture({ value: payload("api-analyzing-previous") });
  await previous.section.getByText("다시 분석 중이며 이전 결과를 표시합니다.").waitFor();
  assert.equal(await previous.section.getByRole("button").count(), 0);
  assert.equal(await previous.section.getByRole("article").count(), 5);
  previous.state.value = payload("api-ready");
  await previous.page.clock.runFor(5_000);
  await previous.section.getByText("관찰 완료", { exact: true }).waitFor();
  assert.equal(await previous.section.getByText("다시 분석 중이며 이전 결과를 표시합니다.").count(), 0);
  await previous.close(); report("분석 중 이전 결과 유지·새 결과 교체");

  let release;
  const waiting = new Promise((resolve) => { release = resolve; });
  const retry = await fixture({ value: payload("api-failed-previous"), post: { waitFor: waiting, value: pending() } });
  await retry.section.getByRole("button", { name: "영상 다시 분석", exact: true }).evaluate((button) => { button.click(); button.click(); });
  await retry.section.getByRole("button", { name: "요청 중…", exact: true }).waitFor();
  assert.equal(retry.state.posts, 1);
  assert.equal(await retry.section.getByRole("article").count(), 5);
  release();
  await retry.section.getByText("영상 행동을 분석하고 있습니다. 완료되면 자동으로 표시됩니다.").waitFor();
  assert.equal(retry.state.posts, 1);
  await retry.close(); report("중복 클릭 POST 1회·진행 중 이전 수치 유지");

  for (const post of [{ code: 409, value: { message: "중복" } }, { network: true }]) {
    const f = await fixture({ value: payload("api-failed-previous"), post });
    await f.section.getByRole("button", { name: "영상 다시 분석", exact: true }).click();
    await f.page.waitForFunction(() => [...document.querySelectorAll("button")].find((b) => b.textContent === "영상 다시 분석")?.disabled === false);
    assert.equal(f.state.posts, 1); assert.equal(f.state.gets, 2);
    await f.section.getByText(post.network ? "재분석 요청의 접수 여부가 불확실해 최신 상태를 다시 확인했습니다." : "중복", { exact: true }).waitFor();
    assert.equal(await f.section.getByRole("button", { name: "다시 확인", exact: true }).count(), 0);
    await f.page.clock.runFor(60_000);
    assert.equal(f.state.posts, 1);
    await f.close(); report(`${post.network ? "POST 유실" : "409"} 이후 GET 확인·자동 POST 재전송 없음`);
  }

  const retryRejected = await fixture({ value: payload("api-failed-previous"), post: { code: 409, value: { message: "중단된 면접입니다." } } });
  retryRejected.state.storedStatus = "ABANDONED";
  retryRejected.state.steps.push({ code: 409 });
  await retryRejected.section.getByRole("button", { name: "영상 다시 분석", exact: true }).click();
  await retryRejected.page.getByText("중단된 면접은 피드백을 생성하지 않습니다.", { exact: true }).waitFor();
  assert.equal(retryRejected.state.posts, 1);
  assert.equal(retryRejected.state.gets, 2);
  assert.equal(await retryRejected.section.count(), 0);
  assert.equal(await retryRejected.page.getByRole("button", { name: /PDF/ }).count(), 0);
  await retryRejected.close(); report("재분석 409 → GET 확인 → 중단 정책 적용");

  for (const error of [{ code: 503 }, { code: 429 }, { code: 403 }, { code: 404 }, { network: true }]) {
    const f = await fixture({ value: payload("api-analyzing-previous") });
    f.state.steps.push(error);
    await f.page.clock.runFor(5_000);
    await f.section.getByText(error.code === 403 ? "접근 권한이 없습니다." : error.code === 404 ? "면접 정보 또는 녹화 영상을 찾을 수 없습니다." : "영상 분석 정보를 확인하지 못했습니다. 다시 확인해 주세요.").waitFor();
    const gets = f.state.gets;
    await f.page.clock.runFor(60_000);
    assert.equal(f.state.gets, gets); assert.equal(await f.section.getByRole("article").count(), [403, 404].includes(error.code) ? 0 : 5);
    f.state.value = payload("api-ready");
    await f.section.getByRole("button", { name: "다시 확인", exact: true }).click();
    await f.page.clock.runFor(1);
    await f.section.getByText("관찰 완료", { exact: true }).waitFor();
    assert.equal(f.state.posts, 0);
    await f.close(); report(`${error.code ?? "network"} 조회 오류 수치 유지·수동 GET 회복`);
  }

  const deadline = await fixture({ value: pending() });
  const reads = deadline.state.gets;
  await deadline.page.clock.fastForward(10 * 60_000);
  await deadline.section.getByText("분석이 지연되고 있습니다. 나중에 다시 확인해 주세요.").waitFor();
  assert.equal(deadline.state.gets, reads);
  deadline.state.value = payload("api-ready");
  await deadline.section.getByRole("button", { name: "다시 확인", exact: true }).click();
  await deadline.page.clock.runFor(1);
  await deadline.section.getByText("관찰 완료", { exact: true }).waitFor();
  await deadline.close(); report("10분 deadline은 실패 대신 지연 안내·GET 재시작");

  const hidden = await fixture({ value: pending() });
  await hidden.page.evaluate(() => { Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" }); document.dispatchEvent(new Event("visibilitychange")); });
  await hidden.page.clock.runFor(30_000);
  assert.equal(hidden.state.gets, 1);
  hidden.state.value = payload("api-ready");
  await hidden.page.evaluate(() => { Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" }); document.dispatchEvent(new Event("visibilitychange")); });
  await hidden.section.getByText("관찰 완료", { exact: true }).waitFor();
  await hidden.close(); report("hidden 탭 중지·visible 즉시 조회");

  const rejected = await fixture({ value: pending() });
  rejected.state.storedStatus = "ABANDONED";
  rejected.state.steps.push({ code: 409 });
  await rejected.page.clock.runFor(5_000);
  await rejected.page.getByText("중단된 면접은 피드백을 생성하지 않습니다.", { exact: true }).waitFor();
  assert.equal(await rejected.section.count(), 0);
  assert.equal(await rejected.page.getByRole("button", { name: /PDF/ }).count(), 0);
  await rejected.page.clock.runFor(60_000);
  assert.equal(rejected.state.gets, 2); assert.equal(rejected.state.posts, 0);
  await rejected.close(); report("영상 409 정책 거절은 결과·폴링·PDF 차단");

  const legacy = await fixture({ storedMode: null });
  await legacy.section.getByText("관찰 완료", { exact: true }).waitFor();
  assert.equal(legacy.state.gets, 1);
  await legacy.close(); report("명시적 null인 이전 음성 면접은 API 호환 규칙 적용");

  for (const config of [{ mode: "TEXT" }, { storedMode: "MISSING" }, { storedMode: "UNKNOWN" }, { storedMode: "TEXT" }, { status: "ABANDONED" }, { storedStatus: "ABANDONED" }, { storedStatus: "IN_PROGRESS" }, ...(offOrigin ? [{ url: offOrigin }] : [])]) {
    const f = await fixture(config);
    await f.page.clock.runFor(60_000);
    assert.equal(f.state.gets, 0); assert.equal(f.state.posts, 0); assert.equal(await f.section.count(), 0);
    await f.close(); report(`${JSON.stringify(config)} 행동 API 0회`);
  }

  for (const reason of ["UPLOADED_BEFORE_ENABLED", "SOURCE_EXPIRED", "RESULT_SCHEMA_UNSUPPORTED"]) {
    const value = payload(reason === "RESULT_SCHEMA_UNSUPPORTED" ? "api-partial" : "api-no-recording");
    value.data.reasonCode = reason;
    const f = await fixture({ value });
    assert.equal(await f.section.getByRole("button").count(), 0);
    await f.close(); report(`${reason}: 확인·재분석 버튼 숨김`);
  }

  const invalid = payload("api-ready"); invalid.data.behavior.metrics.faceVisibleRatio.value = "invalid";
  const malformed = await fixture({ value: invalid });
  await malformed.section.getByText("결과 형식을 확인할 수 없습니다.").waitFor();
  assert.equal(await malformed.section.getByRole("article").count(), 0);
  await malformed.close(); report("잘못된 응답은 가짜 0% 없이 형식 안내");

  const chart = await fixture();
  const detailToggle = chart.section.getByText("상세 수치·설명 보기", { exact: true });
  const graph = chart.section.getByRole("img", { name: /^얼굴 관찰 시간대별 그래프\./ });
  await graph.waitFor();
  assert.equal(await graph.locator("rect").count(), payload("api-ready").data.behavior.timeline.length);
  assert.match(await graph.locator("rect title").first().textContent(), /00:00–00:10 · 100\.0%/);
  assert.equal(await chart.section.getByRole("table").count(), 0);
  assert.equal(await chart.section.getByText("얼굴이 한 명 관찰된 시간의 비율", { exact: true }).isVisible(), false);
  await chart.section.getByLabel("시간 요약 지표").selectOption("headFacingRatio");
  const changedGraph = chart.section.getByRole("img", { name: /^정면 방향 추정 시간대별 그래프\./ });
  await changedGraph.waitFor();
  assert.match(await changedGraph.locator("rect title").first().textContent(), /00:00–00:10 · 80\.0%/);
  await detailToggle.click();
  await chart.section.getByRole("table").getByText("정면 방향 추정 시간 요약", { exact: true }).waitFor();
  assert.equal(await chart.section.getByText("얼굴이 한 명 관찰된 시간의 비율", { exact: true }).isVisible(), true);
  await detailToggle.press("Enter");
  assert.equal(await chart.section.getByRole("table").count(), 0);
  assert.equal(await changedGraph.isVisible(), true);
  assert.equal(await chart.section.getByLabel("시간 요약 지표").inputValue(), "headFacingRatio");
  await chart.close(); report("기본 막대그래프·지표 변경·상세 펼침과 키보드 접힘");

  const mobile = await fixture({ viewport: { width: 390, height: 844 } });
  await mobile.section.getByText("관찰 완료", { exact: true }).waitFor();
  assert.ok(await mobile.section.evaluate((node) => node.scrollWidth <= node.clientWidth + 1));
  await mobile.section.getByLabel("시간 요약 지표").selectOption("smileShapeRatio");
  await mobile.section.getByText("상세 수치·설명 보기", { exact: true }).click();
  await mobile.section.getByRole("table").getByText("미소 형태 관찰 시간 요약").waitFor();
  await mobile.close(); report("모바일 카드·시간 표·선택 접근성");

  const upload = await fixture({ value: payload("api-no-recording") });
  await upload.page.evaluate(async () => {
    const { useRecordingUploadStore } = await import("/src/features/interview-page/interview/model/interviewRecordingStore.ts");
    useRecordingUploadStore.setState({ jobs: [{ id: "behavior-upload", interviewId: 42, kind: "FULL_INTERVIEW", status: "UPLOADING", errorMessage: null, canRetry: false }] });
  });
  await upload.section.getByText("면접 영상을 업로드하고 있습니다.").waitFor();
  upload.state.value = payload("api-ready");
  await upload.page.evaluate(async () => {
    const { useRecordingUploadStore } = await import("/src/features/interview-page/interview/model/interviewRecordingStore.ts");
    useRecordingUploadStore.setState((state) => ({ jobs: state.jobs.map((job) => ({ ...job, status: "SUCCEEDED" })) }));
  });
  await upload.page.clock.runFor(1);
  await upload.section.getByText("관찰 완료", { exact: true }).waitFor();
  assert.equal(upload.state.gets, 2); assert.equal(upload.state.posts, 0);
  await upload.close(); report("NO_RECORDING 종료 후 업로드 완료 이벤트로 즉시 GET");

  const uploaded = await fixture({ value: payload("api-no-recording") });
  await uploaded.page.evaluate(async () => {
    const { enqueueRecordingUpload } = await import("/src/features/interview-page/interview/model/interviewRecordingStore.ts");
    enqueueRecordingUpload({ interviewId: 42, kind: "FULL_INTERVIEW", file: new File(["synthetic-upload-fixture"], "fixture.webm", { type: "video/webm" }) });
  });
  await uploaded.page.clock.resume();
  await uploaded.section.getByText("관찰 완료", { exact: true }).waitFor();
  assert.equal(uploaded.state.uploads.length, 1);
  assert.match(uploaded.state.uploads[0], /name="kind"\r\n\r\nFULL_INTERVIEW/);
  assert.match(uploaded.state.uploads[0], /name="file"/);
  assert.doesNotMatch(uploaded.state.uploads[0], /name="(?:questionId|endReason)"/);
  assert.equal(uploaded.state.gets, 2);
  assert.equal(uploaded.state.posts, 0);
  await uploaded.close(); report("multipart 업로드 성공 → store 완료 → 결과 GET 연결");

  let releaseStale;
  const staleResponse = new Promise((resolve) => { releaseStale = resolve; });
  const stale = await fixture({ value: pending() });
  stale.state.steps.push({ waitFor: staleResponse, value: payload("api-partial") });
  await stale.page.clock.runFor(5_000);
  const canceled = stale.page.waitForEvent("requestfailed", { predicate: (request) => request.url().endsWith("/42/video-analysis") });
  stale.state.value = payload("api-ready");
  await stale.page.clock.resume();
  await stale.page.evaluate(() => { window.history.pushState({}, "", "/main/feedback/overall/43"); window.dispatchEvent(new PopStateEvent("popstate")); });
  await stale.section.getByText("관찰 완료", { exact: true }).waitFor();
  await canceled;
  releaseStale();
  assert.equal(await stale.section.getByText("일부 관찰 완료. 측정 가능한 항목만 표시합니다.", { exact: true }).count(), 0);
  await stale.close(); report("면접 전환은 이전 GET 취소·늦은 응답 혼입 방지");

  const leaving = await fixture({ value: pending() });
  await leaving.page.clock.resume();
  await leaving.page.getByRole("button", { name: "마이페이지", exact: true }).click();
  await leaving.page.waitForURL("**/main/mypage");
  await leaving.page.getByLabel("마이페이지", { exact: true }).waitFor();
  await leaving.page.clock.pauseAt(await leaving.page.evaluate(() => Date.now() + 100));
  const beforeLeave = leaving.state.gets;
  await leaving.page.clock.runFor(60_000);
  assert.equal(leaving.state.gets, beforeLeave);
  await leaving.close(); report("화면 이탈 후 폴링 타이머 정리");

  const pdf = await fixture({ value: payload("api-failed-previous") });
  await pdf.section.getByRole("article").first().waitFor();
  const order = await pdf.section.getByRole("heading", { name: "영상 행동 관찰", exact: true }).evaluate((heading) => {
    const audio = document.querySelector('[aria-label="음성 분석 결과"]');
    const video = heading.closest("section");
    return Boolean(audio && audio.nextElementSibling === video && video.closest("section")?.parentElement);
  });
  assert.equal(order, true);
  assert.equal(await pdf.section.locator("details[data-pdf-expand]").evaluateAll((nodes) => nodes.length > 0 && nodes.every((node) => !node.open)), true);
  await pdf.section.evaluate((section) => {
    const control = document.createElement("details");
    control.setAttribute("data-pdf-control", "");
    control.innerHTML = "<summary>일반 접힘 영역</summary><p>자동으로 펼치지 않는 내용</p>";
    section.append(control);
    window.__behaviorPdfClone = null;
    const removeChild = document.body.removeChild.bind(document.body);
    document.body.removeChild = (child) => {
      if (child instanceof HTMLIFrameElement && child.classList.contains("html2canvas-container")) {
        const clone = child.contentDocument;
        const expandable = [...(clone?.querySelectorAll("details[data-pdf-expand]") ?? [])];
        const unmarked = clone?.querySelector("details[data-pdf-control]");
        const table = expandable.find((node) => node.querySelector("table"))?.querySelector("table");
        window.__behaviorPdfClone = {
          expanded: expandable.length > 0 && expandable.every((node) => node.open),
          tableVisible: Boolean(table && table.getBoundingClientRect().height > 0),
          unmarkedOpen: unmarked?.open,
        };
      }
      return removeChild(child);
    };
  });
  await pdf.page.clock.resume();
  const download = pdf.page.waitForEvent("download");
  await pdf.page.getByRole("button", { name: /PDF/ }).click();
  assert.match((await download).suggestedFilename(), /repit-feedback-overall-42\.pdf/);
  const pdfClone = await pdf.page.evaluate(() => window.__behaviorPdfClone);
  assert.deepEqual(pdfClone, { expanded: true, tableVisible: true, unmarkedOpen: false });
  assert.equal(await pdf.section.locator("details[data-pdf-expand]").evaluateAll((nodes) => nodes.every((node) => !node.open)), true);
  await pdf.close(); report("음성 아래 배치·PDF에 접힌 상세 포함·일반 접힘 및 원본 상태 유지");

  if (process.env.BEHAVIOR_SCREENSHOT_DIR) {
    const f = await fixture();
    await f.section.getByText("관찰 완료", { exact: true }).waitFor();
    mkdirSync(process.env.BEHAVIOR_SCREENSHOT_DIR, { recursive: true });
    await f.section.evaluate((node) => {
      let parent = node.parentElement;
      while (parent) {
        parent.style.overflow = "visible";
        parent.style.height = "auto";
        parent.style.maxHeight = "none";
        parent = parent.parentElement;
      }
    });
    await f.section.screenshot({ path: `${process.env.BEHAVIOR_SCREENSHOT_DIR}/behavior-ready.png` });
    await f.section.getByLabel("시간 요약 지표").selectOption("shoulderLevelRatio");
    await f.section.screenshot({ path: `${process.env.BEHAVIOR_SCREENSHOT_DIR}/behavior-shoulders.png` });
    await f.close();
    const narrow = await fixture({ viewport: { width: 320, height: 844 } });
    await narrow.section.getByRole("img", { name: /시간대별 그래프/ }).waitFor();
    assert.ok(await narrow.section.evaluate((node) => node.scrollWidth <= node.clientWidth + 1));
    await narrow.section.evaluate((node) => {
      let parent = node.parentElement;
      while (parent) {
        parent.style.overflow = "visible";
        parent.style.height = "auto";
        parent.style.maxHeight = "none";
        parent = parent.parentElement;
      }
    });
    await narrow.section.screenshot({ path: `${process.env.BEHAVIOR_SCREENSHOT_DIR}/behavior-mobile-320.png` });
    await narrow.close();
  }
  console.log(`${passed} behavior browser scenarios passed`);
} finally { await browser.close(); }
