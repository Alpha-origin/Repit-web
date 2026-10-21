import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const load = async (name, replacements = {}) => {
  let source = readFileSync(new URL(`../src/features/feedback-page/model/${name}.ts`, import.meta.url), "utf8");
  for (const [from, to] of Object.entries(replacements)) source = source.replaceAll(from, JSON.stringify(to));
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } });
  const url = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  return { url, module: await import(url) };
};
const types = await load("videoAnalysisTypes");
const { module: { parseVideoAnalysis, validateBehavior } } = await load("validateVideoAnalysis", { '"./videoAnalysisTypes"': types.url });
const { module: { formatVideoTime, behaviorSummaries, videoStatusMessage } } = await load("feedbackBehavior", { '"./videoAnalysisTypes"': types.url });
const folder = new URL("../docs/behavior-analysis/contracts/", import.meta.url);
const fixture = (name) => JSON.parse(readFileSync(new URL(`${name}.json`, folder), "utf8"));

for (const name of readdirSync(folder).filter((name) => name.startsWith("api-") && name.endsWith(".json"))) {
  test(`${name}: 공통 API 계약 예제를 표시 모델로 읽는다`, () => {
    const original = fixture(name.replace(".json", ""));
    const result = parseVideoAnalysis(original);
    assert.equal(result.status, original.data.status);
    assert.deepEqual(result.behavior, original.data.behavior);
    assert.equal(result.showingPreviousResult, original.data.showingPreviousResult);
  });
}
test("얼굴 0%는 유효한 숫자이며 측정 불가 지표는 null이다", () => {
  const result = parseVideoAnalysis(fixture("api-zero-face"));
  assert.equal(result.behavior.metrics.faceVisibleRatio.value, 0);
  assert.equal(result.behavior.metrics.headFacingRatio.value, null);
  assert.match(behaviorSummaries(result.behavior)[0], /0\.0%/);
});
test("잘못된 비율·타입·시간·사유·버전·이벤트·경고는 거부한다", () => {
  const mutations = [
    (x) => { x.metrics.headFacingRatio.value = 0.9; },
    (x) => { x.metrics.faceVisibleRatio.value = NaN; },
    (x) => { x.metrics.faceVisibleRatio.value = Infinity; },
    (x) => { x.metrics.faceVisibleRatio.value = "0.95"; },
    (x) => { x.sampledFrameCount = 0; },
    (x) => { x.timeline[0].metrics.faceVisibleRatio.numeratorMs++; },
    (x) => { x.timeline[0].startMs++; },
    (x) => { x.events[0].sourceMetric = "smileShapeRatio"; },
    (x) => { x.events[0].endMs = x.events[0].startMs + 1999; },
    (x) => { x.schemaVersion = "behavior-v2"; },
    (x) => { x.metrics.extraMetric = {}; },
    (x) => { x.warnings = ["INTERNAL_SECRET"]; },
    (x) => { x.eventsTruncated = true; x.warnings = ["EVENTS_TRUNCATED"]; },
  ];
  for (const mutate of mutations) {
    const bad = fixture("behavior-ready"); mutate(bad);
    assert.throws(() => validateBehavior(bad), /결과 형식/);
  }
  const bad = fixture("behavior-zero-face");
  bad.metrics.headFacingRatio.unavailableReason = "BLENDSHAPES_UNAVAILABLE";
  assert.throws(() => validateBehavior(bad), /결과 형식/);
});
test("이전 결과의 ID 관계·없는 결과·분석 중 재요청 허용을 검사한다", () => {
  for (const mutate of [
    (x) => { x.data.showingPreviousResult = false; },
    (x) => { x.data.behaviorAnalysisId = null; },
    (x) => { x.data.latestAnalysisId = null; },
    (x) => { x.data.canRetry = true; },
  ]) {
    const bad = fixture("api-analyzing-previous"); mutate(bad);
    assert.throws(() => parseVideoAnalysis(bad));
  }
  const bad = fixture("api-ready"); bad.data.behavior = null; bad.data.behaviorAnalysisId = null;
  assert.throws(() => parseVideoAnalysis(bad));
});
test("옛 API는 raw result를 추측하지 않고 미지원 안내를 낸다", () => {
  const result = parseVideoAnalysis({ success: true, data: { status: "READY", result: fixture("callback-ready"), canRetry: false } });
  assert.equal(result.behavior, null);
  assert.equal(result.reasonCode, "RESULT_SCHEMA_UNSUPPORTED");
});
test("raw result·서버 summary·임의 reasonCode를 화면 문장으로 노출하지 않는다", () => {
  const data = fixture("api-ready");
  data.data.behavior.summary = ["S3_SECRET_TOKEN"];
  data.data.reasonCode = "INTERNAL_SECRET";
  const result = parseVideoAnalysis(data);
  assert.ok(behaviorSummaries(result.behavior).every((line) => !line.includes("S3_SECRET_TOKEN")));
  assert.equal(videoStatusMessage(result), "관찰 완료");
});
test("시간은 시작 내림·끝 올림, 60분은 시 단위로 표시한다", () => {
  assert.equal(formatVideoTime(1999), "00:01");
  assert.equal(formatVideoTime(1999, true), "00:02");
  assert.equal(formatVideoTime(3_600_000, true), "01:00:00");
});
test("실패 응답의 공개 오류 메시지를 표시하고 미지원 형식은 재분석하지 않는다", () => {
  const failed = fixture("api-failed-previous");
  failed.data.error.message = "서버가 반환한 공개 오류 안내";
  assert.equal(videoStatusMessage(parseVideoAnalysis(failed)), failed.data.error.message);
  const unsupported = fixture("api-partial");
  unsupported.data.reasonCode = "RESULT_SCHEMA_UNSUPPORTED";
  unsupported.data.canRetry = true;
  const parsed = parseVideoAnalysis(unsupported);
  assert.equal(parsed.canRetry, false);
  assert.ok(parsed.behavior);
});
test("coverage가 0.8로 반올림되어도 원 시간 비율의 LOW 경고를 허용한다", () => {
  const response = fixture("api-partial");
  const behavior = response.data.behavior;
  behavior.durationMs = 3_000_000;
  behavior.sampledDurationMs = 3_000_000;
  behavior.sampledFrameCount = 15_000;
  const lowMetrics = ["headFacingRatio", "shoulderLevelRatio"];
  for (const [key, metric] of Object.entries(behavior.metrics)) {
    const denominatorMs = lowMetrics.includes(key) ? 2_399_999 : 3_000_000;
    Object.assign(metric, { status: "AVAILABLE", value: 1, numeratorMs: denominatorMs, denominatorMs, coverageRatio: lowMetrics.includes(key) ? 0.8 : 1, unavailableReason: null });
  }
  behavior.timeline = Array.from({ length: 60 }, (_, index) => ({
    startMs: index * 50_000,
    endMs: (index + 1) * 50_000,
    metrics: Object.fromEntries(Object.keys(behavior.metrics).map((key) => {
      const time = lowMetrics.includes(key) ? 40_000 - (index === 59 ? 1 : 0) : 50_000;
      return [key, { numeratorMs: time, denominatorMs: time }];
    })),
  }));
  behavior.events = [];
  behavior.eventsTruncated = false;
  behavior.warnings = ["LOW_FACE_COVERAGE", "LOW_POSE_COVERAGE"];
  assert.equal(parseVideoAnalysis(response).status, "PARTIAL");
});
