import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { mkdir } from "node:fs/promises";
const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
const origin = process.env.INTERVIEW_TEST_ORIGIN ?? "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
const companies = [
  { companyId: 12, displayName: "테스트커머스", legalName: "테스트커머스 주식회사", category: "CONSUMER", legalSize: null, talentKeywords: ["고객 관점", "오너십"], dataAsOf: "2026-10-19" },
  { companyId: 13, displayName: "테스트페이", legalName: "테스트페이", category: "FINTECH", legalSize: "MID", talentKeywords: ["신뢰"], dataAsOf: "2026-10-19" },
];
const setupPath = "/main/setting/interview/company";
let passed = 0;
const screenshotDirectory = process.env.COMPANY_SCREENSHOT_DIR;
async function screenshot(page, name) {
  if (!screenshotDirectory) return;
  await mkdir(screenshotDirectory, { recursive: true });
  await page.evaluate(() => document.querySelectorAll("*").forEach((element) => { if (element.scrollTop) element.scrollTop = 0; }));
  await page.screenshot({ path: `${screenshotDirectory}/${name}.png`, fullPage: true });
}
async function scenario(name, callback) {
  if (process.env.COMPANY_TEST_FILTER && !name.includes(process.env.COMPANY_TEST_FILTER)) return;
  try { await callback(); passed++; console.log(`PASS ${name}`); }
  catch (error) { console.error(`FAIL ${name}`); throw error; }
}
async function fixture({ mode = "SOLO", width = 1440, initialList = companies, listFail = false, landing = "company", companyId = null } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const state = { list: initialList, listFail, start404: false, createFailure: null, createAbort: false, createDelay: 0,
    preparation: "PREPARING", chatDelivered: false, lifecycle: "IN_PROGRESS", userId: 7,
    creates: [], personas: [], queries: [], starts: 0, retries: 0, reads: 0, company: null, delayedQueries: false };
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.__socketCount = 0;
    window.WebSocket = class extends EventTarget {
      static OPEN = 1; readyState = 1;
      constructor(url) { super(); if (String(url).includes("/ws/chat/interviews")) window.__socketCount++; }
      send() {} close() { this.readyState = 3; }
    };
    navigator.mediaDevices.getUserMedia = async () => { throw new DOMException("test", "NotAllowedError"); };
  });
  const interview = () => ({ interviewId: 42, userId: state.userId, personaId: mode === "SOLO" ? 1 : null,
    personaIds: mode === "SOLO" ? [1] : state.personas.map((_, index) => index + 1), mode,
    sessionId: "company-session", status: state.lifecycle, company: state.company, createdAt: "2026-10-19T00:00:00" });
  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    if (!path.startsWith("/api/") && !path.startsWith("/chat/")) return route.continue();
    const json = (data, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });
    if (path.endsWith("/refresh")) return json({ accessToken: "test-only-token" });
    if (path.endsWith("/me")) return json({ data: { id: state.userId, name: "테스트", nickname: "테스트" } });
    if (path.endsWith("/profile/latest")) return json({ success: true, data: { status: "COMPLETED", completedAt: "2026-10-19T00:00:00", jobId: "profile" } });
    if (path.endsWith("/getMetaData")) return json({ data: { fileUrl: "/portfolio.pdf", gitUrls: ["https://github.com/example/project"] } });
    if (path === "/api/companies") {
      const q = url.searchParams.get("q"); const category = url.searchParams.get("category");
      state.queries.push({ q, category });
      if (state.delayedQueries) await new Promise((resolve) => setTimeout(resolve, q === "느림" ? 700 : 30));
      if (state.listFail) return json({ message: "테스트 기업 조회 장애" }, 503);
      return json({ data: state.list.filter((company) => (!category || company.category === category) && (!q || company.displayName.includes(q))) });
    }
    if (path === "/api/persona/save") {
      state.personas.push(request.postDataJSON());
      return json({ data: { ...request.postDataJSON(), personaId: state.personas.length } });
    }
    if (path === "/api/interviews/create") {
      state.creates.push({ body: request.postDataJSON(), key: request.headers()["idempotency-key"] });
      state.company = request.postDataJSON().companyId ? { companyId: 12, displayName: "면접 당시 기업명" } : null;
      if (state.createDelay) await new Promise((resolve) => setTimeout(resolve, state.createDelay));
      if (state.createAbort) return route.abort("failed");
      if (state.createFailure) return json({ code: state.createFailure, message: "테스트 생성 오류" }, state.createFailure === "COMPANY_UNAVAILABLE" ? 404 : state.createFailure === "IDEMPOTENCY_KEY_REUSED" ? 409 : 503);
      return json({ data: interview() });
    }
    if (path === "/api/interviews/get") { state.reads++; return json({ data: interview() }); }
    if (path === "/api/interviews/42/preparation/retry") { state.retries++; state.preparation = "READY"; state.chatDelivered = true; return json({ data: {} }); }
    if (path === "/api/interviews/42") { state.starts++; return state.start404 ? json({ message: "포트폴리오 분석을 먼저 진행해주세요" }, 404) : json({ data: { interviewId: 42, sessionId: "company-session" } }); }
    if (path === "/api/questions/tailor") return json({ data: { interviewId: 42, preparationStatus: state.preparation,
      status: state.preparation === "READY" ? "SUCCEEDED" : state.preparation === "FAILED" ? "FAILED" : "PENDING",
      chatDelivered: state.chatDelivered, retryable: true, retryAfterMs: 1000,
      questions: [{ questionId: 101, content: "프로젝트 경험을 설명해주세요.", intention: "경험", personaId: 1, parentId: 0, type: "ORIGINAL" }] } });
    if (path === "/api/interviews/getAll") return json({ data: [{ ...interview(), status: "COMPLETED" }] });
    if (path === "/api/answer/getAll") return json({ success: true, data: [] });
    if (path === "/api/feedbacks/getAll") return json({ data: [] });
    if (path === "/api/feedbacks") return json({ data: { interviewId: 42, status: "SUCCEEDED", totalScore: 75, company: state.company,
      companyFit: { comment: "고객 관점에서 구체적인 근거가 드러났습니다.", matchedFocus: [{ factId: "f1", kind: "TALENT", focus: "고객 관점", evidence: "사용자 경험을 설명했습니다.", questionIds: ["tail-q"] }], gaps: [] },
      feedbacks: [{ questionId: "q2", questionContent: "원질문", userAnswer: "원답변" }, { questionId: "tail-q", questionContent: "실제 꼬리질문", userAnswer: "실제 꼬리답변" }] } });
    if (path.endsWith("/question")) return json({ questionId: 101, content: "프로젝트 경험을 설명해주세요.", intention: "경험", personaId: 1 });
    return json({ data: [] });
  });
  await page.goto(origin);
  await page.getByRole("button", { name: "면접 시작하기", exact: true }).first().waitFor();
  const draftId = await page.evaluate(async ({ mode, landing, companyId }) => {
    const { setAccessToken } = await import("/src/shared/api/accessToken.ts"); setAccessToken("test-only-token");
    const { useUserStore } = await import("/src/shared/store/userStore.ts"); useUserStore.getState().setUser({ id: 7 });
    const { upsertSettingsDraft } = await import("/src/features/interview-page/setting-company/model/draftStore.ts");
    const { MULTI_INTERVIEWER_TEMPLATES: templates } = await import("/src/shared/constants/interview-page/setting-multi-interview/index.ts");
    const settings = mode === "SOLO" ? { mode, difficulty: "보통", personality: "REALISTIC", tone: "DIRECT", interviewerKey: templates[0].key, answerMode: "text" }
      : { mode, difficulty: "어려움", style: "압박", answerMode: "text", slots: templates.slice(0, 3).map((interviewer, index) => ({ interviewer, role: ["TECH", "HR", "PM"][index], personality: "METICULOUS", tone: "PRESSURING" })) };
    let draft = upsertSettingsDraft(settings, null);
    if (companyId) {
      const { saveSetupDraft } = await import("/src/features/interview-page/setting-company/model/draftStore.ts");
      draft = saveSetupDraft({ ...draft, companyId });
    }
    const routerUrl = performance.getEntriesByType("resource").map((entry) => entry.name).find((url) => new URL(url).pathname === "/src/app/router.tsx");
    const { default: router } = await import(routerUrl); window.__router = router;
    const settingsPath = `/main/setting/interview${mode === "MULTI" ? "/multi" : ""}`;
    await router.navigate(`${landing === "company" ? "/main/setting/interview/company" : settingsPath}?draftId=${draft.draftId}`);
    return draft.draftId;
  }, { mode, landing, companyId });
  // 공개 기업이 없으면 기업 선택 화면 없이 바로 준비한다(05-web §3-3). 그때는 선택 화면을 기다리지 않는다.
  if (landing === "company" && (initialList.length > 0 || listFail || companyId)) {
    await page.getByRole("heading", { name: "기업 선택 (선택)" }).waitFor();
    await page.getByText("기업 목록을 불러오고 있어요", { exact: true }).waitFor({ state: "hidden" });
  }
  return { page, context, state, errors, draftId,
    draft: () => page.evaluate((id) => JSON.parse(sessionStorage.getItem(`repit:interview-setup:7:${id}`)), draftId),
    navigate: (path) => page.evaluate(async (path) => { const routerUrl = performance.getEntriesByType("resource").map((entry) => entry.name).find((url) => new URL(url).pathname === "/src/app/router.tsx");
      const { default: router } = await import(routerUrl); await router.navigate(path); }, path) };
}

try {
  await scenario("draft runtime schema, owner, TTL, storage corruption, submission retention and logout", async () => {
    const f = await fixture();
    const result = await f.page.evaluate(async (draftId) => {
      const store = await import("/src/features/interview-page/setting-company/model/draftStore.ts");
      const draft = store.loadSetupDraft(draftId);
      const parse = (value, owner = "7") => store.parseSetupDraft(value, owner);
      const invalid = [null, {}, { ...draft, mode: "INVALID" }, { ...draft, companyId: Number.MAX_SAFE_INTEGER + 1 },
        { ...draft, settings: { ...draft.settings, difficulty: "INVALID" } }, { ...draft, updatedAt: "bad" }];
      const expired = { ...draft, updatedAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString() };
      const pending = { ...expired, submission: { idempotencyKey: crypto.randomUUID(), requestBody: { personaName: "saved", type: "REALISTIC", career: 3, gender: "MALE" }, interviewId: null, state: "UNKNOWN" } };
      const created = { ...pending, submission: { ...pending.submission, interviewId: 42, state: "CREATED" } };
      const checks = [invalid.every((value) => parse(value) === null), parse(draft, "8") === null, parse(expired) === null, !!parse(pending), !!parse(created)];
      const brokenId = crypto.randomUUID(); sessionStorage.setItem(`repit:interview-setup:7:${brokenId}`, "broken");
      checks.push(store.loadSetupDraft(brokenId) === null, sessionStorage.getItem(`repit:interview-setup:7:${brokenId}`) === null);
      sessionStorage.setItem("unrelated", "keep");
      const { useUserStore } = await import("/src/shared/store/userStore.ts"); useUserStore.getState().setUser({ id: 8 });
      checks.push(sessionStorage.getItem(`repit:interview-setup:7:${draftId}`) === null, sessionStorage.getItem("unrelated") === "keep");
      return checks;
    }, f.draftId);
    assert.ok(result.every(Boolean)); await f.context.close();
  });

  for (const mode of ["SOLO", "MULTI"]) for (const selected of [false, true]) {
    await scenario(`${mode} ${selected ? "company" : "general"}: double submit, readiness gate, API snapshot badge`, async () => {
      const f = await fixture({ mode });
      await f.navigate(`/main/setting/interview${mode === "MULTI" ? "/multi" : ""}?draftId=${f.draftId}`);
      await f.page.getByRole("button", { name: "다음: 기업 선택", exact: true }).click();
      await f.page.getByRole("radio", { name: "테스트커머스", exact: true }).waitFor();
      assert.equal(f.state.creates.length, 0);
      if (selected) await f.page.getByRole("radio", { name: "테스트커머스", exact: true }).check();
      if (mode === "SOLO" && selected) await screenshot(f.page, "company-selection-desktop");
      f.state.createDelay = 200;
      const button = f.page.getByRole("button", { name: selected ? "테스트커머스 관점으로 면접 시작" : "기업 없이 면접 시작", exact: true });
      await button.evaluate((button) => { button.click(); button.click(); });
      await f.page.getByText("면접을 준비하고 있어요. 준비가 끝나면 면접 화면으로 이동합니다.").waitFor();
      assert.equal(f.state.creates.length, 1); assert.equal(f.state.personas.length, mode === "SOLO" ? 1 : 3);
      assert.match(f.state.creates[0].key, /^[\da-f-]{36}$/);
      assert.equal(f.state.creates[0].body.companyId, selected ? 12 : undefined);
      assert.equal(await f.page.evaluate(() => window.__socketCount), 0);
      assert.equal((await f.draft()).submission.interviewId, 42);
      await f.page.reload();
      await f.page.getByText("면접을 준비하고 있어요. 준비가 끝나면 면접 화면으로 이동합니다.").waitFor();
      assert.equal(f.state.creates.length, 1);
      f.state.preparation = "READY"; f.state.chatDelivered = false;
      await f.page.waitForTimeout(1100);
      assert.ok(f.page.url().includes(setupPath));
      f.state.chatDelivered = true;
      await f.page.waitForURL(/\/main\/interview\/42/);
      if (selected) await f.page.getByText("면접 당시 기업명 면접을 가정한 연습 면접", { exact: true }).waitFor();
      else assert.equal(await f.page.getByText(/면접을 가정한 연습 면접/).count(), 0);
      assert.deepEqual(f.errors, []);
      await f.context.close();
    });
  }

  await scenario("UNKNOWN survives refresh and replays exactly the same body/key without saving personas again", async () => {
    const f = await fixture(); f.state.createAbort = true;
    await f.page.getByRole("radio", { name: "테스트커머스", exact: true }).check();
    await f.page.getByRole("button", { name: "테스트커머스 관점으로 면접 시작" }).click();
    await f.page.getByRole("button", { name: "같은 요청으로 결과 확인", exact: true }).waitFor();
    assert.equal((await f.draft()).submission.state, "UNKNOWN");
    f.state.createAbort = false;
    await f.page.reload();
    await f.page.getByText("면접을 준비하고 있어요. 준비가 끝나면 면접 화면으로 이동합니다.").waitFor();
    assert.equal(f.state.creates.length, 2); assert.deepEqual(f.state.creates[0], f.state.creates[1]);
    assert.equal(f.state.personas.length, 1); await f.context.close();
  });

  await scenario("selection persists outside filters, on failure, back and refresh; native radio keyboard", async () => {
    const f = await fixture({ width: 390 });
    const radio = f.page.getByRole("radio", { name: "테스트커머스", exact: true });
    await radio.focus(); await radio.press("ArrowRight");
    assert.equal(await f.page.getByRole("radio", { name: "테스트페이", exact: true }).isChecked(), true);
    await radio.focus(); await radio.press("Space");
    await screenshot(f.page, "company-selection-mobile");
    await f.page.getByRole("button", { name: "핀테크", exact: true }).click();
    await f.page.getByRole("radio", { name: "테스트페이", exact: true }).waitFor();
    assert.equal((await f.draft()).companyId, 12);
    await f.page.getByRole("button", { name: "테스트커머스 관점으로 면접 시작", exact: true }).waitFor();
    await f.page.getByRole("button", { name: "설정 수정", exact: true }).click();
    await f.page.getByRole("button", { name: "다음: 기업 선택", exact: true }).waitFor();
    assert.equal(f.state.creates.length, 0);
    await f.page.reload();
    await f.page.getByRole("button", { name: "다음: 기업 선택", exact: true }).click();
    await f.page.getByRole("radio", { name: "테스트커머스", exact: true }).waitFor();
    assert.equal(await f.page.getByRole("radio", { name: "테스트커머스", exact: true }).isChecked(), true);
    f.state.listFail = true;
    await f.page.getByRole("button", { name: "핀테크", exact: true }).click();
    await f.page.getByRole("button", { name: "기업 목록 다시 불러오기", exact: true }).waitFor();
    assert.equal((await f.draft()).companyId, 12);
    await f.page.getByRole("button", { name: "선택 안 함", exact: true }).click();
    await f.page.getByRole("button", { name: "기업 없이 면접 시작", exact: true }).waitFor();
    assert.equal(await f.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await f.page.screenshot({ path: "/tmp/repit-company-mobile.png", fullPage: true });
    assert.deepEqual(f.errors, []); await f.context.close();
  });

  await scenario("filtered empty and failed listing each allow explicit general start", async () => {
    const f = await fixture();
    await f.page.getByRole("searchbox").fill("없는기업");
    await f.page.getByText("검색 결과가 없어요", { exact: true }).waitFor();
    f.state.listFail = true;
    await f.page.getByRole("searchbox").fill("");
    await f.page.getByRole("button", { name: "기업 목록 다시 불러오기", exact: true }).waitFor();
    await f.page.getByRole("button", { name: "기업 없이 면접 시작", exact: true }).click();
    await f.page.getByText("면접을 준비하고 있어요. 준비가 끝나면 면접 화면으로 이동합니다.").waitFor();
    assert.equal(f.state.creates[0].body.companyId, undefined); await f.context.close();
  });

  for (const mode of ["SOLO", "MULTI"]) {
    await scenario(`${mode} zero companies: start label, no picker, single automatic general start`, async () => {
      const f = await fixture({ mode, initialList: [], landing: "settings" });
      await f.page.getByRole("button", { name: "면접 시작", exact: true }).click();
      await f.page.getByText("면접을 준비하고 있어요. 준비가 끝나면 면접 화면으로 이동합니다.").waitFor();
      assert.equal(await f.page.getByRole("heading", { name: "기업 선택 (선택)" }).count(), 0);
      assert.equal(await f.page.getByRole("searchbox").count(), 0);
      assert.equal(await f.page.getByRole("radio").count(), 0);
      assert.equal(f.state.creates.length, 1);
      assert.equal(f.state.creates[0].body.companyId, undefined);
      f.state.preparation = "READY"; f.state.chatDelivered = true;
      await f.page.waitForURL(/\/main\/interview\/42/);
      assert.equal(f.state.creates.length, 1);
      assert.deepEqual(f.errors, []); await f.context.close();
    });
  }

  await scenario("zero companies: UNKNOWN refresh replays the same body/key once without a second automatic start", async () => {
    const f = await fixture({ initialList: [] }); f.state.createAbort = true;
    await f.page.getByRole("button", { name: "같은 요청으로 결과 확인", exact: true }).waitFor();
    assert.equal(f.state.creates.length, 1);
    f.state.createAbort = false;
    await f.page.reload();
    await f.page.getByText("면접을 준비하고 있어요. 준비가 끝나면 면접 화면으로 이동합니다.").waitFor();
    await f.page.waitForTimeout(300);
    assert.equal(f.state.creates.length, 2); assert.deepEqual(f.state.creates[0], f.state.creates[1]);
    assert.equal(await f.page.getByRole("searchbox").count(), 0);
    await f.context.close();
  });

  await scenario("zero companies: missing materials 404 shows the my page link", async () => {
    const f = await fixture({ initialList: [] });
    f.state.preparation = "NOT_REQUESTED"; f.state.start404 = true;
    await f.page.getByText("포트폴리오 분석을 먼저 진행해주세요", { exact: true }).waitFor();
    assert.equal(await f.page.getByRole("link", { name: "마이페이지로 이동", exact: true }).count(), 1);
    await f.context.close();
  });

  await scenario("zero companies: failed listing or a previously chosen company keeps the picker", async () => {
    const failed = await fixture({ initialList: [], listFail: true });
    await failed.page.getByRole("button", { name: "기업 없이 면접 시작", exact: true }).waitFor();
    await failed.page.waitForTimeout(300);
    assert.equal(failed.state.creates.length, 0); await failed.context.close();
    const chosen = await fixture({ initialList: [], companyId: 12 });
    await chosen.page.getByText("현재 등록된 기업이 없습니다. 기업 없이 면접을 시작할 수 있어요.").waitFor();
    await chosen.page.waitForTimeout(300);
    assert.equal(chosen.state.creates.length, 0); await chosen.context.close();
  });

  await scenario("debounce, single character omission and late responses", async () => {
    const f = await fixture(); const search = f.page.getByRole("searchbox");
    assert.equal(await search.getAttribute("maxlength"), "30");
    await search.fill("느림"); f.state.delayedQueries = true;
    await f.page.waitForTimeout(350);
    await search.fill("테스트페이");
    await f.page.getByRole("radio", { name: "테스트페이", exact: true }).waitFor();
    await f.page.waitForTimeout(850);
    assert.equal(await f.page.getByRole("radio", { name: "테스트페이", exact: true }).count(), 1);
    await search.fill("테"); await f.page.waitForTimeout(400);
    assert.equal(f.state.queries.at(-1).q, null);
    assert.ok(!f.state.queries.some((query) => query.q === "테")); await f.context.close();
  });

  for (const code of ["COMPANY_UNAVAILABLE", "COMPANY_CONTEXT_UNAVAILABLE", "IDEMPOTENCY_KEY_REUSED"]) {
    await scenario(`${code} retains selection and follows definitive/unknown rules`, async () => {
      const f = await fixture(); f.state.createFailure = code;
      await f.page.getByRole("radio", { name: "테스트커머스", exact: true }).check();
      await f.page.getByRole("button", { name: "테스트커머스 관점으로 면접 시작" }).click();
      await f.page.getByRole("alert").waitFor();
      assert.equal((await f.draft()).companyId, 12);
      const pending = (await f.draft()).submission;
      assert.equal(pending !== null, code === "IDEMPOTENCY_KEY_REUSED");
      assert.equal(await f.page.getByRole("radio", { name: "테스트커머스", exact: true }).isDisabled(), code === "IDEMPOTENCY_KEY_REUSED");
      assert.equal(f.state.creates.length, 1); await f.context.close();
    });
  }

  await scenario("failed preparation retries existing ID; completed draft never creates again", async () => {
    const f = await fixture(); f.state.preparation = "FAILED";
    await f.page.getByRole("button", { name: "기업 없이 면접 시작", exact: true }).click();
    await f.page.getByRole("button", { name: "면접 준비 다시 시도", exact: true }).waitFor();
    await f.page.reload();
    await f.page.getByRole("button", { name: "면접 준비 다시 시도", exact: true }).click();
    await f.page.waitForURL(/\/main\/interview\/42/);
    assert.equal(f.state.retries, 1); assert.equal(f.state.creates.length, 1);
    f.state.lifecycle = "COMPLETED";
    await f.page.reload();
    await f.page.waitForURL(/feedback\/overall\/42/);
    await f.page.goto(`${origin}${setupPath}?draftId=${f.draftId}`);
    await f.page.waitForURL(/feedback\/overall\/42/);
    assert.equal(f.state.creates.length, 1); await f.context.close();
  });

  await scenario("company feedback link opens actual follow-up question/answer and preserves snapshot name", async () => {
    const f = await fixture(); f.state.company = { companyId: 12, displayName: "면접 당시 기업명" };
    await f.navigate("/main/feedback/overall/42");
    await f.page.getByRole("heading", { name: "면접 당시 기업명 관점으로 돌아보기" }).waitFor().catch(async (error) => { console.error(await f.page.locator("body").innerText(), f.errors); throw error; });
    await screenshot(f.page, "company-feedback");
    const pdf = f.page.waitForEvent("download");
    await f.page.getByRole("button", { name: "PDF로 저장", exact: true }).click();
    assert.match((await pdf).suggestedFilename(), /repit-feedback-overall-42\.pdf/);
    await f.page.getByRole("link", { name: "문항 2 질문·답변 보기", exact: true }).click();
    await f.page.getByText("실제 꼬리답변", { exact: true }).waitFor();
    assert.ok(f.page.url().includes("questionId=tail-q"));
    await f.page.getByRole("heading", { name: "면접 당시 기업명 관점으로 돌아보기" }).waitFor();
    assert.deepEqual(f.errors, []); await f.context.close();
  });

  await scenario("SUBMITTING refresh preserves the fixed submission", async () => {
    const f = await fixture(); f.state.createDelay = 1500;
    await f.page.getByRole("button", { name: "기업 없이 면접 시작", exact: true }).click();
    for (let i = 0; i < 100 && !f.state.creates.length; i++) await f.page.waitForTimeout(20);
    assert.equal((await f.draft()).submission.state, "SUBMITTING");
    f.state.createDelay = 0;
    await f.page.reload();
    await f.page.getByText("면접을 준비하고 있어요. 준비가 끝나면 면접 화면으로 이동합니다.").waitFor();
    assert.equal(f.state.creates.length, 2); assert.deepEqual(f.state.creates[0], f.state.creates[1]);
    assert.equal(f.state.personas.length, 1); await f.context.close();
  });

  await scenario("storage failure prevents POST; missing draft guides setup", async () => {
    const f = await fixture();
    const message = await f.page.evaluate(async (draftId) => {
      const { submitSetupDraft } = await import("/src/features/interview-page/setting-company/model/submitDraft.ts");
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = () => { throw new DOMException("test", "QuotaExceededError"); };
      try { await submitSetupDraft(draftId); return ""; }
      catch (error) { return error.message; }
      finally { Storage.prototype.setItem = original; }
    }, f.draftId);
    assert.match(message, /저장/); assert.equal(f.state.creates.length, 0);
    await f.navigate(`${setupPath}?draftId=broken`);
    await f.page.getByText("설정이 만료되었거나 복구할 수 없습니다. 사전 설정부터 다시 시작해주세요.").waitFor();
    assert.equal(f.state.creates.length, 0); await f.context.close();
  });

  await scenario("hidden company remains selected after rejection; general start needs explicit deselection", async () => {
    const f = await fixture();
    await f.page.getByRole("radio", { name: "테스트커머스", exact: true }).check();
    f.state.list = [companies[1]]; f.state.createFailure = "COMPANY_UNAVAILABLE";
    await f.page.reload();
    await f.page.getByRole("button", { name: "선택한 기업 관점으로 면접 시작", exact: true }).click();
    await f.page.getByRole("alert").waitFor();
    assert.equal((await f.draft()).companyId, 12);
    await f.page.getByRole("button", { name: "선택 안 함", exact: true }).click();
    f.state.createFailure = null;
    await f.page.getByRole("button", { name: "기업 없이 면접 시작", exact: true }).click();
    await f.page.getByText("면접을 준비하고 있어요. 준비가 끝나면 면접 화면으로 이동합니다.").waitFor();
    assert.equal(f.state.creates[1].body.companyId, undefined);
    assert.notEqual(f.state.creates[0].key, f.state.creates[1].key); await f.context.close();
  });

  await scenario("company-free feedback hides the company section", async () => {
    const f = await fixture(); await f.navigate("/main/feedback/overall/42");
    await f.page.getByRole("heading", { name: "종합 점수", exact: true }).waitFor();
    assert.equal(await f.page.getByRole("region", { name: "기업 관점 코멘트" }).count(), 0);
    await f.context.close();
  });
} finally { await browser.close(); }
console.log(`${passed} company setup browser scenarios passed`);
