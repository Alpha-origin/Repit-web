import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/features/profile/model/profileMessages.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { formatProfileCompletedAt } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

for (const [value, expected] of [
  [null, null], ["", null], ["invalid", null],
  ["2026-10-14T21:05", "2026.10.14 21:05 분석 완료"],
  ["2026-10-14T21:05:33.123456", "2026.10.14 21:05 분석 완료"],
  ["2024-02-29T23:59:59", "2024.02.29 23:59 분석 완료"],
  ["2000-02-29T00:00:00", "2000.02.29 00:00 분석 완료"],
  ["2026-10-12T10:00:00Z", "2026.10.12 19:00 분석 완료"],
  ["2026-10-14T21:05:33.123456+09:00", "2026.10.14 21:05 분석 완료"],
  ["2026-10-14T21:05:33-07:00", "2026.10.15 13:05 분석 완료"],
  ["2026-10-14T15:00:00Z", "2026.10.15 00:00 분석 완료"],
  ["2026-13-40T25:99junk", null], ["2026-10-14T21:05junk", null],
  ["2026-02-29T10:00:00", null], ["1900-02-29T10:00:00", null],
  ["2026-04-31T10:00:00Z", null], ["2026-00-01T10:00:00", null],
  ["2026-01-00T10:00:00", null], ["0000-01-01T10:00:00", null],
  ["2026-10-14T24:00:00", null], ["2026-10-14T21:60:00", null],
  ["2026-10-14T21:05:60Z", null], ["2026-10-14T21:05:33+24:00", null],
  ["2026-10-14T21:05:33+09:60", null], ["2026-10-14T21:05:33.1234567890", null],
]) {
  test(`completedAt ${JSON.stringify(value)}`, () => assert.equal(formatProfileCompletedAt(value), expected));
}
