import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
const origin = process.env.INTERVIEW_TEST_ORIGIN ?? "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
let passed = 0;

async function fixture(multi, fail = false, { major, navigate = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
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
      return fail ? json({ message: "테스트 저장 실패" }, 422) : json({ data: { personaId: saves.length, ...(major === undefined ? {} : { major }) } });
    }
    if (path.endsWith("/interviews/create")) {
      creates++;
      return json({ data: { interviewId: 42, sessionId: "test-session", userId: 7, personaId: 1, personaIds: request.postDataJSON().personaIds ?? [1], status: "IN_PROGRESS" } });
    }
    // 준비 화면에서 멈춰 장치/소켓과 독립적으로 설정 요청을 검증한다.
    if (path === "/api/interviews/42") return navigate
      ? json({ data: { interviewId: 42, sessionId: "test-session" } })
      : json({ message: "테스트 준비 중지" }, 503);
    return json({ data: [] });
  });
  await page.goto(origin);
  await page.getByRole("button", { name: "면접 시작하기", exact: true }).first().waitFor();
  await page.evaluate(async (multi) => {
    (await import("/src/shared/api/accessToken.ts")).setAccessToken("test-only-token");
    const url = performance.getEntriesByType("resource").map((entry) => entry.name).find((url) => new URL(url).pathname === "/src/app/router.tsx");
    window.__router = (await import(url)).default;
    await window.__router.navigate(multi ? "/main/setting/interview/multi" : "/main/setting/interview");
  }, multi);
  const close = async () => { assert.deepEqual(errors, []); await context.close(); passed++; };
  const submit = async () => {
    await page.getByRole("button", { name: "다음", exact: true }).click();
    if (navigate) await page.waitForURL("**/main/interview/42");
    else await page.getByText("테스트 준비 중지", { exact: false }).waitFor();
    assert.ok(saves.length > 0);
    assert.ok(saves.every((save) => !Object.hasOwn(save, "major")));
    return saves[0];
  };
  return { page, saves, close, submit, creates: () => creates };
}

const guidance = "전문 분야는 마이페이지에서 선택한 직무를 따릅니다.";
const identities = [
  ["김도윤", 1, "MALE"], ["이서준", 2, "MALE"], ["박지민", 3, "FEMALE"],
  ["최유진", 4, "FEMALE"], ["한민석", 5, "MALE"],
];
const styleGroup = (page) => page.getByRole("radiogroup", { name: "면접 스타일", exact: true });
const choose = (page, group, label) => page.getByRole("group", { name: group, exact: true }).getByRole("button", { name: label, exact: true }).click();
async function assertNoMajorControls(page) {
  await page.getByText(guidance, { exact: true }).waitFor();
  assert.equal(await page.getByRole("button", { name: /^(백엔드|프론트엔드)$/ }).count(), 0);
}

try {
  for (const [name, voiceIndex, gender] of identities) {
    const f = await fixture(false);
    const card = f.page.getByRole("radio", { name: new RegExp(name) });
    const image = await card.locator("img").getAttribute("src");
    await card.click();
    const saved = await f.submit();
    assert.equal(saved.voiceIndex, voiceIndex);
    assert.equal(saved.gender, gender);
    assert.equal(saved.imageUrl, image);
    await f.close();
    console.log(`PASS SOLO ${name}: voiceIndex + gender + image, no major`);
  }
  {
    const f = await fixture(false);
    await assertNoMajorControls(f.page);
    const saved = await f.submit();
    assert.deepEqual([saved.level, saved.career, saved.type, saved.tone, saved.voiceIndex], ["EASY", 0, "FRIENDLY", "GENTLE", 1]);
    await f.close();
    console.log("PASS SOLO default and major guidance");
  }
  for (const [label, level, career, personality, tone] of [
    ["편함", "EASY", 0, "FRIENDLY", "GENTLE"],
    ["일반", "NORMAL", 3, "REALISTIC", "DIRECT"],
    ["압박", "HARD", 5, "METICULOUS", "PRESSURING"],
  ]) {
    const f = await fixture(false);
    await styleGroup(f.page).getByRole("radio", { name: new RegExp(label) }).click();
    const saved = await f.submit();
    assert.deepEqual([saved.level, saved.career, saved.type, saved.tone], [level, career, personality, tone]);
    assert.equal(Object.hasOwn(saved, "style"), false);
    await f.close();
    console.log(`PASS SOLO preset ${label}`);
  }
  {
    const f = await fixture(false);
    await styleGroup(f.page).getByRole("radio", { name: /압박/ }).click();
    await choose(f.page, "분위기", "부드러운");
    await f.page.getByText("직접 설정 중이에요", { exact: true }).waitFor();
    assert.equal(await styleGroup(f.page).getByRole("radio", { checked: true }).count(), 0);
    // Returning all three fields to a preset restores its selection.
    await choose(f.page, "분위기", "강압적인");
    assert.equal(await styleGroup(f.page).getByRole("radio", { checked: true }).count(), 1);
    await choose(f.page, "분위기", "부드러운");
    const saved = await f.submit();
    assert.deepEqual([saved.type, saved.tone, saved.level], ["METICULOUS", "GENTLE", "HARD"]);
    await f.close();
    console.log("PASS SOLO custom composition and computed preset restoration");
  }
  for (const [personality, type] of [["친근한", "FRIENDLY"], ["꼼꼼한", "METICULOUS"], ["현실적인", "REALISTIC"]]) {
    for (const [label, tone] of [["부드러운", "GENTLE"], ["직설적인", "DIRECT"], ["강압적인", "PRESSURING"]]) {
      const f = await fixture(false);
      await choose(f.page, "성격", personality);
      await choose(f.page, "분위기", label);
      const saved = await f.submit();
      assert.deepEqual([saved.type, saved.tone], [type, tone]);
      await f.close();
      console.log(`PASS SOLO composition ${type}/${tone}`);
    }
  }
  for (const names of [["김도윤", "이서준", "박지민"], ["한민석", "최유진", "김도윤"]]) {
    const f = await fixture(true);
    await assertNoMajorControls(f.page);
    for (const [index, name] of names.entries()) {
      await f.page.getByRole("button", { name: `면접관 ${index + 1} 설정`, exact: true }).click();
      await f.page.getByRole("group", { name: "면접관 선택", exact: true }).getByRole("button", { name, exact: true }).click();
      if (index > 0) await f.page.getByRole("group", { name: "역할", exact: true }).getByRole("button", { name: index === 1 ? "HR" : "Design", exact: true }).click();
    }
    await f.submit();
    const expected = names.map((name) => ({ 김도윤: [1, "MALE"], 이서준: [2, "MALE"], 박지민: [3, "FEMALE"], 최유진: [4, "FEMALE"], 한민석: [5, "MALE"] })[name]);
    assert.deepEqual(f.saves.map((save) => [save.voiceIndex, save.gender]), expected);
    await f.close();
    console.log(`PASS MULTI ${names.join(", ")}: selected identity independent of slot`);
  }
  for (const multi of [false, true]) {
    for (const major of [undefined, "FRONTEND"]) {
      const f = await fixture(multi, false, { major, navigate: true });
      await f.page.getByRole("group", { name: "답변 방식", exact: true }).getByRole("button", { name: /단순 텍스트 면접/ }).click();
      if (multi) {
        for (const [index, [name]] of identities.slice(0, 3).entries()) {
          await f.page.getByRole("button", { name: `면접관 ${index + 1} 설정`, exact: true }).click();
          await choose(f.page, "면접관 선택", name);
          if (index > 0) await choose(f.page, "역할", index === 1 ? "HR" : "Design");
        }
      }
      await f.submit();
      const prepared = await f.page.evaluate(() => window.__router.state.location.state.preparedInterview);
      assert.equal(prepared.major, major ?? null);
      assert.equal(prepared.answerMode, "text");
      assert.equal(prepared.interviewers[0].voiceIndex, 1);
      await f.close();
      console.log(`PASS ${multi ? "MULTI" : "SOLO"} response major ${major ?? "missing → null"}`);
    }
  }
  {
    const f = await fixture(false);
    await f.page.getByText(guidance, { exact: true }).waitFor();
    const grid = f.page.getByRole("radiogroup", { name: "면접관 선택", exact: true });
    for (const [width, columns] of [[1440, 2], [1202, 2], [832, 2], [544, 1], [390, 1], [320, 1]]) {
      await f.page.setViewportSize({ width, height: 900 });
      assert.equal(await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length), columns);
      assert.equal(await f.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      if (width === 1440) {
        await styleGroup(f.page).getByRole("radio", { name: /압박/ }).click();
        await choose(f.page, "분위기", "부드러운");
        const guidanceBox = await f.page.getByText(guidance, { exact: true }).boundingBox();
        const nextBox = await f.page.getByRole("button", { name: "다음", exact: true }).boundingBox();
        assert.ok(guidanceBox.y + guidanceBox.height < nextBox.y, "all controls fit above the footer in custom mode");
      }
      // Every control must remain large enough and reachable on small screens.
      for (const group of ["성격", "분위기"]) {
        for (const button of await f.page.getByRole("group", { name: group, exact: true }).getByRole("button").all()) {
          const box = await button.boundingBox();
          assert.ok(box.height >= 40);
        }
      }
      await grid.getByRole("radio", { name: /한민석/ }).click();
      const next = f.page.getByRole("button", { name: "다음", exact: true });
      await next.scrollIntoViewIfNeeded();
      assert.equal(await next.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const target = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return rect.top >= -1 && rect.bottom <= innerHeight + 1 && (target === el || el.contains(target));
      }), true, "footer remains reachable by scrolling");
      if (process.env.INTERVIEW_SCREENSHOT_DIR) await f.page.screenshot({ path: `${process.env.INTERVIEW_SCREENSHOT_DIR}/solo-persona-${width}.png`, fullPage: true });
    }
    await f.page.setViewportSize({ width: 1440, height: 900 });
    await f.close();
    console.log("PASS SOLO responsive 2/1 columns and reachable footer in custom mode");
  }
  {
    const f = await fixture(false);
    // Tab and Space traverse all five setting groups without pointer interaction.
    const targets = [
      styleGroup(f.page).getByRole("radio", { name: /압박/ }),
      f.page.getByRole("radiogroup", { name: "난이도", exact: true }).getByRole("radio", { name: "보통", exact: true }),
      f.page.getByRole("group", { name: "성격", exact: true }).getByRole("button", { name: "현실적인", exact: true }),
      f.page.getByRole("group", { name: "분위기", exact: true }).getByRole("button", { name: "직설적인", exact: true }),
      f.page.getByRole("radiogroup", { name: "면접관 선택", exact: true }).getByRole("radio", { name: /한민석/ }),
    ];
    for (const target of targets) {
      for (let attempts = 0; !(await target.evaluate((el) => el === document.activeElement)); attempts++) {
        assert.ok(attempts < 40, "control reachable by Tab");
        await f.page.keyboard.press("Tab");
      }
      assert.equal(await target.evaluate((el) => getComputedStyle(el).outlineStyle), "solid");
      await f.page.keyboard.press("Space");
    }
    const saved = await f.submit();
    assert.deepEqual([saved.type, saved.tone, saved.level, saved.voiceIndex], ["REALISTIC", "DIRECT", "NORMAL", 5]);
    await f.close();
    console.log("PASS SOLO keyboard selection and focus rings");
  }
  for (const multi of [false, true]) {
    const failed = await fixture(multi, true);
    if (multi) {
      for (const [index, [name]] of identities.slice(0, 3).entries()) {
        await failed.page.getByRole("button", { name: `면접관 ${index + 1} 설정`, exact: true }).click();
        await choose(failed.page, "면접관 선택", name);
        if (index > 0) await choose(failed.page, "역할", index === 1 ? "HR" : "Design");
      }
    }
    await failed.page.getByRole("button", { name: "다음", exact: true }).click();
    await failed.page.getByText(/테스트 저장 실패/).waitFor();
    assert.equal(failed.creates(), 0);
    await failed.close();
  }
  console.log(`PASS save failure blocks interview creation; ${passed} scenarios`);
} finally {
  await browser.close();
}
