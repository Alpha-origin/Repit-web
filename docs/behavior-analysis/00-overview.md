# 행동 분석 구현 명세 — 00. 공통 개요와 계약

- 작성일: 2026-10-20, Asia/Seoul / 버전: v1
- 상태: 구현 기준안. 아래의 **기존**은 코드 확인 결과, **신규**는 이번 명세의 설계다.
- 지표·수치·임계값은 [01](01-behavior-contract.md), 서버별 구현은 02~05, 배포와 인수는 [06](06-delivery-and-acceptance.md)을 따른다.

## 0. 기준 코드와 확인 범위

| 프로젝트 | 저장소 | 브랜치·확인 커밋 |
|---|---|---|
| API | `Alpha-origin/Repit-api-server` | `main` `6acc8e46bbb15ae07a139d40a87ac51fa6472723` |
| Analysis | `Alpha-origin/repit-analysis-server-v2` | `main` `3b2103dbcaab2b6a3f33402eae6a3cd19d0a356b` |
| Chat | `Alpha-origin/Repit-chat-server` | `main` `95f2cc0f57dadba8ad70c1064e252949dc13d2a7` |
| Web | `Alpha-origin/Repit-web` | `main` `87a7ddec55fc7dc795eed01ae9d2449c27e56354` |

구현 시작 시 최신 브랜치와 대조한다. 아래 파일 경로는 위 커밋 기준이다. 배포 환경변수·실제 S3·운영 모델 가동 여부는 확인하지 않았다. 기존 테스트 파일의 존재를 확인했으며 이 명세 작성 중 프로젝트 테스트를 실행한 것은 아니다.

### 0-1. 이미 있는 것

| 프로젝트 | 기존 구현 | 이번에 할 일 |
|---|---|---|
| Web | MediaRecorder, 답변별 음성·전체 영상 업로드, 앱 범위 업로드 큐 | 영상 호환성 보완, 행동 결과 조회·표시·재분석 |
| API | S3 업로드, 최종 전체 영상 선택, 서명 URL, 영상 분석 접수·복구·콜백·조회·재분석 | 데이터 스키마 검증, 화면용 응답, 비활성·기존 결과·중복 콜백 처리 보완 |
| Analysis | 인증된 영상 접수·조회, 다운로드·전체 디코딩, SQLite 작업·워커·콜백·보관, 외부 프로세스 분석기 연결부 | 실제 얼굴·포즈 분석 프로그램과 행동 데이터 계약 |
| Chat | 면접 세션, 질문·답변, 종료 기록 전달 | 신규 행동 데이터 처리 없음 |

Analysis 기본값은 `UnconfiguredVideoAnalyzer`다. 유효한 영상도 `unavailable / ANALYZER_NOT_CONFIGURED`를 반환한다. `docs/video-api.md`와 `docs/video-analysis.md`에 모델·행동 데이터 미정이 명시되어 있다. 따라서 이 작업은 프론트 연결만으로 완료되지 않는다.

## 1. 기능 범위

### 1-1. 이번 버전에 포함

1. 기존 `FULL_INTERVIEW` 영상 하나를 대상으로 하는 면접 전체 단위 분석.
2. 얼굴 관찰 비율, 정면 방향 추정 비율, 어깨 수평 관찰 비율, 상체 안정 구간 비율, 미소 형태 관찰 비율.
3. 지표별 측정 불가 사유·측정 가능 시간·전체 영상 대비 관찰 범위.
4. 최대 60개 시간 요약 구간과 최대 60개 관찰 이벤트.
5. 결정적 규칙으로 작성하는 짧은 관찰 문장. LLM·유료 비전 API 호출 없음.
6. 상태 표시, 이전 결과 유지, 서버가 허용하는 재분석, 장애·시간 초과 복구.
7. 실제 Chrome WebM·Safari MP4와 실제 S3·콜백을 통한 연동 검증.

### 1-2. 포함하지 않는 것

- 실시간 면접 중 행동 평가·알림, 질문별 행동 평가. 현재 영상과 질문의 공통 시간축 계약이 없어 임의 연결하지 않는다.
- 눈동자 기반 시선·아이콘택트, 눈 깜빡임 횟수, 손동작·손의 얼굴 접촉 횟수. v1의 5Hz 관찰만으로 정확성을 보장하지 않는다.
- 감정·긴장·자신감·성격·정직성·채용 적합성 추론, 얼굴 인식·사용자 식별.
- 행동 종합 점수, 행동 결과를 기존 채점·신뢰성·기업 적합도에 반영하는 변경.
- 영상 다시보기·구간 이동·영상 다운로드 API. 이벤트 시간은 텍스트로 표시한다.
- 자동 모델 학습, 영상 학습 데이터 수집, 기업·직무별 임계값, 여러 호스트로 영상 워커 확장.

이 범위는 이번 문서의 신규 제안이다. 이전 문서에서 사용자가 확정한 결정으로 표시하지 않는다.

## 2. 서버별 책임

```text
Web: 카메라 원본 녹화 → multipart 업로드
                         ↓
API: 소유권·파일 검사 → S3 불변 키 저장 → DB 녹화 기록
                         ↓ 업로드 뒤 2분 유예 / 30초 sweep
API: 분석 요청 기록 → S3 GET 서명 URL → POST /analysis/video
                         ↓
Analysis: 다운로드 → 검사·전체 디코딩 → 실제 행동 분석 → 고정 종료 문서
                         ↓ callback 또는 작업 GET 복구
API: 인증·식별자·데이터 검증 → 원문 JSONB 저장 → 사용자 응답 투영
                         ↓
Web: 상태·지표·구간·측정 불가·재분석 표시

Chat: 기존 세션 ID·질문·답변·종료 기록 전달 경로 유지
```

Web은 Analysis나 S3에 직접 분석을 요청하지 않는다. Analysis는 API DB에 직접 접근하지 않는다. Chat은 영상·landmark·행동 결과를 세션에 넣지 않는다.

## 3. 기존 미디어·작업 계약 유지

| 항목 | 기준 |
|---|---|
| 업로드 | `POST /api/interviews/{interviewId}/recordings`, multipart `file`, `kind=FULL_INTERVIEW` |
| 답변 음성 | `kind=ANSWER`, 별도 음성 분석 경로 유지 |
| 대상 | 가장 나중의 `recordingId`인 전체 영상. 저장된 `COMPLETED`에만 분석 허용. `ABANDONED`·미확정 종료는 요청·재시도·복구·조회·늦은 콜백 반영을 차단하며 녹화 업로드·보존과 분리 |
| 영상 상한 | 1,000,000,000바이트, 60분, 회전·SAR 반영 1920×1080 경계 이내, 60fps 이하 |
| 분석 가능 형식 | WebM VP8/VP9, MP4 H.264. MIME·확장자만으로 신뢰하지 않음 |
| URL | S3 HTTPS GET 서명 URL, 기존 API TTL 6시간. 공개 URL로 바꾸지 않음 |
| 요청 중복 | `(sessionId, requestId)`와 본문 지문. 동일 재전송은 기존 jobId, 내용 변경은 409 |
| API 동일 요청 재전송 | 기존 본문 그대로, 최대 5회·1시간 |
| 자동 재분석 | 기존 `retryable=true` 실패만 같은 chain 내 총 5개 작업까지 |
| 사용자 재분석 | 기존 영상당 최대 2개 사용자 chain, READY 제외 |
| 콜백 누락 | 10분 이후 작업 GET 복구, 처리 상한 6시간. 새 요청을 무조건 만들지 않음 |
| 보관 | Analysis 결과 90일·식별 기록 추가 90일·로컬 원본 24시간. API 원본 재분석 허용은 기존 89일 기준 |

API 코드의 89일 제한은 원본 90일 정책을 전제한다. 실제 S3 lifecycle이 그렇게 설정됐는지는 배포 담당자가 별도로 확인한다. API DB 결과의 삭제·보관 기간을 이번 명세가 새로 연장하지 않는다.

**보완:** 위 기간은 기존 코드 설명이며 보관 승인으로 해석하지 않는다. 확정 결정 D5의 피드백 생성 후 원본 폐기는 삭제 트리거·진행 작업 수명·담당 명세가 필요하다. 미완료 항목은 IMPLEMENTATION을 따른다.

## 4. API → Analysis 요청 (변경 없음)

```json
{
  "requestId": "video-unique-request",
  "sessionId": "session-42",
  "interviewId": "42",
  "userId": "7",
  "callbackUrl": "https://api.example.com/api/analyses/video/callback",
  "video": {
    "videoId": "501",
    "fileUrl": "https://example-bucket.s3.ap-northeast-2.amazonaws.com/interview-recordings/42/unique.webm?X-Amz-Signature=example",
    "contentType": "video/webm",
    "fileSize": 10000000,
    "uploadedAt": "2026-10-20T01:00:00Z"
  }
}
```

예제 URL은 네트워크 호출용이 아니다. 실제 서명 파라미터를 모두 포함한 URL은 API가 생성한다. 모든 ID는 서버 간 문자열, 사용자 API의 면접 경로 ID는 기존 number 관례를 유지한다.

- `POST /analysis/video`, `GET /analysis/video/jobs/{jobId}`: `X-Internal-Token=VIDEO_API_TOKEN`.
- API 발신 값은 `VIDEO_ANALYSIS_API_TOKEN`, Analysis 수신 `VIDEO_API_TOKEN`과 같아야 한다.
- 콜백: Analysis `APP_INTERNAL_CALLBACK_TOKEN` = API `INTERNAL_AUTH_TOKEN`. 요청 토큰과 별개다.
- 기존 allowlist·SSRF·리다이렉트 거부·서명 URL 비기록 규칙을 유지한다.
- 요청의 필드는 추가하지 않는다. Analysis의 엄격한 `extra=forbid` 계약을 깨뜨리지 않는다.

## 5. Analysis → API 종료 콜백

기존 최상위 `schemaVersion: "1"`과 포장 구조를 유지한다. **신규 행동 데이터는 `result.analysis.data` 안에 넣는다.** 최상위 버전과 행동 버전을 혼동하지 않는다.

```json
{
  "schemaVersion": "1",
  "jobId": "job-001",
  "requestId": "video-unique-request",
  "sessionId": "session-42",
  "interviewId": "42",
  "userId": "7",
  "status": "ready",
  "result": {
    "videoId": "501",
    "durationMs": 60000,
    "status": "ready",
    "analysis": {
      "status": "ready",
      "data": "이 위치는 실제로 01의 BehaviorData JSON 객체",
      "error": null
    },
    "error": null
  },
  "error": null
}
```

위의 설명용 `data` 문자열을 실제로 전송하지 않는다. 실행 가능한 전체 객체 예제는 `contracts/callback-ready.json`을 사용한다.

| 콜백 상태 | 의미 | data / error |
|---|---|---|
| `ready` | 다섯 지표의 충분한 관찰 범위를 확보 | BehaviorData / null |
| `partial` | 적어도 한 지표는 사용 가능, 일부 지표·범위 부족 | BehaviorData / null. 지표별 사유는 data 안 |
| `unavailable` | 모든 지표 측정 불가, 또는 기존 파일·분석기 오류 | null / 공개 오류 |
| `failed` | 기존 종료 문서 생성 실패 | `result=null`, 최상위 error |

추가 공개 오류 `BEHAVIOR_NOT_MEASURABLE`는 `retryable=false`다. 검은 화면·다중 인물·짧은 영상 등 같은 원본을 반복 요청해도 개선되지 않는 경우다. 인프라 오류를 이 코드로 숨기지 않는다.

`GET /analysis/video/jobs/{jobId}`의 `status`는 기존 `processing/completed/failed`다. `completed` 안에 ready·partial·unavailable 콜백이 들어간다. GET의 `result`는 **콜백 본문 전체**다.

## 6. API → Web 응답

기존 `GET /api/interviews/{interviewId}/video-analysis`와 `POST /api/interviews/{interviewId}/video-analysis/retry`를 재사용한다. 기존 `status/result/canRetry`를 유지하고 아래 필드를 추가한다. HTTP 응답의 공통 wrapper는 기존 `ApiResponse`를 따른다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `status` | `NONE/WAITING/ANALYZING/READY/PARTIAL/FAILED` | 기존 상태. 최신 요청의 상태 |
| `result` | object 또는 null | 기존 호환용 콜백 원문. Web 신규 UI는 이 필드를 직접 파싱하지 않음 |
| `canRetry` | boolean | 서버가 계산한 재분석 가능 여부 |
| `reasonCode` | string 또는 null | 상태·측정 불가의 공개 사유. 허용값은 04 §4 |
| `error` | `{code,message,retryable}` 또는 null | 최신 실패의 정제된 공개 오류. 내부 예외·URL 없음 |
| `behavior` | BehaviorData 또는 null | 검증된 최신 표시 가능 행동 데이터 |
| `latestAnalysisId` | string 또는 null | 최신 요청의 API analysis_id |
| `behaviorAnalysisId` | string 또는 null | behavior가 속한 API analysis_id |
| `showingPreviousResult` | boolean | behavior가 있고 두 analysis ID가 다르면 true |

`result`의 최근 완료 문서가 unavailable여도 이전 ready·partial 데이터는 `behavior`에 남을 수 있다. 두 필드가 항상 같은 행이라는 가정을 하지 않는다. 이전 영상의 결과는 새 최종 영상에 붙이지 않는다.

`partial`은 종료 상태다. Web은 `WAITING/ANALYZING`일 때만 폴링한다. 조회 재시도(GET)와 분석 재요청(POST)을 구분한다.

## 7. 비활성화와 하위 호환

- 신규 업로드 분석·자동 재분석·사용자 재분석만 `VIDEO_ANALYSIS_ENABLED`로 제어한다.
- **신규 변경:** 비활성화해도 이미 접수한 PENDING 작업의 조회·동일 요청 복구와 콜백 수신은 계속한다. 기존 `sweep()`의 전체 조기 반환을 분리한다.
- 비활성 상태이며 요청·결과가 없는 영상은 `NONE / SERVICE_DISABLED`다. 기존의 무기한 WAITING을 피한다.
- 이미 저장된 결과는 비활성화해도 조회 가능하며 재분석만 금지한다.
- 기존 행동 data가 없거나 구버전·미지원 버전이면 안전하게 안내한다. 임의 기본 점수로 채우지 않는다.
- Web UI 배포 flag 기본 false. API·분석 서버 검증 후 켠다. 이 flag는 기존 녹화·업로드 자체를 끄지 않는다.

## 8. 데이터 사용과 화면 원칙

관찰 문장은 "카메라 정면 방향으로 추정된 구간은 관찰 가능 시간의 80%입니다"처럼 쓴다. "눈을 피한다", "긴장했다", "성실하지 않다", "합격 가능성이 낮다"는 식으로 바꾸지 않는다. 미소 비율을 높이라는 코칭이나 높을수록 좋은 색상도 사용하지 않는다.

영상 전체에는 질문 청취·대기·카메라 끄기 구간이 포함된다. 답변 중 지표라고 표시하지 않는다. 카메라가 꺼진 검은 화면과 얼굴이 화면 밖에 있는 상황은 구별할 수 없으므로 공통으로 "얼굴을 관찰하지 못한 구간"이라고 표시한다.

## 9. 기준 소스

- [API 영상 서비스](https://github.com/Alpha-origin/Repit-api-server/blob/6acc8e46bbb15ae07a139d40a87ac51fa6472723/src/main/java/repit/repit_api_server/domain/userdata/analysis/service/VideoAnalysisService.java)
- [API 콜백·저장](https://github.com/Alpha-origin/Repit-api-server/blob/6acc8e46bbb15ae07a139d40a87ac51fa6472723/src/main/java/repit/repit_api_server/domain/userdata/analysis/service/VideoAnalysisCallbackHandler.java)
- [Analysis 영상 API 계약](https://github.com/Alpha-origin/repit-analysis-server-v2/blob/3b2103dbcaab2b6a3f33402eae6a3cd19d0a356b/docs/video-api.md)
- [Analysis 운영·프로세스 연결 계약](https://github.com/Alpha-origin/repit-analysis-server-v2/blob/3b2103dbcaab2b6a3f33402eae6a3cd19d0a356b/docs/video-analysis.md)
- [Web 전체 녹화 종료·업로드](https://github.com/Alpha-origin/Repit-web/blob/87a7ddec55fc7dc795eed01ae9d2449c27e56354/src/features/interview-page/interview/model/useInterviewSession.ts)

01의 임계값과 신규 응답 필드는 이 소스에 이미 존재하는 계약이 아니라 **이번 구현을 위한 신규 설계**다.
