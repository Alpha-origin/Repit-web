# 행동 분석 구현 명세 — 04. API

- 레포: `Alpha-origin/Repit-api-server`, `main` `6acc8e4`.
- 공통 계약: [00](00-overview.md), 신규 행동 데이터: [01](01-behavior-contract.md).
- 완료 기준: 기존 업로드·작업 복구를 유지하면서 검증된 행동 결과·정확한 상태·재분석을 사용자에게 제공한다.

## 1. 재사용할 코드

기준 경로는 `src/main/java/repit/repit_api_server/`다.

| 파일·영역 | 처리 |
|---|---|
| `domain/userdata/recording/service/InterviewRecordingService.java` | S3 업로드·소유권·형식·크기 검사 유지 |
| `domain/userdata/analysis/service/VideoAnalysisService.java` | 기존 request/chain/복구/최종 영상·재분석 유지, 조회 투영·enabled 경계 보완 |
| `domain/userdata/analysis/service/VideoAnalysisCallbackHandler.java` | 식별자 검증에 데이터 검증·종료 문서 멱등성 추가 |
| `domain/userdata/analysis/controller/VideoAnalysisController.java` | 기존 GET·retry·callback 경로 유지 |
| `domain/userdata/analysis/entity/VideoAnalysisEntity.java` | 기존 requestPayload·result JSONB·오류 컬럼 사용 |
| `domain/userdata/analysis/repository/VideoAnalysisRepository.java` | 기존 최종 영상·PENDING 제한 유지, terminal row lock/CAS 보완 |
| `global/client/AiServerApi.java`, `AiServerClient.java` | 기존 분석 요청·조회·요청 인증 재사용 |
| `global/auth/CallbackPaths.java` | 영상 콜백 인증 필수 유지 |

신규 패키지 제안: `domain/userdata/analysis/behavior/`에 BehaviorData DTO, BehaviorValidator, BehaviorResultReader, VideoAnalysisViewFactory를 둔다. Jackson wire 이름은 camelCase다.

## 2. DB와 마이그레이션

기준 스키마는 `src/main/resources/db/migration/V26__video_analysis.sql`의 `video_analysis`·`unmatched_callback`이다. **행동 지표별 새 테이블·컬럼은 필요 없다.** 원문 callback과 data를 기존 JSONB에 저장하고 GET에서 정규화한다.

- `analysis_id/request_id/job_id/recording_id/chain_id` 의미를 유지한다.
- 기존 PENDING 부분 unique index를 유지한다.
- `unmatched_callback.reason`의 `INVALID_BODY/UNKNOWN_REQUEST/ID_MISMATCH`를 사용한다. 행동 데이터 오류는 INVALID_BODY의 detail에 정제된 필드 경로·코드를 기록한다.
- 기존 V26을 수정하지 않는다. 실제 추가 스키마 필요성이 생기면 구현 시점의 최신 다음 Flyway 번호를 선택한다.
- 모델 지표는 API가 다시 계산하거나 다른 버전으로 덮어쓰지 않는다.

## 3. S3 업로드·분석 대상·비활성화

### 3-1. 업로드 유지

`FULL_INTERVIEW`는 file·kind만 받고, 답변별 questionId/endReason은 금지한다. 소유권·파일 헤더·1GB 상한·MP4/WebM 검사와 저장 실패 보상을 유지한다.

S3 키는 기존 UUID 기반 불변 키를 사용한다. 원본을 같은 키에 덮어쓰지 않는다. 브라우저의 signed PUT 전환이나 Web→Analysis 직접 호출을 새로 만들지 않는다.

업로드가 저장된 뒤 분석 준비가 실패해도 성공 업로드를 실패 응답으로 바꾸지 않는다. sweep이 복구한다. 사용자에게 원본 파일을 다시 올리게 해 중복 영상을 만드는 방식으로 분석 오류를 해결하지 않는다.

### 3-2. sweep enabled 경계 보완

현재 `sweep()`은 enabled=false면 전체를 반환한다. 이를 아래 세 단계로 분리한다.

1. enabled=true일 때만 새 최종 영상의 AUTO 요청을 만든다.
2. **enabled와 무관하게 기존 PENDING의 check·동일 requestId 재전송·작업 GET 복구를 수행한다.** 신규 UUID를 만드는 자동 재분석은 이 단계에 포함하지 않는다.
3. enabled=true일 때만 retryable 종료 실패에서 새 AUTO 재분석을 만든다.

콜백은 disabled여도 받는다. 기능 스위치는 기존 작업의 취소 API가 아니다. 결과가 저장된 면접은 disabled여도 읽을 수 있다. READY/PARTIAL 데이터를 숨기지 않는다.

기존 요청 횟수·6시간 처리 상한·89일 원본 제한·uploaded-after cutover를 유지한다. cutoff 이전 영상을 이번 기능 활성화 때 일괄 분석하지 않는다.

## 4. 사용자 GET 응답

경로: `GET /api/interviews/{interviewId}/video-analysis`.

기존 소유권 검사를 유지한다. 미인증 401, 타인 면접 403, 존재하지 않는 면접 404. 인증 실패를 데이터 없음 200으로 숨기지 않는다.

기존 response record에 00 §6의 필드를 추가한다. **wrapper는 저장소 기존 ApiResponse의 `{success:true,data:...}`를 그대로 사용**한다. 새로운 code·message wrapper를 만들지 않는다. `data` 예제는 `contracts/api-ready.json` 참고.

### 4-1. 최신 요청 상태와 표시 결과를 따로 고르기

1. 소유권 확인 → 최종 FULL_INTERVIEW 녹화 선택.
2. 그 recordingId에 속한 analysis 목록만 조회한다. 이전 recording의 결과는 제외한다.
3. 가장 큰 analysisId를 latest로 정한다. 최신 상태 계산은 기존 재분석 pending 규칙을 유지한다.
4. analysisId 역순으로 ready/partial 원문 중 **BehaviorData v1 타입·의미 검증을 통과한 첫 결과**를 behavior로 정한다.
5. latestAnalysisId·behaviorAnalysisId를 문자열로 채우고 다르면 showingPreviousResult=true다.
6. 기존 `result`는 기존 조회 의미인 가장 최근 저장된 완료 원문을 유지한다. behavior와 같은 행이라고 가정하지 않는다.

직전 결과가 있어도 최신 상태는 ANALYZING·FAILED일 수 있다. Web이 재분석 중이라는 안내와 이전 결과를 동시에 표시할 수 있게 한다.

### 4-2. 상태와 reasonCode

reasonCode는 아래의 보조 사유다. HTTP 오류 상태를 대체하지 않는다. 우선순위는 아래 순서다.

| 상황 | status | reasonCode |
|---|---|---|
| answerMode=TEXT | NONE | TEXT_INTERVIEW |
| 영상 없음 | NONE | NO_RECORDING |
| 기존 요청 없음, 영상이 cutoff 이전 | NONE | UPLOADED_BEFORE_ENABLED |
| 기존 요청 없음, 영상 분석 가능 기간 지남 | NONE | SOURCE_EXPIRED |
| 기존 요청 없음, 기능 disabled | NONE | SERVICE_DISABLED |
| 기존 요청 없음, enabled이고 대상 영상 있음 | WAITING | null |
| 최신 PENDING 또는 자동 재분석 예정 | ANALYZING | null |
| 최신 READY/PARTIAL, 지원 행동 데이터 있음 | READY/PARTIAL | null |
| 최신 완료 문서지만 구/미지원 data | 기존 READY/PARTIAL 유지 | RESULT_SCHEMA_UNSUPPORTED |
| 최신 UNAVAILABLE | FAILED | 정제된 analysis/file 공개 오류 code |
| 최신 FAILED | FAILED | 정제된 공개 오류 code |

텍스트인데 과거 버그로 영상이 있으면 행동 분석을 노출하지 않는다. no recording 상태는 업로드 중일 수도 있으므로 Web의 로컬 업로드 작업 상태를 우선 안내한다.

추가 허용 reason: 기존 공개 오류 사전(00·Analysis docs), `BEHAVIOR_NOT_MEASURABLE`, API 서비스 오류 `NOT_ACKNOWLEDGED/JOB_NOT_FOUND/PROCESSING_OVERDUE/INVALID_RESULT/RESULT_EXPIRED` 및 방어 기본값 `UNKNOWN_ERROR`. DB 임의 문자열을 그대로 UI용 코드로 사용하지 않는다.

### 4-3. error와 canRetry

- error는 최신 요청의 UNAVAILABLE/FAILED에만 채운다. PARTIAL의 지표 미측정은 error가 아니다.
- message는 코드별 한국어 공개 사전에서 만든다. DB errorMessage·exception.toString·응답 body를 그대로 반환하지 않는다.
- retryable은 최종 사용자에게 자동 분석 버튼 허용 여부가 아니다. code의 복구 특성일 뿐이며, 버튼은 canRetry를 따른다.
- `canRetry = enabled && 기존 retryBlockedReason(...) == null`. 자동 재분석이 예정되어도 false.
- 요청이 없거나 기간 초과·cutoff 이전·READY·진행 중·비재시도 오류·사용자 한도 도달이면 false.

## 5. 콜백·조회 복구의 검증

### 5-1. 인증·상한·포장

- `POST /api/analyses/video/callback`, X-Internal-Token 필수. 토큰 누락·불일치는 body 저장 전에 401.
- decoded UTF-8 callback body 최대 1MiB. 초과는 413, DB에 초과 원문을 남기지 않는다. 프록시·애플리케이션 상한을 함께 설정한다.
- 기존 schemaVersion="1", job/request/session/interview/user/video ID 대조를 유지한다.
- root/result/analysis 상태의 일치, ready/partial data 객체·error null, unavailable data null·error 존재, failed result null·최상위 error 존재를 검증한다.
- BEHAVIOR_NOT_MEASURABLE와 기존 공개 오류·retryable 대응표를 API에도 반영한다.

### 5-2. 행동 data 검증

콜백과 `applyRecovered()`는 **같은 검증기**를 사용한다. 01 §11을 모두 검사한다. 구조·범위를 통과해도 잘못된 bin 합·분모·ready 판정이면 INVALID_BODY다.

알 수 없는 선택적 envelope 필드는 기존 호환 방식을 유지하되, behavior-v1 내부는 고정 계약으로 검사한다. data schemaVersion 미지원이면 원문을 unmatched_callback에 보관하고 현재 결과로 반영하지 않는다.

인증된 잘못된 결과의 원문을 제한 내에서 별도 보관하는 데 성공하면 기존 정책대로 200. 저장 실패면 5xx. 검증 실패를 READY로 저장하지 않는다. 작업 조회에서 계속 부정합이면 기존 INVALID_RESULT 종료·운영 경보 경로로 간다.

### 5-3. 중복·늦은 콜백·경쟁

- 해당 request 행에 row lock 또는 조건부 갱신을 사용한다.
- 같은 request/job의 **동일한 종료 JSON 의미값** 재도착: no-op 200. key 순서 차이는 같은 값으로 본다.
- 같은 request/job의 서로 다른 종료 문서: 기존 저장 문서 유지, INVALID_BODY로 따로 보관. ready가 늦은 failed로 바뀌지 않는다.
- API가 timeout 등으로 로컬 FAILED 처리했지만 원격 종료 원문이 아직 없는 행은 식별자·스키마가 맞는 늦은 첫 결과를 저장할 수 있다.
- 옛 request의 결과는 옛 행에만 저장된다. 최신 요청·새 영상 결과를 덮지 않는다.
- callback이 먼저 와서 jobId를 기록한 뒤 202 응답이 와도 같은 ID만 확인·반영한다. 다른 jobId로 교체하지 않는다.
- 기존 `@DynamicUpdate`만으로 이 멱등성을 보장했다고 보지 않는다. 두 DB connection의 경쟁 검증이 필요하다.

## 6. 사용자 재분석

경로: `POST /api/interviews/{interviewId}/video-analysis/retry`, 성공 202 + GET과 같은 data 모양.

- 프론트 중복 클릭 방지만 믿지 않는다. **영상/면접 소유 행을 transaction 안에서 잠근 뒤** latest·사용자 chain 수·재분석 가능성을 다시 검사하고 새 row를 만든다.
- 기존 PENDING 부분 unique index는 동시 활성 요청 방어로 유지한다. 영상당 사용자 chain 두 개 제한도 경쟁 상황에서 보장한다.
- 새 requestId·chainId·S3 서명 URL. 같은 requestId의 저장 본문을 사용자 재분석으로 수정하지 않는다.
- 한도·진행 중·disabled·READY·원본 접근 불가 정책 위반은 기존 409. 업로드 파일을 다시 받는 endpoint가 아니다.
- 같은 원본의 PARTIAL은 최대 두 번 사용자 재분석을 허용하되, 개선을 보장하지 않는다.
- 202 유실 뒤 다시 눌러 409가 오면 Web은 상태 GET을 통해 이미 접수됐는지 확인한다.

## 7. 로그·관측·보관

현재 일반 외부 API 본문 logging에 requestPayload의 signed URL이나 callback data가 포함될 수 있으므로 경로별 마스킹을 확인한다. 신규 GET·callback 로그에 data 전체·얼굴 좌표·원본 URL·토큰을 기록하지 않는다.

관측값: 영상 분석 상태 수, 최초 요청까지 지연, PENDING 최고 나이, 공개 오류별 건수, INVALID_BODY/ID_MISMATCH, 재분석 한도 거절. 사용자 식별자를 metric label로 넣지 않는다. 운영 trace에 필요한 analysisId/requestId는 접근 제한된 로그에서만 사용한다.

기존 결과·unmatched 원문은 현재 개인정보 보관·삭제 정책의 적용 대상이다. 이번 기능이 무기한 보관을 승인하는 것은 아니다. 실제 원본 S3 lifecycle과 모델 평가 클립 보관은 06의 배포 확인에 남긴다.

## 8. 테스트

| 위치·유형 | 필수 확인 |
|---|---|
| BehaviorValidator 단위 | schema 예제, 잘못된 합/비율/ID/범위/NaN/unknown schema/빈 성공 |
| VideoAnalysisServiceTest | disabled no-request=NONE, disabled in-flight check 유지, 기존 결과 유지, cutoff/기간/최종 영상 |
| VideoAnalysisPersistenceTest | JSONB 동일성, 중복·상충 종료 콜백, 늦은 첫 결과, 두 connection 경쟁, 조회 복구 동일 검증 |
| Controller | 인증·소유권·1MiB·413·200/5xx 정책·응답 추가 필드 |
| retry | 사용자 2회 제한·동시 POST·READY 거절·PARTIAL 허용·기능 disabled |
| 하위 호환 | 기존 result/status/canRetry, 기존 음성·피드백·업로드 동작 유지 |

기존 `./gradlew test`를 실행한다. Postgres 기반 persistence 검증을 생략하고 H2/mock 테스트만으로 JSONB·부분 unique index·row lock 검증을 통과 처리하지 않는다. DB 테스트를 실행하지 못한 경우 미검증이라고 인수 기록에 남긴다.
