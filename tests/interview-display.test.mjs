import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

// interviewDisplay가 쓰는 직무 라벨 상수는 이 테스트와 무관해 같은 값을 돌려주는 함수로 바꾼다.
const source = readFileSync(new URL("../src/features/feedback-page/model/interviewDisplay.ts", import.meta.url), "utf8")
  .replace(/^import \{ getJobRoleLabel \} from .*$/m, "const getJobRoleLabel = (value) => value;");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } });
const display = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("ABANDONED status is labeled", () => {
  assert.equal(display.getInterviewStatusLabel("ABANDONED"), "중단됨");
});
