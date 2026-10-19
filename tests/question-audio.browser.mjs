import assert from "node:assert/strict";
import { browser, fixture, question, waitUntil } from "./interview-browser-fixture.mjs";

let passed = 0;
const plays = (page) => page.evaluate(() => window.__audioEvents.filter((event) => event.type === "play").length);
const listen = (page) => page.getByRole("button", { name: "질문 듣기", exact: true });
const stop = (page) => page.getByRole("button", { name: "질문 멈추기", exact: true });
const failure = (page) => page.getByText("음성 재생에 실패했습니다.", { exact: true });
async function close(f, label) {
  assert.deepEqual(f.errors, []);
  assert.deepEqual(f.directTtsRequests, []);
  for (const request of f.audioRequests) {
    assert.equal(request.wait, "20");
    assert.match(request.authorization, /^Bearer /);
  }
  f.releaseAudio();
  await f.context.close();
  passed++;
  console.log(`PASS ${label}`);
}
const socketQuestion = (page, id) => page.evaluate((next) => {
  window.__sockets.filter((socket) => socket.readyState === 1).forEach((socket) => socket.dispatchEvent(new MessageEvent("message", { data: JSON.stringify({ status: "IN_PROGRESS", question: next }) })));
}, question(id));

try {
  for (const multi of [false, true]) {
    const f = await fixture({ multi, audioResponses: ["READY"] });
    await stop(f.page).waitFor();
    await f.page.waitForFunction(() => window.__audios.some((audio) => !audio.paused && audio.readyState >= 2));
    assert.equal(await plays(f.page), 1);
    await f.page.screenshot({ path: `/tmp/repit-tts-${multi ? "multi" : "solo"}.png`, fullPage: true });
    await stop(f.page).click();
    assert.equal(await f.page.evaluate(() => window.__audios[0].paused), true);
    await listen(f.page).click();
    await stop(f.page).waitFor();
    assert.equal(await plays(f.page), 2);
    assert.equal(f.audioRequests.length, 1);
    await f.page.evaluate(() => window.__audios[0].dispatchEvent(new Event("ended")));
    await listen(f.page).waitFor();
    await close(f, `${multi ? "MULTI" : "SOLO"} native audio: autoplay once, manual replay reuses URL, ended returns idle`);
  }

  for (const multi of [false, true]) {
    const f = await fixture({ multi, answerMode: "text", audioResponses: ["READY"] });
    await listen(f.page).waitFor();
    await waitUntil(() => f.audioRequests.length === 1);
    assert.equal(await plays(f.page), 0);
    await listen(f.page).click();
    await stop(f.page).waitFor();
    await f.page.waitForFunction(() => !window.__audios[0].paused && window.__audios[0].readyState >= 2);
    await f.page.evaluate(() => { window.__timeOffset = 60_000; });
    const answer = f.page.getByRole("textbox").first();
    await answer.fill("첫 입력");
    await answer.fill("");
    await f.page.evaluate(() => { window.__timeOffset = 62_000; });
    await answer.fill("최종 답변");
    assert.equal(await f.page.evaluate(() => window.__audios[0].paused), false);
    await f.page.getByRole("button", { name: "제출하기", exact: true }).click();
    await waitUntil(() => f.answers.length === 1);
    assert.ok(f.answers[0].responseTime >= 2 && f.answers[0].responseTime <= 3);
    await close(f, `${multi ? "MULTI" : "SOLO"} text: manual audio continues during input; first input retained after clearing`);
  }

  const voice = await fixture({ audioResponses: ["READY"] });
  await stop(voice.page).waitFor();
  await voice.page.evaluate(() => { window.__timeOffset = 60_000; });
  await voice.start.click();
  await voice.finish.waitFor();
  assert.equal(await voice.page.evaluate(() => window.__audios[0].paused), true);
  await voice.page.evaluate(() => { window.__timeOffset = 62_000; });
  await voice.finish.click();
  await waitUntil(() => voice.answers.length === 1);
  assert.ok(voice.answers[0].responseTime >= 2 && voice.answers[0].responseTime <= 3);
  await close(voice, "voice recording stops audio; response time excludes question listening");

  const late = await fixture({ audioResponses: ["READY"], holdAudio: true });
  await waitUntil(() => late.audioRequests.length === 1);
  await late.start.click();
  await late.finish.waitFor();
  late.releaseAudio();
  await listen(late.page).waitFor();
  assert.equal(await plays(late.page), 0);
  await listen(late.page).click();
  await stop(late.page).waitFor();
  await close(late, "recording before READY suppresses late autoplay; manual playback remains available");

  for (const statuses of [["PENDING", "PENDING", "READY"], ["QUEUED", "GENERATING", "READY"]]) {
    const f = await fixture({ audioResponses: statuses });
    await stop(f.page).waitFor();
    assert.equal(f.audioRequests.length, 3);
    for (let i = 1; i < f.audioRequests.length; i++) {
      assert.ok(f.audioRequests[i].at - f.audioRequests[i - 1].at >= 900, "PENDING 직후 재요청은 최소 간격을 둔다");
    }
    assert.equal(await plays(f.page), 1);
    await close(f, `${statuses.join(" -> ")}: polling reaches native playback`);
  }

  const transition = await fixture({ audioResponses: ["READY"], holdAudio: true });
  await waitUntil(() => transition.audioRequests.length === 1);
  await socketQuestion(transition.page, -1);
  await stop(transition.page).waitFor();
  transition.releaseAudio();
  await transition.page.waitForTimeout(100);
  assert.equal(await plays(transition.page), 1);
  assert.match(await transition.page.evaluate(() => window.__audioEvents.find((event) => event.type === "play").src), /\/-1\.wav$/);
  assert.ok(transition.failedRequests.length >= 1);
  await socketQuestion(transition.page, 102);
  await transition.page.waitForFunction(() => window.__audioEvents.filter((event) => event.type === "play").length === 2);
  assert.equal(await transition.page.evaluate(() => window.__audios[0].getAttribute("src")), null);
  await socketQuestion(transition.page, -1);
  await listen(transition.page).waitFor();
  assert.equal(await plays(transition.page), 2);
  await close(transition, "question transition cancels old request/audio; late response ignored; follow-up and memory history preserved");

  for (const reason of ["FAILED", "NOT_FOUND"]) {
    const f = await fixture({ audioResponses: [reason] });
    if (reason === "FAILED") {
      await failure(f.page).waitFor();
      assert.equal(await listen(f.page).isDisabled(), true);
    } else {
      await listen(f.page).waitFor();
      assert.equal(await failure(f.page).count(), 0);
    }
    assert.equal(f.audioRequests.length, 1);
    await waitUntil(() => f.start.isEnabled());
    await close(f, `${reason}: no retry; interview answer remains available`);
  }

  for (const reason of ["MALFORMED", "WRONG_QUESTION", "NETWORK"]) {
    const f = await fixture({ audioResponses: [reason], fastAudioTimers: true });
    await failure(f.page).waitFor();
    assert.equal(f.audioRequests.length, 4);
    assert.deepEqual(await f.page.evaluate(() => window.__retryDelays), [1000, 2000, 4000]);
    await close(f, `${reason}: three bounded retries then failure`);
  }
  const reset = await fixture({ audioResponses: ["NETWORK", "PENDING", "NETWORK", "READY"], fastAudioTimers: true });
  await stop(reset.page).waitFor();
  assert.deepEqual(await reset.page.evaluate(() => window.__retryDelays), [1000, 1000]);
  await close(reset, "PENDING resets consecutive error backoff");

  const deadline = await fixture({ audioResponses: ["READY"], holdAudio: true, audioDeadline: true });
  await failure(deadline.page).waitFor();
  await waitUntil(() => deadline.failedRequests.length === 1);
  deadline.releaseAudio();
  await deadline.page.waitForTimeout(50);
  assert.equal(await plays(deadline.page), 0);
  await close(deadline, "180-second total deadline aborts an in-flight request and rejects late READY");

  const overdue = await fixture({ audioResponses: ["READY"], holdAudio: true });
  await waitUntil(() => overdue.audioRequests.length === 1);
  await overdue.page.evaluate(() => { window.__timeOffset = 181_000; });
  overdue.releaseAudio();
  await failure(overdue.page).waitFor();
  assert.equal(await plays(overdue.page), 0);
  await close(overdue, "READY received past the total deadline cannot bypass timeout");

  const blocked = await fixture({ audioResponses: ["READY"], playback: "blocked" });
  await listen(blocked.page).waitFor();
  await waitUntil(async () => (await plays(blocked.page)) === 1);
  assert.equal(await listen(blocked.page).isEnabled(), true);
  assert.equal(await failure(blocked.page).count(), 0);
  await listen(blocked.page).click();
  await stop(blocked.page).waitFor();
  assert.equal(await plays(blocked.page), 2);
  await close(blocked, "autoplay blocked: enabled user playback recovers without another request");

  for (const playback of ["failed", "native"]) {
    const f = await fixture({ audioResponses: ["READY"], playback });
    if (playback === "native") {
      await stop(f.page).waitFor();
      await f.page.evaluate(() => window.__audios[0].dispatchEvent(new Event("error")));
    }
    await failure(f.page).waitFor();
    assert.equal(await listen(f.page).isDisabled(), true);
    await close(f, `${playback === "native" ? "Audio error event" : "play promise rejection"}: failed with no fallback`);
  }

  const delayed = await fixture({ audioResponses: ["READY"], playback: "delayed" });
  await stop(delayed.page).waitFor();
  await delayed.start.click();
  await delayed.finish.waitFor();
  await delayed.page.evaluate(() => window.__releasePlay.splice(0).forEach((resolve) => resolve()));
  await listen(delayed.page).waitFor();
  assert.equal(await delayed.page.evaluate(() => window.__audioEvents.at(-1).type), "pause");
  await close(delayed, "stop invalidates a pending play promise for the same question");

  for (const pending of [true, false]) {
    const f = await fixture({ audioResponses: ["READY"], holdAudio: pending });
    if (pending) await waitUntil(() => f.audioRequests.length === 1);
    else await stop(f.page).waitFor();
    await f.page.getByRole("button", { name: "그만두기", exact: true }).click();
    await f.page.waitForURL("**/main");
    if (pending) { await waitUntil(() => f.failedRequests.length === 1); f.releaseAudio(); }
    else assert.equal(await f.page.evaluate(() => window.__audios.every((audio) => audio.paused && !audio.getAttribute("src"))), true);
    await close(f, `exit cleans up ${pending ? "pending request" : "playing Audio"}`);
  }
  console.log(`${passed} question audio browser scenarios passed`);
} finally { await browser.close(); }
