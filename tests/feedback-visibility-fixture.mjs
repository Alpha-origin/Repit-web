// 브라우저 수동 회귀용 독립 fixture. 실제 서버/로그인/유료 모델을 사용하지 않는다.
import { createServer } from "vite";

const port = Number(process.env.FEEDBACK_FIXTURE_PORT ?? 5183);
process.env.VITE_AUTH_URL = `http://127.0.0.1:${port}`;
process.env.VITE_API_URL = `http://127.0.0.1:${port}`;
const calls = new Map();
const scenarios = [
  [4201,"SOLO","TEXT"], [4202,"SOLO","VOICE"], [4203,"MULTI","TEXT"], [4204,"MULTI","VOICE"],
  [4205,"SOLO",null], [4206,"MULTI",null], [4207,"SOLO",null], [4208,"SOLO","VOICE"], [4209,"SOLO",null],
];
const interviews = scenarios.map(([interviewId,mode,answerMode]) => ({interviewId,userId:7,mode,answerMode,status:"COMPLETED",createdAt:"2026-10-19T01:00:00Z",personaIds:mode==="MULTI"?[1,2]:[1]}));
const feedback = (id) => ({ interviewId:id,mode:interviews.find(x=>x.interviewId===id)?.mode,status:"SUCCEEDED",totalScore:89,intentAlignmentScore:100,reliabilityScore:98,
  summary:"테스트 답변에서 기술 선택의 근거와 대안을 확인했습니다.",scoreBreakdown:{scoringVersion:"axis-v1",axes:[{axis:"INTENT",score:100,weight:35},{axis:"DEPTH",score:60,weight:25},{axis:"SPECIFICITY",score:95,weight:25},{axis:"ACCURACY",score:100,weight:15}]},
  strengths:["테스트 강점"],improvements:["테스트 보완점"],frequentWords:[{word:"서버",count:3}],
  personas:[{personaId:1,personaRole:"TECH",score:90,comment:"기술 면접관의 테스트 코멘트",answeredCount:1},{personaId:2,personaRole:"HR",score:88,comment:"인사 면접관의 테스트 코멘트",answeredCount:1}],
  feedbacks:[{questionId:21,questionContent:"테스트 질문",intention:"테스트 의도",userAnswer:"테스트 답변",modelAnswer:"테스트 모범 답변",comment:"테스트 문항 코멘트"}],
});
const server = await createServer({server:{host:"127.0.0.1",port,strictPort:true},plugins:[{name:"feedback-visibility-fixture",configureServer(vite){vite.middlewares.use((req,res,next)=>{
  const url = new URL(req.url,"http://fixture.invalid");
  const json=(data,code=200)=>{res.statusCode=code;res.setHeader("Content-Type","application/json");res.end(JSON.stringify(data));};
  if(url.pathname==="/__feedback-fixture") {res.setHeader("Content-Type","text/html; charset=utf-8");res.end('<h1>피드백 표시 회귀 fixture</h1>'+scenarios.map(([id,mode,answer])=>`<p><a href="/main/feedback/overall/${id}">${id} ${mode} ${answer??"LEGACY"}</a></p>`).join(''));return;}
  if(url.pathname==="/__feedback-calls") return json(Object.fromEntries(calls));
  if(!url.pathname.startsWith("/api/")) return next();
  calls.set(url.pathname,(calls.get(url.pathname)??0)+1);
  if(url.pathname.endsWith("/refresh")) return json({accessToken:"fixture-only-token"});
  if(url.pathname.endsWith("/me")) return json({data:{id:7,name:"회귀 테스트",nickname:"회귀 테스트",email:"test@example.com"}});
  if(url.pathname==="/api/interviews/getAll") return json({success:true,data:interviews});
  if(url.pathname==="/api/feedbacks/getAll") return json({success:true,data:[]});
  if(url.pathname==="/api/answer/getAll") return json({success:true,data:[]});
  if(url.pathname==="/api/feedbacks") return json({success:true,data:feedback(Number(url.searchParams.get("interviewId")))});
  const match=url.pathname.match(/^\/api\/interviews\/(\d+)\/audio-analysis$/);
  if(match){const id=Number(match[1]);if(id===4207)return json({message:"fixture 조회 실패"},503);
    const reads=calls.get(url.pathname);const status=id===4208?(reads===1?"PENDING":"READY"):id===4209?"PENDING":[4202,4205].includes(id)?"UNAVAILABLE":"READY";
    return json({success:true,data:{status,answers:[4202,4205,4209].includes(id)?[]:[{questionId:"21",recordingId:"1"}],canRetry:false}});}
  return json({message:"fixture에서 정의하지 않은 API"},404);
});}}]});
await server.listen();
console.log(`Fixture: http://127.0.0.1:${port}/__feedback-fixture`);
