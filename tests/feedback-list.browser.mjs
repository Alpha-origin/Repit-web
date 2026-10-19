import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
const origin = process.env.INTERVIEW_TEST_ORIGIN ?? "http://127.0.0.1:5173";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE_PATH ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH } : {}),
});
let passed = 0;
const report = (label) => { passed++; console.log(`PASS ${label}`); };

const solo56 = {
  id: 56, mode: "SOLO", status: "COMPLETED", personaId: 56, createdAt: "2026-10-19T03:10:00Z", sessionId: "s56",
  persona: { id: 56, personaName: "김도윤-4898e87d-1c2b-4d5e-8f90-a1b2c3d4e5f6", personaRole: "TECH", type: "FRIENDLY", level: "EASY", tone: "SOFT" },
};
const listInterviews = [
  solo56,
  { id: 55, mode: "SOLO", status: "COMPLETED", personaId: 55, createdAt: "2026-10-19T01:00:00Z", sessionId: "s55",
    persona: { id: 55, personaName: "박서연-0b1c2d3e-4f50-6172-8394-a5b6c7d8e9f0", type: "METICULOUS", level: "HARD" } },
  { id: 54, mode: "MULTI", status: "COMPLETED", personaIds: [1, 2, 3], createdAt: "2026-10-18T05:00:00Z", sessionId: "s54",
    persona: { id: 1, personaName: "TECH-0b1c2d3e-4f50-6172-8394-a5b6c7d8e9f0", type: "REALISTIC", level: "NORMAL" } },
  { id: 53, mode: "SOLO", status: "ABANDONED", personaId: 53, createdAt: "2026-10-17T05:00:00Z" },
];
const listFeedbacks = [
  { interviewId: 56, sessionId: "s56", status: "SUCCEEDED", style: "FRIENDLY", level: "EASY", totalScore: 89 },
  { interviewId: 54, sessionId: "s54", status: "SUCCEEDED", style: "REALISTIC", level: "NORMAL", totalScore: 95 },
];

async function open(path) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(8_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (!pathname.startsWith("/api/")) return route.continue();
    const json = (body, code = 200) => route.fulfill({ status: code, contentType: "application/json", body: JSON.stringify(body) });
    if (pathname.endsWith("/refresh")) return json({ accessToken: "test-only-token" });
    if (pathname.endsWith("/me")) return json({ data: { id: 7, name: "테스트", nickname: "테스트", email: "test@example.com" } });
    if (pathname === "/api/interviews/getAll") return json({ success: true, data: listInterviews });
    if (pathname === "/api/feedbacks/getAll") return json({ success: true, data: listFeedbacks });
    if (pathname === "/api/answer/getAll") return json({ success: true, data: [] });
    if (pathname === "/api/feedbacks") return json({ success: true, data: { ...listFeedbacks[0], feedbacks: [] } });
    return json({ success: true, data: [] });
  });
  await page.goto(`${origin}${path}`);
  return { page, close: async () => { assert.deepEqual(errors, []); await context.close(); } };
}

const cardOrder = async (page) => {
  await page.locator("button img[alt$=' 이미지']").first().waitFor();
  return page.evaluate(() => [...document.querySelectorAll("button img[alt$=' 이미지']")].map((img) => img.alt.replace(/ 이미지$/, "")));
};

// 2-5 + 2-6 목록
{
  const f = await open("/main/feedback/list");
  assert.deepEqual(await cardOrder(f.page), ["김도윤", "박서연", "면접관 3명", "면접관 1명"]);
  const card56 = f.page.locator("button", { hasText: "김도윤" }).first();
  for (const label of ["친근한", "쉬움", "89점"]) await card56.getByText(label, { exact: true }).first().waitFor();
  const card55 = f.page.locator("button", { hasText: "박서연" }).first();
  for (const label of ["꼼꼼한", "어려움"]) await card55.getByText(label, { exact: true }).first().waitFor();
  assert.equal(await f.page.locator("button", { hasText: "TECH-" }).count(), 0);
  await f.page.getByText("중단됨", { exact: true }).waitFor();
  assert.equal(new URL(f.page.url()).search, "");
  assert.equal(await f.page.getByRole("button", { name: "정렬 방향" }).innerText(), "최신순");
  report("list: default latest, no query, 친근한/쉬움, 김도윤 without suffix, MULTI count, persona-less 면접관 1명, 중단됨");

  const initialHistoryLength = await f.page.evaluate(() => history.length);
  await f.page.getByRole("combobox", { name: "정렬 기준" }).selectOption("score");
  assert.equal(await f.page.getByRole("button", { name: "정렬 방향" }).innerText(), "높은 점수순");
  assert.equal(new URL(f.page.url()).search, "?sort=score&order=desc");
  assert.deepEqual(await cardOrder(f.page), ["면접관 3명", "김도윤", "박서연", "면접관 1명"]);
  await f.page.getByRole("button", { name: "정렬 방향" }).click();
  assert.equal(await f.page.getByRole("button", { name: "정렬 방향" }).innerText(), "낮은 점수순");
  assert.deepEqual(await cardOrder(f.page), ["김도윤", "면접관 3명", "박서연", "면접관 1명"]);
  const historyLength = await f.page.evaluate(() => history.length);
  report("list: score sort, toggle to 낮은 점수순, missing scores last");

  await f.page.locator("button", { hasText: "김도윤" }).first().click();
  await f.page.waitForURL("**/main/feedback/overall/56");
  await f.page.goBack();
  await f.page.waitForURL("**/main/feedback/list?sort=score&order=asc");
  assert.equal(await f.page.getByRole("button", { name: "정렬 방향" }).innerText(), "낮은 점수순");
  assert.equal(historyLength, initialHistoryLength);
  report("list: sort kept after visiting overall and going back (replace, no extra history)");

  await f.page.getByRole("combobox", { name: "정렬 기준" }).selectOption("date");
  assert.equal(await f.page.getByRole("button", { name: "정렬 방향" }).innerText(), "최신순");
  assert.equal(new URL(f.page.url()).search, "");
  await f.close();
  report("list: back to date resets to latest and drops query");
}
{
  const f = await open("/main/feedback/list?sort=name&order=up");
  assert.deepEqual(await cardOrder(f.page), ["김도윤", "박서연", "면접관 3명", "면접관 1명"]);
  assert.equal(await f.page.getByRole("button", { name: "정렬 방향" }).innerText(), "최신순");
  await f.close();
  report("list: invalid query falls back to default");
}

await browser.close();
console.log(`${passed} passed`);
