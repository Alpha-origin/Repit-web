import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

// interviewDisplay가 쓰는 직무 라벨 상수는 이 테스트와 무관해 같은 값을 돌려주는 함수로 바꾼다.
const source = readFileSync(new URL("../src/features/feedback-page/model/interviewDisplay.ts", import.meta.url), "utf8")
  .replace(/^import \{ getJobRoleLabel \} from .*$/m, "const getJobRoleLabel = (value) => value;");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } });
const display = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("level label reads EASY/NORMAL/HARD", () => {
  assert.equal(display.getLevelLabel("EASY"), "쉬움");
  assert.equal(display.getLevelLabel("NORMAL"), "보통");
  assert.equal(display.getLevelLabel("HARD"), "어려움");
  for (const value of [undefined, null, "", "UNKNOWN"]) assert.equal(display.getLevelLabel(value), "미제공");
});

test("SOLO interviewer name drops the uuid suffix", () => {
  const persona = { id: 56, personaName: "김도윤-4898e87d-1c2b-4d5e-8f90-a1b2c3d4e5f6", type: "FRIENDLY", level: "EASY" };
  assert.equal(display.getInterviewerName({ mode: "SOLO", personaId: 56, persona }), "김도윤");
  assert.equal(display.getInterviewerName({ personaId: 56, persona: { ...persona, personaName: "김도윤" } }), "김도윤");
  assert.equal(display.getInterviewerName({ mode: "SOLO", personaId: 56, persona: { ...persona, personaName: "이름-abc" } }), "이름-abc");
});

test("interviewer name falls back without persona and MULTI keeps the count", () => {
  assert.equal(display.getInterviewerName({ mode: "SOLO", personaId: 56 }), "면접관 1명");
  assert.equal(display.getInterviewerName({ mode: "SOLO", personaId: 56, persona: null }), "면접관 1명");
  assert.equal(display.getInterviewerName({ mode: "MULTI", personaIds: [1, 2, 3], persona: { id: 1, personaName: "김도윤-4898e87d-1c2b-4d5e-8f90-a1b2c3d4e5f6" } }), "면접관 3명");
  assert.equal(display.getInterviewerName({ mode: "SOLO" }), "면접관 정보 없음");
});

test("ABANDONED status is labeled", () => {
  assert.equal(display.getInterviewStatusLabel("ABANDONED"), "중단됨");
});
