import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
const origin = process.env.INTERVIEW_TEST_ORIGIN ?? "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
let passed = 0;

async function fixture(multi, fail = false) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const saves = [];
  let creates = 0;
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (!path.startsWith("/api/") && !path.startsWith("/chat/")) return route.continue();
    const json = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (path.endsWith("/profile/latest")) return json({ success: true, data: { status: "COMPLETED" } });
    if (path.endsWith("/me")) return json({ data: { id: 7, name: "테스트" } });
    if (path.endsWith("/refresh")) return json({ accessToken: "test-only-token" });
    if (path.endsWith("/persona/save")) {
      saves.push(request.postDataJSON());
      return fail ? json({ message: "테스트 저장 실패" }, 422) : json({ data: { personaId: saves.length } });
    }
    if (path.endsWith("/interviews/create")) {
      creates++;
      return json({ data: { interviewId: 42, sessionId: "test-session", userId: 7, personaId: 1, personaIds: request.postDataJSON().personaIds ?? [1], status: "IN_PROGRESS" } });
    }
    // 준비 화면에서 멈춰 장치/소켓과 독립적으로 설정 요청을 검증한다.
    if (path === "/api/interviews/42") return json({ message: "테스트 준비 중지" }, 503);
    return json({ data: [] });
  });
  await page.goto(origin);
  await page.getByRole("button", { name: "면접 시작하기", exact: true }).first().waitFor();
  await page.evaluate(async (multi) => {
    (await import("/src/shared/api/accessToken.ts")).setAccessToken("test-only-token");
    const url = performance.getEntriesByType("resource").map((entry) => entry.name).find((url) => new URL(url).pathname === "/src/app/router.tsx");
    await (await import(url)).default.navigate(multi ? "/main/setting/interview/multi" : "/main/setting/interview");
  }, multi);
  const close = async () => { assert.deepEqual(errors, []); await context.close(); passed++; };
  return { page, saves, close, creates: () => creates };
}

try {
  for (let id = 1; id <= 4; id++) {
    const f = await fixture(false);
    await f.page.getByRole("radio", { name: new RegExp(`면접관${id}`) }).click();
    await f.page.getByRole("button", { name: "다음", exact: true }).click();
    await f.page.getByText("테스트 준비 중지", { exact: true }).waitFor();
    assert.equal(f.saves[0].voiceIndex, id);
    assert.equal(f.saves[0].gender, id <= 2 ? "MALE" : "FEMALE");
    await f.close();
    console.log(`PASS SOLO ${id}: voiceIndex + gender request`);
  }
  for (const names of [["김도윤", "이서준", "박지민"], ["한민석", "최유진", "김도윤"]]) {
    const f = await fixture(true);
    for (const [index, name] of names.entries()) {
      await f.page.getByRole("button", { name: `면접관 ${index + 1} 설정`, exact: true }).click();
      await f.page.getByRole("group", { name: "면접관 선택", exact: true }).getByRole("button", { name, exact: true }).click();
      if (index > 0) await f.page.getByRole("group", { name: "역할", exact: true }).getByRole("button", { name: index === 1 ? "HR" : "Design", exact: true }).click();
    }
    await f.page.getByRole("button", { name: "다음", exact: true }).click();
    await f.page.getByText("테스트 준비 중지", { exact: false }).waitFor();
    const expected = names.map((name) => ({ 김도윤: [1, "MALE"], 이서준: [2, "MALE"], 박지민: [3, "FEMALE"], 최유진: [4, "FEMALE"], 한민석: [5, "MALE"] })[name]);
    assert.deepEqual(f.saves.map((save) => [save.voiceIndex, save.gender]), expected);
    await f.close();
    console.log(`PASS MULTI ${names.join(", ")}: selected identity independent of slot`);
  }
  const failed = await fixture(false, true);
  await failed.page.getByRole("button", { name: "다음", exact: true }).click();
  await failed.page.getByText("테스트 저장 실패", { exact: true }).waitFor();
  assert.equal(failed.creates(), 0);
  await failed.close();
  console.log(`PASS save failure blocks interview creation; ${passed} scenarios`);
} finally {
  await browser.close();
}
