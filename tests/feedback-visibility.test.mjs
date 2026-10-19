import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const load = async (file, replacements = {}) => {
  let source = readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8");
  for (const [from, to] of Object.entries(replacements)) source = source.replace(from, to);
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } });
  const url = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  return { url, module: await import(url) };
};
const metrics = await load("features/feedback-page/model/feedbackMetrics.ts");
const { buildFeedbackMetrics } = metrics.module;
const { module: { buildFeedbackOverallContent } } = await load("features/feedback-page/model/feedbackDisplay.ts", { '"./feedbackMetrics"': JSON.stringify(metrics.url) });
const { module: { buildSpeechAnalysis } } = await load("features/feedback-page/model/feedbackAudio.ts");
const axes = [
  { axis: "INTENT", score: 100, weight: 35 }, { axis: "DEPTH", score: 60, weight: 25 },
  { axis: "SPECIFICITY", score: 95, weight: 25 }, { axis: "ACCURACY", score: 100, weight: 15 },
];

test("서버 점수는 축 이름으로 연결하고 종합 89점을 유지한다", () => {
  const feedback = { totalScore: 89, scoreBreakdown: { axes: [...axes].reverse() } };
  const result = buildFeedbackOverallContent(feedback);
  assert.deepEqual(result.topSection.metrics.map(x => [x.label, x.score]), [["의도 충족",100],["깊이",60],["구체성",95],["정확성",100]]);
  assert.equal(result.topSection.summary.score, 89);
});
test("0점·해당 없음·누락·잘못된 값·중복을 구분한다", () => {
  const result = buildFeedbackMetrics({ intentAlignmentScore: 90, scoreBreakdown: { axes: [
    { axis: "INTENT", score: 0, weight: 35 }, { axis: "DEPTH", score: null, weight: null },
    { axis: "ACCURACY", score: 50, weight: 15 }, { axis: "ACCURACY", score: 80, weight: 15 },
  ] } });
  assert.deepEqual(result.map(x => [x.score, x.emptyLabel]), [[0,undefined],[null,"해당 없음"],[null,"미제공"],[null,"미제공"]]);
  for (const score of [-1, 101, NaN, Infinity, "60", undefined]) {
    assert.equal(buildFeedbackMetrics({ scoreBreakdown: { axes: [{ axis: "DEPTH", score, weight: 25 }] } })[1].emptyLabel, "미제공");
  }
});
test("옛 결과는 의도만 보완하고 명시적 null은 덮어쓰지 않는다", () => {
  assert.deepEqual(buildFeedbackMetrics({ intentAlignmentScore: 80 }).map(x => x.score), [80,null,null,null]);
  assert.equal(buildFeedbackMetrics({ intentAlignmentScore: 80, scoreBreakdown: { axes: [{ axis:"INTENT",score:null,weight:null }] } })[0].emptyLabel,"해당 없음");
});
test("면접관 코멘트는 면접 mode를 우선해 MULTI에서만 노출한다", () => {
  const feedback = { mode:"MULTI", personas:[{score:80,comment:"기술 코멘트"}] };
  assert.equal(buildFeedbackOverallContent(feedback,{mode:"SOLO"}).middleSection.showPersonaFeedback,false);
  assert.equal(buildFeedbackOverallContent(feedback,{mode:"MULTI"}).middleSection.showPersonaFeedback,true);
  assert.equal(buildFeedbackOverallContent(feedback).middleSection.showPersonaFeedback,true);
  assert.equal(buildFeedbackOverallContent({}).middleSection.showPersonaFeedback,false);
});
test("TEXT 음성 영역은 항상 숨기며 VOICE는 녹음 실패에도 표시한다", () => {
  for (const status of ["PENDING","READY","PARTIAL","UNAVAILABLE","FAILED"]) {
    assert.equal(buildSpeechAnalysis({status,answers:[]},"TEXT").visible,false);
    assert.equal(buildSpeechAnalysis({status,answers:[]},"VOICE").visible,true);
  }
});
test("옛 기록은 녹음 없음·분석 중을 구분한다", () => {
  assert.equal(buildSpeechAnalysis({status:"UNAVAILABLE",answers:[]},null).visible,false);
  assert.equal(buildSpeechAnalysis({status:"PENDING",answers:[]},null).visible,true);
  assert.equal(buildSpeechAnalysis({status:"FAILED",answers:[{}]},null).visible,true);
});

const stubUrl = `data:text/javascript;base64,${Buffer.from(`
export let draft;
export const calls=[];
export const reset = value => {draft=value;calls.length=0;};
export const currentOwnerKey=()=>"7";
export const loadSetupDraft=()=>draft;
export const saveSetupDraft=value=>(draft=value);
export const buildSoloInterviewPayload=async()=>({personaName:"test",type:"FRIENDLY",career:0,gender:"MALE"});
export const buildMultiInterviewPayload=async()=>({personaIds:[1,2]});
export const createInterview=async(body,key)=>{calls.push({body:structuredClone(body),key});return {data:{interviewId:56,userId:7}};};
`).toString("base64")}`;
const stub = await import(stubUrl);
const { module: { submitSetupDraft } } = await load("features/interview-page/setting-company/model/submitDraft.ts", Object.fromEntries([
  '"@/features/interview-page/interview/api"',
  '"@/features/interview-page/setting-interview/model/submitSoloInterview"',
  '"@/features/interview-page/setting-multi-interview/model/submitMultiInterview"',
  '"./draftStore"',
].map(path => [path, JSON.stringify(stubUrl)])));

test("새 SOLO/MULTI 제출은 선택한 답변 방식을 본문에 고정한다", async () => {
  for (const mode of ["SOLO","MULTI"]) for (const answerMode of ["text","voice"]) {
    const draftId=crypto.randomUUID();
    stub.reset({draftId,ownerKey:"7",mode,settings:{mode,answerMode},companyId:null,submission:null});
    await submitSetupDraft(draftId);
    assert.equal(stub.calls[0].body.answerMode,answerMode==="text"?"TEXT":"VOICE");
  }
});
test("옛 UNKNOWN 본문·요청키는 답변 방식 주입 없이 그대로 재전송한다", async () => {
  const draftId=crypto.randomUUID();
  const body={personaName:"old",type:"FRIENDLY",career:0,gender:"MALE"};
  const idempotencyKey=crypto.randomUUID();
  stub.reset({draftId,ownerKey:"7",mode:"SOLO",settings:{mode:"SOLO",answerMode:"text"},companyId:null,
    submission:{requestBody:body,idempotencyKey,interviewId:null,state:"UNKNOWN"}});
  await submitSetupDraft(draftId);
  assert.deepEqual(stub.calls,[{body,key:idempotencyKey}]);
  assert.equal("answerMode" in stub.calls[0].body,false);
});
