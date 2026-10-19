import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
const origin = process.env.INTERVIEW_TEST_ORIGIN ?? "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
let passed = 0;
const report = (label) => { passed++; console.log(`PASS ${label}`); };
const profile = (status, failureReason = null) => ({
  status, failureReason, jobId: "profile-job", errorMessage: null, errorStatusCode: null,
  completedAt: status === "COMPLETED" ? "2026-10-12T10:00:00Z" : null, projectSummary: null,
});
const question = { questionId: 101, parentId: 0, type: "ORIGINAL", intention: "경험", content: "프로젝트 경험을 설명해주세요.", personaId: 1 };
const preparation = (preparationStatus, extra = {}) => ({
  status: preparationStatus === "READY" ? "SUCCEEDED" : "WAITING", preparationStatus,
  chatDelivered: false, interviewId: 42, questions: preparationStatus === "READY" ? [question] : [],
  retryAfterMs: null, retryable: false, ...extra,
});

async function fixture(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const state = {
    profile: profile("COMPLETED"), profileError: false, materials: true, materialsError: false, holdProfile: false, holdSave: false,
    preparation: preparation("READY"), retryError: false, start404: false, ...options,
    profileReads: 0, uploads: 0, savedPayloads: [], retries: 0, analysisRequests: 0, personaCount: 0, preparationReads: [],
  };
  const releases = [];
  await page.addInitScript(({ shortTimeout }) => {
    window.__mediaRequests = 0;
    navigator.mediaDevices.getUserMedia = async () => { window.__mediaRequests++; throw new DOMException("test", "NotAllowedError"); };
    window.WebSocket = class extends EventTarget {
      static OPEN = 1;
      readyState = 1;
      send() {}
      close() { this.readyState = 3; }
    };
    const interval = window.setInterval.bind(window);
    window.setInterval = (callback, delay, ...args) => interval(callback, delay === 5_000 ? 100 : delay, ...args);
    if (shortTimeout) {
      const timeout = window.setTimeout.bind(window);
      window.setTimeout = (callback, delay, ...args) => timeout(callback, delay === 20 * 60_000 ? 200 : delay, ...args);
    }
  }, { shortTimeout: options.shortTimeout });
  await page.route("**/*", async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (!pathname.startsWith("/api/") && !pathname.startsWith("/chat/")) return route.continue();
    const json = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (pathname.endsWith("/profile/latest")) {
      state.profileReads++;
      if (state.holdProfile) await new Promise((resolve) => releases.push(resolve));
      return state.profileError ? json({ message: "테스트 상태 조회 실패" }, 503) : json({ success: true, data: state.profile });
    }
    if (pathname.endsWith("/metaData/materials") && request.method() === "PUT") {
      assert.match(request.headers()["content-type"], /multipart\/form-data; boundary=/);
      assert.match(request.headers().authorization, /^Bearer /);
      const payload = JSON.parse(/(\{"jobRole".*)\r\n/.exec(request.postDataBuffer().toString("utf8"))[1]);
      state.uploads++;
      state.savedPayloads.push(payload);
      if (state.holdSave) await new Promise((resolve) => releases.push(resolve));
      state.profileError = false;
      state.profile = profile("PENDING");
      return json({
        materials: {
          jobRole: payload.jobRole,
          documents: payload.documents.map((document, index) => ({
            index, type: document.type, fileUrl: document.fileUrl ?? `/uploaded-${index}.pdf`, fileName: `document-${index}.pdf`, pageCount: 1,
          })),
          gitUrls: payload.gitUrls,
          supplements: payload.supplements,
        },
        analysis: { jobId: "profile-job", status: "accepted" },
      });
    }
    if (pathname.endsWith("/metaData/materials")) return state.materialsError ? json({ message: "테스트 자료 조회 실패" }, 503) : json({
      jobRole: "FRONTEND",
      documents: state.materials ? [{ index: 0, type: "PORTFOLIO", fileUrl: "/portfolio.pdf", fileName: "portfolio.pdf", pageCount: 1 }] : [],
      gitUrls: state.materials ? ["https://github.com/example/project"] : [],
      supplements: [],
    });
    if (pathname.endsWith("/dataUpload")) {
      assert.match(request.headers()["content-type"], /multipart\/form-data; boundary=/);
      assert.match(request.headers().authorization, /^Bearer /);
      state.uploads++;
      state.profileError = false;
      state.profile = profile("PENDING");
      return json({ jobId: "profile-job" });
    }
    if (pathname.endsWith("/ai/generate")) {
      state.analysisRequests++;
      state.profile = profile("PENDING");
      return json({ success: true, data: { jobId: "profile-job" } });
    }
    if (pathname === "/api/questions/tailor") {
      state.preparationReads.push(Date.now());
      return json({ data: state.preparation });
    }
    if (pathname.endsWith("/preparation/retry")) {
      state.retries++;
      if (state.retryError) return json({ message: "테스트 재시도 요청 실패" }, 503);
      state.preparation = preparation("READY");
      return json({ success: true });
    }
    if (pathname === "/api/persona/save") return json({ data: { personaId: ++state.personaCount } });
    if (pathname === "/api/interviews/create") return json({ data: {
      interviewId: 42, sessionId: "test-session", userId: 7, personaId: 1, personaIds: request.postDataJSON().personaIds ?? [1],
      mode: request.postDataJSON().personaIds ? "MULTI" : "SOLO", status: "IN_PROGRESS",
    } });
    if (pathname === "/api/interviews/42") return state.start404 ? json({ message: "포트폴리오 분석을 먼저 진행해주세요" }, 404) : json({ data: { interviewId: 42, sessionId: "test-session" } });
    if (pathname.endsWith("/question")) return json(question);
    if (pathname.endsWith("/me")) return json({ data: { id: 7, name: "테스트", nickname: "테스트", email: "test@example.com" } });
    if (pathname.endsWith("/refresh")) return json({ accessToken: "test-only-token" });
    return json({ data: [] });
  });
  await page.goto(origin);
  await page.getByRole("button", { name: "면접 시작하기", exact: true }).first().waitFor();
  await page.evaluate(async () => {
    (await import("/src/shared/api/accessToken.ts")).setAccessToken("test-only-token");
    const url = performance.getEntriesByType("resource").map((entry) => entry.name).find((url) => new URL(url).pathname === "/src/app/router.tsx");
    window.__router = (await import(url)).default;
  });
  const navigate = (path) => page.evaluate((path) => window.__router.navigate(path), path);
  const interview = () => page.evaluate(() => window.__router.navigate("/main/interview/42", { state: { preparedInterview: {
    sessionId: "test-session", interviewId: 42, userId: 7, personaId: 1, personaName: "테스트", role: "TECH", major: "FRONTEND",
    type: "FRIENDLY", personaType: "FRIENDLY", level: "EASY", career: 0, gender: "FEMALE", tone: "GENTLE", jobId: "test-job",
    status: "IN_PROGRESS", currentQuestionIndex: 0, questions: [], mode: "SOLO", answerMode: "text", questionPreparationStatus: "WAITING",
  } } }));
  const close = async () => {
    state.holdProfile = false;
    releases.splice(0).forEach((resolve) => resolve());
    assert.deepEqual(errors, []);
    await context.close();
  };
  return { page, state, navigate, interview, close, release: () => { state.holdProfile = false; state.holdSave = false; releases.splice(0).forEach((resolve) => resolve()); } };
}
const saveButton = (page) => page.getByRole("button", { name: "저장하고 분석하기", exact: true });
async function addGitUrl(page, url = "https://github.com/example/new-project") {
  await page.getByRole("textbox", { name: "GitHub", exact: true }).fill(url);
  await page.getByRole("button", { name: "Git 주소 추가", exact: true }).click();
}
const fillPortfolio = (page) => addGitUrl(page);
async function expectEnabled(locator, enabled) {
  await locator.waitFor();
  await locator.page().waitForFunction(({ selector, enabled }) => {
    const buttons = [...document.querySelectorAll("button")].filter((button) => button.textContent.trim() === selector);
    return buttons.some((button) => !button.disabled === enabled);
  }, { selector: await locator.innerText(), enabled });
  assert.equal(await locator.isEnabled(), enabled);
}
try {
  const failed = await fixture({ profileError: true, holdProfile: true });
  await failed.navigate("/main/mypage");
  await failed.page.getByText("분석 상태를 확인하고 있어요", { exact: true }).waitFor();
  assert.equal(await saveButton(failed.page).isDisabled(), true);
  failed.release();
  await failed.page.getByText("테스트 상태 조회 실패", { exact: true }).waitFor();
  await expectEnabled(saveButton(failed.page), true);
  await fillPortfolio(failed.page);
  await saveButton(failed.page).click();
  await failed.page.getByText("자료를 분석하고 있어요. 잠시만 기다려 주세요", { exact: true }).waitFor();
  assert.equal(failed.state.uploads, 1);
  assert.equal(await failed.page.getByRole("button", { name: "분석 중…", exact: true }).isDisabled(), true);
  failed.state.profile = profile("COMPLETED");
  await failed.page.getByText("자료 분석이 완료됐어요. 면접을 시작할 수 있어요", { exact: true }).waitFor();
  await expectEnabled(saveButton(failed.page), true);
  assert.equal(await failed.page.getByText("테스트 상태 조회 실패", { exact: true }).count(), 0);
  await failed.page.screenshot({ path: "/tmp/repit-profile-recovered.png", fullPage: true });
  await failed.close();
  report("initial loading blocks save; query failure permits authenticated upload and analysis recovery");

  const completed = await fixture();
  await completed.navigate("/main/mypage");
  await completed.page.getByText("자료 분석이 완료됐어요. 면접을 시작할 수 있어요", { exact: true }).waitFor();
  await fillPortfolio(completed.page);
  await saveButton(completed.page).click();
  await completed.page.getByRole("dialog").waitFor();
  assert.equal(completed.state.uploads, 0);
  await completed.page.getByRole("dialog").getByRole("button", { name: "취소", exact: true }).click();
  assert.equal(completed.state.uploads, 0);
  await saveButton(completed.page).click();
  await completed.page.getByRole("button", { name: "변경하고 분석하기", exact: true }).click();
  await completed.page.getByRole("button", { name: "분석 중…", exact: true }).waitFor();
  assert.equal(completed.state.uploads, 1);
  const reads = completed.state.profileReads;
  completed.state.profileError = true;
  await completed.page.getByText("테스트 상태 조회 실패", { exact: true }).waitFor();
  assert.ok(completed.state.profileReads > reads);
  assert.equal(await completed.page.getByRole("button", { name: "분석 중…", exact: true }).isDisabled(), true);
  await completed.close();
  report("completed material changes require confirmation; known PENDING stays blocked on polling errors");

  const loadFailed = await fixture({ materialsError: true });
  await loadFailed.navigate("/main/mypage");
  await loadFailed.page.getByText("저장된 자료를 불러오지 못했어요. 다시 불러와야 저장할 수 있어요", { exact: true }).waitFor();
  await loadFailed.page.getByText("자료 분석이 완료됐어요. 면접을 시작할 수 있어요", { exact: true }).waitFor();
  await loadFailed.page.getByRole("combobox", { name: "세부 직무", exact: true }).selectOption("FRONTEND");
  await addGitUrl(loadFailed.page);
  assert.equal(await saveButton(loadFailed.page).isDisabled(), true);
  loadFailed.state.materialsError = false;
  await loadFailed.page.getByRole("button", { name: "다시 불러오기", exact: true }).click();
  await loadFailed.page.getByText("https://github.com/example/project", { exact: true }).waitFor();
  assert.equal(await loadFailed.page.getByText("https://github.com/example/new-project", { exact: true }).count(), 0);
  assert.equal(await loadFailed.page.getByText("portfolio.pdf", { exact: true }).count(), 1);
  await expectEnabled(saveButton(loadFailed.page), true);
  assert.equal(loadFailed.state.uploads, 0);
  await loadFailed.close();
  report("materials load failure blocks whole-set save until saved materials reload");

  const slowSave = await fixture({ profile: profile("NONE"), holdSave: true });
  await slowSave.navigate("/main/mypage");
  await slowSave.page.getByText("https://github.com/example/project", { exact: true }).waitFor();
  await addGitUrl(slowSave.page);
  await saveButton(slowSave.page).click();
  await slowSave.page.getByRole("button", { name: "저장 중...", exact: true }).waitFor();
  await addGitUrl(slowSave.page, "https://github.com/example/during-save");
  slowSave.release();
  await slowSave.page.getByText("저장했어요. 자료 분석을 시작해요", { exact: true }).waitFor();
  assert.deepEqual(slowSave.state.savedPayloads[0].gitUrls, ["https://github.com/example/project", "https://github.com/example/new-project"]);
  assert.equal(await slowSave.page.getByText("https://github.com/example/during-save", { exact: true }).count(), 1);
  assert.equal(await slowSave.page.getByLabel("나의 면접 자료").getByRole("button", { name: "취소", exact: true }).isEnabled(), true);
  await slowSave.close();
  report("edits made while saving stay on screen after the save response");

  for (const [reason, action] of [["REPO_NOT_PUBLIC", "다시 분석"], ["INVALID_MATERIAL", "파일 교체"], ["INSUFFICIENT_EVIDENCE", "자료 보강"], ["INTERNAL", "다시 분석"]]) {
    const f = await fixture({ profile: profile("FAILED", reason) });
    await f.navigate("/main/mypage");
    await f.page.getByRole("button", { name: action, exact: true }).waitFor();
    await expectEnabled(saveButton(f.page), true);
    if (reason === "INTERNAL") {
      await f.page.getByRole("button", { name: action, exact: true }).click();
      await f.page.getByText("자료를 분석하고 있어요. 잠시만 기다려 주세요", { exact: true }).waitFor();
      assert.equal(f.state.analysisRequests, 1);
    }
    await f.close();
    report(`analysis failure recovery action: ${reason}`);
  }

  for (const path of ["/main/setting/interview", "/main/setting/interview/multi"]) {
    for (const [status, materials, allowed] of [["COMPLETED", false, true], ["NONE", true, true], ["NONE", false, false], ["PENDING", true, false], ["FAILED", true, false], ["ERROR", true, false]]) {
      const f = await fixture({ profile: profile(status === "ERROR" ? "COMPLETED" : status, status === "FAILED" ? "INTERNAL" : null), profileError: status === "ERROR", materials });
      await f.navigate(path);
      const next = f.page.getByRole("button", { name: status === "PENDING" ? /^분석 중/ : "다음", exact: status !== "PENDING" });
      const guidance = status === "ERROR" ? "테스트 상태 조회 실패" : status === "NONE" ? materials ? "첫 면접은 준비에 몇 분 걸릴 수 있어요" : "마이페이지에서 자료를 등록해 주세요" : status === "PENDING" ? "자료 분석이 끝나면 시작할 수 있어요" : status === "FAILED" ? "분석 중 문제가 생겼어요" : null;
      if (guidance) await f.page.getByText(guidance, { exact: true }).waitFor();
      await expectEnabled(next, allowed);
      if (status === "FAILED" || (status === "NONE" && !materials)) assert.equal(await f.page.getByRole("link", { name: "마이페이지로 이동", exact: true }).count(), 1);
      if (status === "ERROR") {
        f.state.profileError = false;
        await f.page.getByRole("button", { name: "상태 다시 확인", exact: true }).click();
        await expectEnabled(next, true);
      }
      await f.close();
      report(`${path}: ${status}, materials=${materials}, start=${allowed}`);
    }
  }

  for (const path of ["/main/setting/interview", "/main/setting/interview/multi"]) {
    const f = await fixture({ start404: true });
    await f.navigate(path);
    const next = f.page.getByRole("button", { name: "다음", exact: true });
    await expectEnabled(next, true);
    if (path.endsWith("multi")) {
      for (const [index, name] of ["김도윤", "이서준", "박지민"].entries()) {
        await f.page.getByRole("button", { name: `면접관 ${index + 1} 설정`, exact: true }).click();
        await f.page.getByRole("group", { name: "면접관 선택", exact: true }).getByRole("button", { name, exact: true }).click();
        if (index > 0) await f.page.getByRole("group", { name: "역할", exact: true }).getByRole("button", { name: index === 1 ? "HR" : "Design", exact: true }).click();
      }
    }
    await next.click();
    // 사전설정 다음에 기업 선택 단계가 있고, 면접 생성은 거기서 "면접 시작"으로 한다.
    await f.page.getByRole("button", { name: "면접 시작", exact: true }).click();
    await f.page.getByText("포트폴리오 분석을 먼저 진행해주세요", { exact: true }).waitFor();
    assert.equal(await f.page.getByRole("link", { name: "마이페이지로 이동", exact: true }).count(), 1);
    await f.close();
    report(`${path}: start 404 links to materials`);
  }

  const waiting = await fixture({ preparation: preparation("PREPARING", { chatDelivered: true, retryAfterMs: 4_500 }) });
  await waiting.interview();
  await waiting.page.getByText("새 질문을 준비하고 있어요. 길게는 몇 분 걸릴 수 있어요", { exact: true }).waitFor();
  assert.equal(await waiting.page.getByRole("textbox").count(), 0);
  waiting.state.preparation = preparation("READY");
  await waiting.page.getByRole("textbox").first().waitFor();
  assert.ok(waiting.state.preparationReads[1] - waiting.state.preparationReads[0] >= 4_300, "server polling delay is respected");
  assert.equal(await waiting.page.evaluate(() => window.__mediaRequests), 0);
  await waiting.close();
  report("WAITING stays in preparation even if chatDelivered; retryAfterMs delays poll; READY starts text interview");

  const retry = await fixture({ preparation: preparation("FAILED", { status: "FAILED", retryable: true, failureStage: "CHAT_DELIVERY" }), retryError: true });
  await retry.interview();
  await retry.page.getByText("채팅 면접을 준비하지 못했습니다.", { exact: true }).waitFor();
  await retry.page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await retry.page.getByText("테스트 재시도 요청 실패", { exact: true }).waitFor();
  retry.state.retryError = false;
  await retry.page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await retry.page.getByRole("textbox").first().waitFor();
  assert.equal(retry.state.retries, 2);
  await retry.close();
  report("retryable failure preserves retry on request error then resumes preparation successfully");

  const noRetry = await fixture({ preparation: preparation("FAILED", { status: "FAILED", failureStage: "QUESTION_GENERATION" }) });
  await noRetry.interview();
  await noRetry.page.getByText("면접 질문 준비에 실패했습니다.", { exact: true }).waitFor();
  assert.equal(await noRetry.page.getByRole("button", { name: "다시 시도", exact: true }).count(), 0);
  await noRetry.close();
  report("non-retryable preparation failure has no retry button");

  const timeout = await fixture({ preparation: preparation("PREPARING"), shortTimeout: true });
  await timeout.interview();
  await timeout.page.getByText("면접 준비 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.", { exact: true }).waitFor();
  assert.equal(await timeout.page.getByRole("button", { name: "다시 시도", exact: true }).count(), 0);
  await timeout.close();
  report("20-minute safety timeout terminates preparation");

  const cleanup = await fixture({ preparation: preparation("PREPARING") });
  await cleanup.interview();
  await cleanup.page.getByText("새 질문을 준비하고 있어요. 길게는 몇 분 걸릴 수 있어요", { exact: true }).waitFor();
  await cleanup.navigate("/main");
  await cleanup.page.waitForURL("**/main");
  const preparationReads = cleanup.state.preparationReads.length;
  await cleanup.page.waitForTimeout(3_200);
  assert.equal(cleanup.state.preparationReads.length, preparationReads);
  await cleanup.close();
  report("leaving preparation cancels its polling timer");
  console.log(`${passed} profile/preparation scenarios passed`);
} finally { await browser.close(); }
