import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH ? pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href : "playwright");
const browser = await chromium.launch({ headless: true });
const origin = process.env.INTERVIEW_TEST_ORIGIN ?? "http://127.0.0.1:5197";
let passed = 0;
const report = (text) => { passed++; console.log(`PASS ${text}`); };
const empty = { jobRole: null, documents: [], gitUrls: [], supplements: [], jobTitle: null, coverLetters: [] };
async function fixture(materials = empty, width = 1440) {
  const context = await browser.newContext({ viewport: { width, height: 1100 } });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const state = { materials, saved: [], error: null };
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/**", (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (!path.startsWith("/api/")) return route.continue();
    const json = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (path.endsWith("/metaData/materials")) {
      if (request.method() === "GET") return json(state.materials);
      const payload = JSON.parse(/(\{"jobRole".*)\r\n/.exec(request.postDataBuffer().toString("utf8"))[1]);
      state.saved.push(payload);
      if (state.error) return json({ errors: state.error }, 422);
      state.materials = { ...payload, documents: payload.documents.map((row, index) => ({ ...row, index, fileUrl: row.fileUrl ?? `/new-${index}.pdf`, fileName: "test.pdf", pageCount: 1 })) };
      return json({ materials: state.materials, analysis: null });
    }
    if (path.endsWith("/profile/latest")) return json({ success: true, data: { status: "NONE", jobId: null, failureReason: null, completedAt: null } });
    if (path.endsWith("/refresh")) return json({ accessToken: "fixture-only" });
    if (path.endsWith("/me")) return json({ data: { id: 7, name: "테스트", nickname: "테스트", email: "test@example.com" } });
    return json({ data: [] });
  });
  await page.goto(origin);
  await page.waitForFunction(() => performance.getEntriesByType("resource").some((entry) => new URL(entry.name).pathname === "/src/app/router.tsx"));
  await page.evaluate(async () => {
    (await import("/src/shared/api/accessToken.ts")).setAccessToken("fixture-only");
    const url = performance.getEntriesByType("resource").map((entry) => entry.name).find((url) => new URL(url).pathname === "/src/app/router.tsx");
    window.__router = (await import(url)).default;
    await window.__router.navigate("/main/mypage");
  });
  await page.getByRole("radio", { name: "IT 외 일반", exact: true }).waitFor();
  return { page, state, close: async () => { assert.deepEqual(errors, []); await context.close(); } };
}
const save = (page) => page.getByLabel("나의 면접 자료").getByRole("button", { name: "저장", exact: true });
const card = (page, n = 1) => page.getByLabel(`자소서 문항 ${n}`, { exact: true });
async function selectGeneral(page) {
  await page.getByText("IT 외 일반", { exact: true }).click();
  await page.getByRole("combobox", { name: "대분류", exact: true }).selectOption("GEN_MARKETING");
  await page.getByRole("textbox", { name: "직무명", exact: true }).fill("퍼포먼스 마케터");
}
try {
  const f = await fixture(); const p = f.page;
  await selectGeneral(p);
  assert.equal(await p.getByRole("textbox", { name: "GitHub", exact: true }).count(), 0);
  assert.equal(await p.getByText("보완 입력", { exact: true }).count(), 0);
  assert.deepEqual(await p.getByRole("combobox", { name: "1번 문서 종류" }).locator("option").allTextContents(), ["선택", "이력서", "경력기술서", "포트폴리오", "업무 산출물"]);
  await save(p).click(); await p.getByText(/이력서 외에 경력기술서/).waitFor(); assert.equal(f.state.saved.length, 0);
  report("general family displays four documents and cover letters, no GitHub or supplements; empty save rejected");
  await card(p).getByRole("button", { name: "예시 문항", exact: true }).click();
  await p.getByRole("listbox").waitFor(); await p.keyboard.press("Escape");
  assert.equal(await card(p).getByRole("textbox", { name: "문항", exact: true }).evaluate((el) => el === document.activeElement), true);
  await card(p).getByRole("button", { name: "예시 문항", exact: true }).click();
  await p.getByRole("option", { name: /실패와 극복 경험/ }).click();
  assert.equal(await card(p).getByRole("textbox", { name: "답", exact: true }).evaluate((el) => el === document.activeElement), true);
  await card(p).getByRole("textbox", { name: "답", exact: true }).fill("실패 원인을 분석하고 다시 검증했습니다.");
  await save(p).click(); await p.getByText("변경된 내용이 없어요", { exact: true }).waitFor();
  assert.equal(f.state.saved[0].documents.length, 0); assert.equal(f.state.saved[0].coverLetters.length, 1); assert.equal(f.state.saved[0].jobTitle, "퍼포먼스 마케터");
  report("example menu Escape/selection/focus and cover-letter-only payload");
  await p.reload(); await p.getByRole("textbox", { name: "직무명", exact: true }).waitFor();
  assert.equal(await p.getByRole("textbox", { name: "직무명", exact: true }).inputValue(), "퍼포먼스 마케터");
  const q = card(p).getByRole("textbox", { name: "문항", exact: true });
  await q.fill("한글 조합 입력"); assert.equal(await card(p).getByRole("button", { name: "예시 문항", exact: true }).count(), 0);
  await p.getByRole("textbox", { name: "직무명", exact: true }).fill("브랜드 마케터");
  await p.getByText("직무명을 바꿔도 자료는 그대로예요. 저장하면 새 직무명으로 다시 분석해요.").waitFor();
  for (let i = 0; i < 4; i++) await p.getByRole("button", { name: "+ 문항 추가", exact: true }).click();
  assert.equal(await p.getByRole("button", { name: "+ 문항 추가", exact: true }).isDisabled(), true);
  await card(p, 2).getByRole("textbox", { name: "문항", exact: true }).fill("두번째 문항");
  await card(p, 2).getByRole("textbox", { name: "답", exact: true }).fill("두번째 답변");
  f.state.error = [{ field: "coverLetters[1]", reason: "COVER_LETTER_INVALID", detail: null }];
  await save(p).click(); await card(p, 2).getByText("문항과 답을 모두 입력해 주세요", { exact: true }).waitFor();
  report("reload, Korean editing, title retention, max five cards and indexed server errors");
  await p.getByRole("combobox", { name: "대분류", exact: true }).selectOption("GEN_HR_ADMIN");
  await p.getByRole("dialog").waitFor(); await p.getByRole("button", { name: "취소", exact: true }).click();
  assert.equal(await p.getByRole("combobox", { name: "대분류", exact: true }).inputValue(), "GEN_MARKETING");
  await p.getByRole("combobox", { name: "대분류", exact: true }).selectOption("GEN_HR_ADMIN");
  await p.getByRole("dialog").getByRole("button").last().click();
  assert.equal(await p.getByRole("textbox", { name: "직무명", exact: true }).inputValue(), "");
  assert.equal(await card(p).getByRole("textbox", { name: "답", exact: true }).inputValue(), "");
  await f.close(); report("family change cancel preserves drafts and confirmation clears title and cover letters");
  const m = await fixture(empty, 400); await selectGeneral(m.page);
  await card(m.page).getByRole("button", { name: "예시 문항", exact: true }).click();
  await m.page.getByRole("listbox").waitFor();
  assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await m.page.screenshot({ path: "/tmp/general-job-mobile.png", fullPage: true });
  await m.close(); report("mobile 400px has no horizontal overflow with example menu");
  const it = await fixture({ ...empty, jobRole: "QA_ENGINEER", documents: [{ index: 0, type: "TEST_PLAN", fileUrl: "/test.pdf", fileName: "test.pdf", pageCount: 1 }] });
  await it.page.getByRole("textbox", { name: "GitHub", exact: true }).waitFor();
  assert.equal(await it.page.getByText("보완 입력", { exact: true }).count(), 0);
  await save(it.page).click(); await it.page.getByText("변경된 내용이 없어요", { exact: true }).waitFor();
  assert.equal(it.state.saved[0].jobTitle, null); assert.deepEqual(it.state.saved[0].coverLetters, []);
  await it.close(); report("N1 QA has optional GitHub/no supplements; IT sends null title and empty cover letters");
  const resume = await fixture({ ...empty, jobRole: "GEN_MARKETING", jobTitle: "마케터", documents: [{ index: 0, type: "RESUME", fileUrl: "/resume.pdf", fileName: "resume.pdf", pageCount: 1 }] });
  await save(resume.page).click(); await resume.page.getByText(/이력서 외에 경력기술서/).waitFor();
  assert.equal(resume.state.saved.length, 0);
  await card(resume.page).getByRole("textbox", { name: "문항", exact: true }).fill("지원 동기");
  await save(resume.page).click(); await card(resume.page).getByText("문항과 답을 모두 입력해 주세요", { exact: true }).waitFor();
  await resume.close(); report("resume-only and incomplete cover-letter saves are rejected");
  const noMaterial = await fixture(); await selectGeneral(noMaterial.page);
  await noMaterial.page.getByRole("textbox", { name: "직무명", exact: true }).fill("유지할 직무명");
  await noMaterial.page.getByRole("combobox", { name: "대분류", exact: true }).selectOption("GEN_HR_ADMIN");
  assert.equal(await noMaterial.page.getByRole("dialog").count(), 0);
  assert.equal(await noMaterial.page.getByRole("textbox", { name: "직무명", exact: true }).inputValue(), "유지할 직무명");
  await card(noMaterial.page).getByRole("button", { name: "예시 문항", exact: true }).click();
  await noMaterial.page.getByRole("textbox", { name: "직무명", exact: true }).click();
  assert.equal(await noMaterial.page.getByRole("listbox").count(), 0);
  await noMaterial.close(); report("empty general category changes retain title without confirmation; outside click closes menu");
  for (const hasCoverLetter of [false, true]) {
    const eligible = await fixture({ ...empty, jobRole: "GEN_MARKETING", jobTitle: "마케터", coverLetters: hasCoverLetter ? [{ question: "지원 동기", answer: "지원 경험" }] : [] });
    for (const path of ["/main/setting/interview", "/main/setting/interview/multi"]) {
      await eligible.page.evaluate((path) => window.__router.navigate(path), path);
      const next = eligible.page.getByRole("button", { name: "다음: 기업 선택", exact: true });
      await next.waitFor();
      if (hasCoverLetter) await eligible.page.getByText("첫 면접은 준비에 몇 분 걸릴 수 있어요", { exact: true }).waitFor();
      else await eligible.page.getByText("이력서 외 자료나 자소서를 1개 이상 등록해야 면접을 시작할 수 있어요", { exact: true }).waitFor();
      assert.equal(await next.isEnabled(), hasCoverLetter);
    }
    await eligible.close(); report(`general SOLO/MULTI eligibility with cover-letter=${hasCoverLetter}`);
  }
  console.log(`${passed} general-job browser scenarios passed`);
} finally { await browser.close(); }
