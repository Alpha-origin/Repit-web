import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const load = async (file, replacements = {}) => {
  let source = readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8");
  for (const [from, to] of Object.entries(replacements)) source = source.replaceAll(from, JSON.stringify(to));
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } });
  const url = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  return { url, module: await import(url) };
};
const roles = await load("shared/constants/job/jobRoles.ts");
const documents = await load("shared/constants/job/documentTypes.ts");
const categories = await load("shared/constants/job/categoryLabels.ts");
const requirement = await load("features/profile/model/materialsRequirement.ts", { '"@/shared/constants/job/jobRoles"': roles.url });
const messages = await load("features/profile/model/profileMessages.ts", {
  '"@/shared/constants/job/jobRoles"': roles.url,
  '"@/shared/constants/job/documentTypes"': documents.url,
  '"./materialsRequirement"': requirement.url,
  '"./profileCompletedAt"': (await load("features/profile/model/profileCompletedAt.ts")).url,
});
const { checkMaterials } = requirement.module;
const materials = (overrides = {}) => ({ jobRole: "GEN_MARKETING", jobTitle: "퍼포먼스 마케터", documents: [], gitUrls: [], supplements: [], coverLetters: [], ...overrides });

test("일반 6개 대분류는 공통 4종·카테고리 5개와 자소서 규칙을 가진다", () => {
  const expected = ["GEN_STRATEGY", "GEN_HR_ADMIN", "GEN_FINANCE", "GEN_MARKETING", "GEN_SALES", "GEN_DESIGN"];
  const general = roles.module.getJobRolesByCategory("GENERAL");
  assert.deepEqual(general.map(({ code }) => code), expected);
  for (const job of general) {
    assert.equal(job.github, "HIDDEN");
    assert.equal(job.hasSupplement, false);
    assert.equal(job.hasCoverLetter, true);
    assert.equal(job.materialRule, "NON_RESUME_OR_COVER_LETTER");
    assert.deepEqual(job.requiredDocuments, []);
    assert.deepEqual(job.optionalDocuments, ["RESUME", "CAREER_DESCRIPTION", "PORTFOLIO", "WORK_SAMPLE"]);
    assert.equal(Object.keys(categories.module.CATEGORY_LABELS[job.code]).length, 5);
  }
});

test("일반 직군은 직무명과 이력서 외 PDF 또는 완성 자소서로 면접 시작을 판정한다", () => {
  assert.equal(checkMaterials(materials()).isSatisfied, false);
  assert.equal(checkMaterials(materials({ documents: [{ type: "RESUME" }] })).isSatisfied, false);
  for (const type of ["CAREER_DESCRIPTION", "PORTFOLIO", "WORK_SAMPLE"]) {
    assert.equal(checkMaterials(materials({ documents: [{ type }] })).isSatisfied, true);
    assert.equal(checkMaterials(materials({ documents: [{ type }], jobTitle: " " })).isSatisfied, false);
  }
  assert.equal(checkMaterials(materials({ coverLetters: [{ question: "지원 동기", answer: "경험과 목표" }] })).isSatisfied, true);
  assert.equal(checkMaterials(materials({ coverLetters: [{ question: "지원 동기", answer: " " }] })).isSatisfied, false);
  assert.equal(checkMaterials(materials({ gitUrls: ["https://github.com/user/repo"] })).isSatisfied, false);
});

test("IT GitHub·보완 입력 정책과 기존 개발 자료 조건을 유지한다", () => {
  for (const code of ["DATA_ANALYST", "DBA_INFRA", "QA_ENGINEER", "SECURITY"]) {
    assert.equal(roles.module.getJobRole(code).github, "OPTIONAL");
    assert.equal(roles.module.getJobRole(code).hasSupplement, false);
  }
  for (const code of ["PRODUCT_MANAGER", "IT_CONSULTANT"]) {
    assert.equal(roles.module.getJobRole(code).github, "HIDDEN");
    assert.equal(roles.module.getJobRole(code).hasSupplement, true);
  }
  const dev = materials({ jobRole: "BACKEND", jobTitle: null, documents: [{ type: "PORTFOLIO" }] });
  assert.equal(checkMaterials(dev).isSatisfied, false);
  assert.equal(checkMaterials({ ...dev, gitUrls: ["https://github.com/user/repo"] }).isSatisfied, true);
  assert.equal(checkMaterials(materials({ jobRole: "QA_ENGINEER", documents: [{ type: "TEST_CASE" }] })).isSatisfied, true);
});

test("자료 유지 여부는 같은 직무 또는 개발 직무 사이에서만 참이다", () => {
  const { keepsMaterials } = roles.module;
  assert.equal(keepsMaterials("FRONTEND", "BACKEND"), true);
  assert.equal(keepsMaterials("GEN_MARKETING", "GEN_MARKETING"), true);
  assert.equal(keepsMaterials("GEN_MARKETING", "GEN_SALES"), false);
  assert.equal(keepsMaterials("QA_ENGINEER", "GEN_MARKETING"), false);
});

test("일반 직군 분석 실패 안내는 문서와 자소서 보강을 안내한다", () => {
  const { getProfileFailureMessage, getRequiredDocumentGuidance } = messages.module;
  assert.match(getProfileFailureMessage({ failureReason: "INSUFFICIENT_EVIDENCE" }, "GEN_MARKETING"), /자소서 문항/);
  assert.match(getProfileFailureMessage({ failureReason: "UNREADABLE_DOCUMENT" }, "GEN_DESIGN"), /자소서/);
  assert.equal(getProfileFailureMessage({ failureReason: "INVALID_MATERIAL" }, "GEN_DESIGN"), messages.module.PROFILE_FAILURE_MESSAGES.INVALID_MATERIAL);
  assert.match(getRequiredDocumentGuidance("GEN_MARKETING"), /이력서 외 자료나 자소서/);
  assert.doesNotMatch(getProfileFailureMessage({ failureReason: "INSUFFICIENT_EVIDENCE" }, "BACKEND"), /자소서/);
});

const rules = await load("features/my-page/materials/model/materialRules.ts", {
  '"@/shared/constants/job/documentTypes"': documents.url,
});
test("일반 직군 422 오류는 직무명·자료·자소서 위치에 맞는 문구를 제공한다", () => {
  const message = (field, reason) => rules.module.getMaterialErrorMessage({ field, reason, detail: null }, []);
  assert.equal(message("jobTitle", "JOB_TITLE_REQUIRED"), "직무명을 입력해 주세요");
  assert.match(message("jobTitle", "JOB_TITLE_INVALID"), /30자/);
  assert.match(message("materials", "MATERIAL_REQUIRED"), /이력서 외에/);
  assert.equal(message("coverLetters[1]", "COVER_LETTER_INVALID"), "문항과 답을 모두 입력해 주세요");
  assert.match(message("coverLetters", "COVER_LETTER_INVALID"), /5문항/);
  assert.equal(message("jobTitle", "JOB_TITLE_NOT_ALLOWED"), rules.module.MATERIAL_MESSAGES.MATERIALS_CHANGED);
  assert.equal(message("coverLetters", "COVER_LETTER_NOT_ALLOWED"), rules.module.MATERIAL_MESSAGES.MATERIALS_CHANGED);
});
