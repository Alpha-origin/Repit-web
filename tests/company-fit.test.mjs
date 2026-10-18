import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/features/feedback-page/model/companyFit.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } });
const { readCompanyFit } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const questions = [{ questionId: 900 }, { questionId: "q2-tail" }, { questionId: "q2" }];
const item = (patch = {}) => ({ factId: "f1", kind: "TALENT", focus: "고객 관점", evidence: "사용자 경험을 구체적으로 설명했습니다.", questionIds: ["q2-tail"], ...patch });
const fit = (matchedFocus = [], gaps = [], comment = "관찰할 수 있는 근거가 부족합니다.") => ({ comment, matchedFocus, gaps });

test("opaque IDs and feedback order including follow-ups, deduplicated IDs", () => {
  const result = readCompanyFit(fit([item({ questionIds: ["q2-tail", "900", "q2-tail", "missing", ""] })]), questions);
  assert.deepEqual(result.matchedFocus[0].questions, [
    { questionId: "q2-tail", label: "문항 2" }, { questionId: "900", label: "문항 1" },
  ]);
});
test("null, malformed, and over-limit results are neutral", () => {
  for (const value of [null, {}, fit([], [], ""), fit([], [], "가".repeat(301)), fit([item(), item(), item(), item()])]) {
    assert.equal(readCompanyFit(value, questions), null);
  }
});
test("no valid question evidence removes the whole old result", () => {
  for (const ids of [[], [""], ["missing"], ["  "], ["2"], [null, {}]]) {
    assert.equal(readCompanyFit(fit([item({ questionIds: ids })]), questions), null);
  }
});
test("initially empty valid lists retain neutral comment", () => {
  assert.deepEqual(readCompanyFit(fit(), questions), fit());
});
test("first valid duplicate fact wins; same fact across lists is allowed", () => {
  const result = readCompanyFit(fit([item({ questionIds: [] }), item(), item({ focus: "중복" })],
    [{ ...item(), suggestion: "근거를 보완해주세요." }]), questions);
  assert.equal(result.matchedFocus.length, 1);
  assert.equal(result.matchedFocus[0].focus, "고객 관점");
  assert.equal(result.gaps.length, 1);
});
test("invalid entries disappear without affecting valid evidence", () => {
  for (const patch of [{ factId: "" }, { kind: "UNKNOWN" }, { focus: "가".repeat(21) }, { evidence: "가".repeat(151) }]) {
    assert.equal(readCompanyFit(fit([item(patch), item({ factId: "valid" })]), questions).matchedFocus.length, 1);
  }
});
test("Unicode code points match shared limits", () => {
  assert.notEqual(readCompanyFit(fit([], [], "😀".repeat(300)), questions), null);
  assert.equal(readCompanyFit(fit([], [], "😀".repeat(301)), questions), null);
});
