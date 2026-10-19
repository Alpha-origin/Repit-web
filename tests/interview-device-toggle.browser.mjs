import assert from "node:assert/strict";
import { browser, fixture, assertReleased, waitUntil } from "./interview-browser-fixture.mjs";

const button = (page, name) => page.getByRole("button", { name, exact: true });
async function expectTracks(page, kind, enabled) {
  const tracks = await page.evaluate((kind) => window.__tracks
    .filter((track) => track.kind === kind && track.readyState === "live")
    .map((track) => track.enabled), kind);
  assert.ok(tracks.length > 0);
  assert.ok(tracks.every((value) => value === enabled), `${kind}: source and recording clones must switch together`);
}

try {
  for (const multi of [false, true]) {
    const f = await fixture({ multi, manualSpeech: true });
    await button(f.page, "마이크 끄기").click();
    await expectTracks(f.page, "audio", false);
    assert.equal(await f.start.isEnabled(), false);
    await button(f.page, "마이크 켜기").click();
    await expectTracks(f.page, "audio", true);

    await button(f.page, "카메라 끄기").click();
    await f.page.getByText("카메라가 꺼져 있어요", { exact: true }).waitFor();
    await expectTracks(f.page, "video", false);
    await f.start.click();
    await waitUntil(() => f.page.evaluate(() => window.__recognitions.at(-1)?.active));
    await f.page.evaluate(() => window.__recognitions.at(-1).onresult({ results: [{ isFinal: true, 0: { transcript: "첫 답변입니다." } }] }));
    await button(f.page, "마이크 끄기").click();
    await expectTracks(f.page, "audio", false);
    assert.equal(await f.page.evaluate(() => window.__recognitions.some((item) => item.active)), false);
    assert.equal(f.answers.length, 0, "muting must not submit or end an answer");
    await f.page.evaluate(() => window.__recognitions.at(-1).onresult({ results: [{ isFinal: true, 0: { transcript: "음소거 중 늦은 이벤트" } }] }));

    await button(f.page, "카메라 켜기").click();
    await expectTracks(f.page, "video", true);
    await button(f.page, "마이크 켜기").click();
    await expectTracks(f.page, "audio", true);
    await waitUntil(() => f.page.evaluate(() => window.__recognitions.length === 2 && window.__recognitions.at(-1).active));
    await f.page.evaluate(() => window.__recognitions.at(-1).onresult({ results: [{ isFinal: true, 0: { transcript: "이어서 답변합니다." } }] }));
    await button(f.page, "마이크 끄기").click();
    await f.finish.click();
    await waitUntil(() => f.answers.length === 1);
    assert.equal(f.answers[0].content, "첫 답변입니다. 이어서 답변합니다.");
    assert.ok(!f.answers[0].content.includes("음소거 중"));
    assert.equal(await f.start.isEnabled(), false);
    await button(f.page, "그만두기").click();
    await f.page.waitForURL("**/main");
    await assertReleased(f);
    assert.equal(f.quits.length, 1);
    await f.context.close();
    console.log(`PASS ${multi ? "MULTI" : "SOLO"}: camera/microphone toggle, clones, speech pause/resume, muted submission and cleanup`);

    const denied = await fixture({ multi, denied: true });
    await button(denied.page, "마이크 연결 안 됨").waitFor();
    assert.equal(await button(denied.page, "마이크 연결 안 됨").isEnabled(), false);
    assert.equal(await button(denied.page, "카메라 연결 안 됨").isEnabled(), false);
    await denied.context.close();
  }
} finally { await browser.close(); }
