import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const root = fileURLToPath(new URL("../src/", import.meta.url));
const modules = new Map();
const personas = [];
const apiPath = "@/features/interview-page/interview/api";
function load(name, parent = root) {
  if (name.endsWith("?url")) return name;
  if (name === apiPath) return { savePersona: async (body) => {
    personas.push(body);
    return { data: { personaId: personas.length }, errorMessage: null };
  } };
  const base = name.startsWith("@/") ? resolve(root, name.slice(2)) : resolve(parent, name);
  const path = [`${base}.ts`, resolve(base, "index.ts")].find(existsSync);
  assert.ok(path, `Unknown module: ${name}`);
  if (modules.has(path)) return modules.get(path);
  const exports = {};
  modules.set(path, exports);
  const { outputText } = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  vm.runInNewContext(outputText, { exports, crypto, require: (next) => load(next, dirname(path)) });
  return exports;
}
const { INTERVIEW_STYLE_PRESETS, findStylePreset } = load("@/shared/constants/interview-page/setting-interview");
const { MULTI_INTERVIEWER_TEMPLATES } = load("@/shared/constants/interview-page/setting-multi-interview");
const { createSlot, resizeSlots, findMultiStylePreset } = load("@/features/interview-page/setting-multi-interview/model/selection");
const { readInterviewDraft } = load("@/features/interview-page/setting-company/model/draft");
const { buildMultiInterviewPayload } = load("@/features/interview-page/setting-multi-interview/model/submitMultiInterview");
const slotsFor = (preset, count = 3) => Array.from({ length: count }, (_, index) => ({
  ...createSlot(index, preset), interviewer: MULTI_INTERVIEWER_TEMPLATES[index], role: ["TECH", "HR", "PM", "CEO"][index],
}));
const draftFor = (preset) => ({ mode: "MULTI", style: findStylePreset(preset), difficulty: preset.difficulty,
  answerMode: "text", slots: slotsFor(preset) });

for (const [style, preset] of Object.entries(INTERVIEW_STYLE_PRESETS)) {
  test(`${style}: SOLO and MULTI derive the same style for 2–4 interviewers`, () => {
    for (const count of [2, 3, 4]) {
      assert.equal(findMultiStylePreset(slotsFor(preset, count), preset.difficulty), findStylePreset(preset));
    }
  });
  test(`${style}: increasing count retains the preset and existing interviewer settings`, () => {
    const original = slotsFor(preset, 2);
    const resized = resizeSlots(original, 4, preset.difficulty);
    assert.equal(resized[0], original[0]);
    assert.equal(resized[1], original[1]);
    assert.equal(resized[2].personality, preset.personality);
    assert.equal(resized[3].tone, preset.tone);
    assert.equal(findMultiStylePreset(resized, preset.difficulty), style);
  });
  test(`${style}: saved settings produce matching persona API fields`, async () => {
    personas.length = 0;
    const draft = readInterviewDraft({ draft: draftFor(preset) });
    assert.equal(draft.style, style);
    await buildMultiInterviewPayload(draft);
    assert.equal(personas.length, 3);
    for (const persona of personas) {
      assert.equal(persona.type, preset.personality);
      assert.equal(persona.tone, preset.tone);
      assert.equal(persona.level, { 쉬움: "EASY", 보통: "NORMAL", 어려움: "HARD" }[preset.difficulty]);
    }
  });
}

test("difficulty or any interviewer's personality/tone mismatch clears the style", () => {
  const preset = INTERVIEW_STYLE_PRESETS.편함;
  assert.equal(findMultiStylePreset(slotsFor(preset), "어려움"), null);
  for (const patch of [{ personality: "REALISTIC" }, { tone: "DIRECT" }]) {
    const slots = slotsFor(preset);
    slots[2] = { ...slots[2], ...patch };
    assert.equal(findMultiStylePreset(slots, preset.difficulty), null);
    slots[2] = { ...slots[2], ...preset };
    assert.equal(findMultiStylePreset(slots, preset.difficulty), "편함");
  }
});

test("custom combinations survive draft restore without resetting per-interviewer choices", () => {
  const draft = draftFor(INTERVIEW_STYLE_PRESETS.편함);
  draft.style = null;
  draft.slots[1].tone = "PRESSURING";
  const restored = readInterviewDraft({ draft: JSON.parse(JSON.stringify(draft)) });
  assert.equal(restored.style, null);
  assert.equal(restored.slots[1].tone, "PRESSURING");
  assert.equal(restored.slots[0].tone, "GENTLE");
});

test("legacy independent style is recomputed from actual settings", () => {
  const draft = draftFor(INTERVIEW_STYLE_PRESETS.편함);
  draft.style = "압박";
  assert.equal(readInterviewDraft({ draft }).style, "편함");
  draft.slots[2].personality = "METICULOUS";
  assert.equal(readInterviewDraft({ draft }).style, null);
});
