import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const toModuleUrl = (source) => {
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } });
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
};
const rolesUrl = toModuleUrl(readFileSync(new URL("../src/shared/constants/job/jobRoles.ts", import.meta.url), "utf8"));
const source = readFileSync(new URL("../src/features/feedback-page/model/interviewDisplay.ts", import.meta.url), "utf8")
  .replace('"@/shared/constants/job/jobRoles"', JSON.stringify(rolesUrl));
const display = await import(toModuleUrl(source));

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

test("일반 직군 제목은 면접에 저장된 직무명을 쓰며 IT 제목은 유지한다", () => {
  assert.equal(display.getInterviewTitle("GEN_MARKETING", " 퍼포먼스 마케터 "), "마케팅·홍보 · 퍼포먼스 마케터 모의면접");
  assert.equal(display.getInterviewTitle("GEN_MARKETING", null), "마케팅·홍보 모의면접");
  assert.equal(display.getInterviewTitle("BACKEND", "무시할 직무명"), "백엔드 모의면접");
  assert.equal(display.getInterviewTitle("FULLSTACK"), "풀스택 모의면접");
});
