# 행동 분석 구현 명세 — 05. Web

- 레포: `Alpha-origin/Repit-web`, `main` `87a7dde`.
- 공통: [00](00-overview.md), data: [01](01-behavior-contract.md), API: [04](04-api.md).
- 신규 UI는 기존 음성 분석·종합 채점 표시와 독립한다. 채점 결과가 늦거나 실패했다고 행동 조회를 막지 않는다.

## 1. 화면 흐름과 범위

```text
음성·영상 면접 → 기존 전체 녹화·종료·업로드 큐
  → 종합 피드백: [영상 행동 관찰]
      상태·사유 → 다섯 지표 → 시간 요약 → 관찰 구간 → 관찰 문장
      필요 시 [다시 확인] GET / [영상 다시 분석] POST

텍스트 면접 → 행동 영역 숨김·행동 API 호출 없음
```

새 route는 만들지 않는다. 종합 피드백 페이지의 **음성 영역 바로 아래**에 영상 섹션을 추가한다. 상세 질문 피드백에는 질문별 수치를 새로 만들지 않는다.

## 2. API·타입·모델 파일 (신규)

```text
src/features/feedback-page/api/getVideoAnalysis.ts
src/features/feedback-page/api/retryVideoAnalysis.ts
src/features/feedback-page/model/videoAnalysisTypes.ts
src/features/feedback-page/model/validateVideoAnalysis.ts
src/features/feedback-page/model/feedbackBehavior.ts
src/features/feedback-page/model/useFeedbackVideoAnalysis.ts
src/widgets/feedback-page/behavior-analysis/index.tsx
src/widgets/feedback-page/behavior-analysis/style.ts
src/widgets/feedback-page/behavior-analysis/type.ts
```

- 기존 `apiInstance`·access token·refresh·`extractErrorMessage`를 사용한다. 별도 fetch client·Analysis host·S3 client를 만들지 않는다.
- `getVideoAnalysis(interviewId, signal)` → GET. `retryVideoAnalysis(interviewId, signal)` → POST. API wrapper의 data를 읽는다.
- fetch timeout은 15초. 사용자 취소/이탈 abort는 오류 toast를 만들지 않는다.
- 알 수 없는 status·잘못된 number·지원하지 않는 behavior-v1이면 "결과 형식을 확인할 수 없습니다"로 처리한다. 타입 단언만으로 서버 응답을 신뢰하지 않는다.
- 모든 metric key·enum·비율·범위·timeline 경계·숫자의 finite를 검사한다. API의 의미 검증을 브라우저가 대체하는 것은 아니다.
- 신규 API가 아직 배포되지 않아 추가 필드가 없으면 `behavior=null`로 안전하게 표시한다. 기존 result의 중첩을 추측해 UI 데이터로 변환하지 않는다.

## 3. 조회 훅과 폴링

### 3-1. 시작 조건

`VITE_VIDEO_ANALYSIS_UI_ENABLED=true`, 유효한 interviewId, 면접 조회 성공, 저장 상태 `COMPLETED`, answerMode !==TEXT면 조회한다. answerMode가 구버전 데이터에서 null이면 조회를 허용하고 API의 reasonCode를 따른다. 정책 409 이후 상태 재확인·요청 취소는 기존 중단 면접 처리와 공유한다.

**기존 `useFeedbackAudioAnalysis(..., content !== null)`의 채점 완료 gating을 복사하지 않는다.** 행동 영역은 면접 정보가 확인되면 채점 로딩·실패 화면에서도 접근 가능해야 한다. 페이지 error 레이아웃을 분리한다.

### 3-2. 폴링 규칙

1. 첫 GET 즉시. 응답 뒤 WAITING/ANALYZING일 때만 5초 후 다음 요청. setInterval 대신 setTimeout으로 중첩 방지.
2. 한 자동 조회 session의 상한은 실제 경과 10분. 종료 시 서버 상태를 FAILED로 바꾸지 않고 "분석이 지연되고 있습니다. 나중에 다시 확인해 주세요"와 GET 다시 확인 버튼 표시.
3. 탭 hidden이면 새 요청을 예약하지 않는다. visible 복귀 시 deadline 이내면 즉시 GET, 이미 지났으면 지연 안내. 서버 작업은 계속된다.
4. READY/PARTIAL/FAILED/NONE은 자동 폴링 종료. PARTIAL은 완료 상태다.
5. interviewId·flag·answerMode 변경·unmount 시 AbortController·timer·visibility listener 정리. 늦은 응답이 새 면접을 덮지 않도록 key/generation 검사.
6. 네트워크 오류·5xx·429는 마지막 결과 유지 + 조회 오류 안내, 자동 요청을 멈추고 GET 다시 확인을 제공한다. 무한 재시도하지 않는다.
7. 401은 기존 인증 흐름, 403은 권한 안내, 404는 면접/API 배포 문제 안내. 모두 분석 FAILED로 저장하지 않는다.

### 3-3. 업로드와의 연결

현재 면접의 FULL_INTERVIEW 업로드 작업이 진행 중이면 "면접 영상을 업로드하고 있습니다"를 먼저 보여준다. 실패면 기존 업로드 재시도/폐기 UI를 안내한다. 분석 POST로 업로드 실패를 해결하지 않는다.

API가 NO_RECORDING인데 로컬 큐에 진행 중 작업이 있으면 업로드 완료 이벤트 후 즉시 GET을 다시 한다. 다른 탭에서 업로드 상태가 없어도 [다시 확인] GET을 제공한다. 영상을 올리지 않은 상태를 분석 실패라고 단정하지 않는다.

## 4. 상태별 화면

| 조건 | 문구·동작 |
|---|---|
| 초기 GET | 영상 행동 관찰 정보를 불러오고 있습니다 |
| WAITING | 영상 분석을 기다리고 있습니다. 업로드 완료 후 잠시 시간이 걸릴 수 있습니다 |
| ANALYZING | 영상 행동을 분석하고 있습니다. 완료되면 자동으로 표시됩니다 |
| READY | 관찰 완료. 지표·품질·시간 구간 표시 |
| PARTIAL | 일부 관찰 완료. 측정 가능한 항목만 표시하고 항목별 사유 표시 |
| FAILED | reasonCode의 공개 사유·GET 다시 확인·canRetry일 때만 POST 버튼 |
| NONE/SERVICE_DISABLED | 영상 행동 관찰 기능을 준비 중입니다 |
| NONE/NO_RECORDING | 분석할 면접 영상이 없습니다. 로컬 업로드 상태가 있으면 그 상태 우선 |
| NONE/UPLOADED_BEFORE_ENABLED | 이 영상은 행동 관찰 기능이 적용되기 전에 업로드되었습니다 |
| NONE/SOURCE_EXPIRED | 이 영상은 다시 분석할 수 있는 보관 기간이 지났습니다 |
| TEXT_INTERVIEW | 행동 영역 숨김 |
| RESULT_SCHEMA_UNSUPPORTED | 이 결과는 현재 화면에서 지원하지 않는 형식입니다. 빈 차트·가짜 0점 금지 |

오류 코드별 세부 문구:

- BEHAVIOR_NOT_MEASURABLE: 행동 지표를 측정할 수 있는 구간이 충분하지 않습니다.
- ANALYZER_NOT_CONFIGURED: 영상 행동 분석기가 아직 준비되지 않았습니다.
- SOURCE_ACCESS_DENIED_OR_EXPIRED: 영상 파일에 접근할 수 없습니다. 파일이 만료됐다고 단정하지 않습니다.
- PROCESSING_TIMEOUT/PROCESSING_OVERDUE: 영상 분석이 제한 시간 안에 완료되지 않았습니다.
- 나머지: 정제된 API error.message 또는 일반 안내. 내부 예외 문자열은 사용하지 않는다.

## 5. 결과 UI

### 5-1. 상단 안내·지표 카드

제목: **영상 행동 관찰**. 공통 설명:

> 면접 전체 영상에서 관찰한 참고 정보입니다. 0.2초 간격의 추정치이며 질문을 듣거나 기다리는 구간도 포함됩니다. 머리 방향은 실제 눈동자 시선과 다르고, 감정이나 면접 점수를 평가하지 않습니다.

다섯 카드는 고정 순서로 표시한다.

| metric | 이름 | 보조 설명 |
|---|---|---|
| faceVisibleRatio | 얼굴 관찰 | 얼굴이 한 명 관찰된 시간의 비율 |
| headFacingRatio | 정면 방향 추정 | 머리가 카메라 정면 범위로 추정된 비율. 실제 시선 아님 |
| shoulderLevelRatio | 어깨 수평 관찰 | 양쪽 어깨선이 설정 범위에서 수평인 비율 |
| upperBodyStableRatio | 상체 안정 구간 | 상체 중심 이동이 설정 기준 이하인 비율 |
| smileShapeRatio | 미소 형태 관찰 | 미소와 비슷한 입꼬리 형태. 말하는 입 모양과 혼동될 수 있음 |

- AVAILABLE: `{value*100}%`, `측정 가능 {denominator} / 전체 {duration}`, `관찰 범위 {coverage*100}%`.
- UNAVAILABLE: `측정 불가` + unavailableReason의 사유. value=null을 0%로 표시하지 않는다.
- 부족한 coverage를 신뢰도·정확도·점수로 표시하지 않는다.
- 얼굴·어깨가 잘렸으면 촬영 구도를 점검하라는 일반 도움말을 제공할 수 있으나 인성·건강 판정을 만들지 않는다.
- 빨강/초록 합격 판정·5개 평균 종합 점수·미소가 높을수록 좋은 progress 색상은 금지한다. 중립색과 숫자·텍스트를 사용한다.

### 5-2. 시간 요약과 이벤트

- timeline은 최대 60개의 구간을 표시하는 metric 선택형 막대/표로 만든다. 기존 차트 라이브러리가 필요하지 않으면 HTML/CSS로 구현한다.
- 분모가 0인 구간은 "측정 불가", 관찰 범위 30% 미만이면 "관찰 범위 낮음"으로 구분한다. 미관찰을 0%로 연결하지 않는다.
- 선택한 전체 metric이 UNAVAILABLE이면 그 지표의 세부 수치를 대신 공개하지 않고 측정 불가 안내를 보여준다.
- 이벤트는 `mm:ss–mm:ss`, 60분 경계는 `hh:mm:ss`. start는 초 내림, end는 초 올림으로 표시하고 실제 ms는 접근성 설명에 유지한다.
- 이벤트 종류별 중립 문구는 01 §8을 그대로 사용한다. 플레이 버튼·seek 링크를 만들지 않는다. 다시보기 API는 이번 범위에 없다.
- eventsTruncated면 "앞부분 관찰 구간 최대 60개를 표시합니다" 안내.
- 빈 이벤트는 "표시 기준을 충족한 관찰 구간이 없습니다". 완벽한 자세라고 평가하지 않는다.

### 5-3. 이전 결과·PDF·접근성

- showingPreviousResult=true면 "다시 분석 중/최근 분석을 완료하지 못해 이전 결과를 표시합니다" 배지. 최신 상태 문구와 이전 수치를 함께 표시한다.
- retry를 누를 때 기존 behavior를 즉시 비우지 않는다. 새 응답의 behaviorAnalysisId가 바뀌면 교체한다.
- PDF에는 화면에 실제 표시된 결과·측정 불가·이전 결과 배지·기준 설명을 포함한다. 버튼은 기존 data-html2canvas-ignore 관례로 제외한다.
- 좁은 화면에서는 카드 1열·timeline 표 가로 스크롤 또는 행 목록. tooltip만으로 필수 설명을 숨기지 않는다.
- status는 aria-live=polite, 버튼은 키보드 접근 가능. 5초마다 focus·스크린리더 전체 내용을 초기화하지 않는다.

## 6. 사용자 재분석

- canRetry=true일 때만 **영상 다시 분석** 버튼을 제공한다. 조회 재시도의 **다시 확인** 버튼과 분리한다.
- 클릭하면 POST 한 번, 진행 중 disabled. 성공하면 응답 반영 후 상태 polling session을 새로 시작한다.
- 서버 409는 분석 상태를 GET으로 새로 확인한다. 이미 진행 중이면 그 상태 표시, 한도·기간 문제면 정제된 메시지.
- POST 응답 유실·네트워크 실패는 접수 여부 미확정이다. 자동 POST 재전송 없이 GET으로 확인한다.
- 재분석에 화면 전체 loading을 걸거나 채점·음성 결과를 지우지 않는다. PARTIAL의 개선을 보장하지 않는다.

## 7. 녹화 호환성 보완

기존 `useInterviewMedia.ts`, `useMediaRecorder.ts`, `mediaRecording.ts`, `useInterviewSession.ts`, `interviewRecordingStore.ts`를 확인한다.

1. 이상적 해상도 1280×720, frameRate ideal=30/max=60. 가능한 경우 width max=1920/height max=1080을 적용하고 track settings를 확인한다. 장치 제약 실패는 설명 가능한 오류로 처리한다.
2. MediaRecorder 지원 후보를 `video/webm;codecs=vp8,opus`, `video/webm;codecs=vp9,opus`, 명시 H.264/AAC MP4 순으로 검사한다. **분석용 영상에 bare video/mp4 또는 video/webm fallback을 무조건 사용하지 않는다.** Safari·Chromium 실제 파일로 확인된 후보만 허용한다.
3. 후보가 없으면 녹화 전에 "이 브라우저에서 분석 가능한 영상 형식을 녹화할 수 없습니다"를 표시한다. 확장자만 바꾸거나 HEVC를 H.264로 표시하지 않는다. 텍스트 면접으로 다시 설정할 수 있게 기존 경로 안내.
4. 실제 코덱 판정의 최종 책임은 Analysis의 ffprobe다. isTypeSupported만으로 호환 검증이 끝났다고 처리하지 않는다.
5. 카메라 OFF는 기존처럼 복제 track에도 반영한다. 검은 구간이 생길 수 있으며 결과는 얼굴 미관찰로 표시한다.
6. 전체 녹화의 시작·정지·마지막 청크 확정·종료 Promise·장치 해제·업로드 재시도·로그아웃 보호를 유지한다.
7. 60분/1GB를 넘기려고 할 때 잘라서 제출하지 않는다. 이번 작업에서 면접 시간을 임의 종료하지 않는다. 업로드 전에 파일 크기 상한을 확인하고 기존 복구·폐기를 안내한다. 서버 제한은 그대로 유효하다.

코덱 제한으로 기존에 지원되던 장치가 제외될 수 있으므로 06의 브라우저 실검증을 배포 gate로 삼는다. 영향이 큰 경우 무검증 bare MIME으로 우회하지 말고 검증된 후보를 계약에 추가한다.

## 8. flag와 수정 파일

- 신규 env: `VITE_VIDEO_ANALYSIS_UI_ENABLED`, 기본 false. 문자열 "true"만 true로 처리한다.
- flag=false이면 신규 행동 GET·POST·위젯을 비활성화한다. 기존 녹화·음성 분석은 유지한다.
- 종합 페이지 `src/pages/feedback-page/feedback-overall/index.tsx`에 독립 상태 영역 추가.
- 녹화 관련 네 파일은 필요한 호환성 변경만 수행한다. 그 외 레이아웃·질문·기업·채점 코드를 대규모 변경하지 않는다.
- optional extra/패키지를 새로 설치할 필요는 없다. 기존 문서의 다른 기능 프로토타입 승인 요구를 가져오지 않는다.

## 9. 테스트·완료 조건

| 검증 | 내용 |
|---|---|
| API parsing | schema 예제, 필드 누락·unknown schema·NaN·0%·null 구별 |
| 훅 | 초기 GET, 5초 polling, terminal stop, 10분 지연, hidden/visible, abort·면접 전환·늦은 응답 |
| UI | 5개 지표, PARTIAL·미측정·이전 결과·경고·timeline 빈값·60개 절삭 |
| retry | POST 1회·버튼 disabled·202·409·응답 유실 후 GET |
| 독립성 | 채점 실패/대기 중에도 행동 표시, 행동 실패해도 음성·채점 유지 |
| 업로드 | 전체 영상 pending·실패·완료가 분석 상태와 연결, 중복 녹화/업로드 없음 |
| 브라우저 | 실제 Chrome/Edge WebM, Safari H.264 MP4, 권한 거부·카메라 OFF·텍스트 장치 미요청 |
| 화면 | desktop/mobile·키보드·상태 읽기·PDF |

기존 `npm run lint`, `npm run build`를 통과한다. 저장소 기존 Playwright 회귀 방식에 맞춰 `tests/behavior-analysis.browser.mjs`와 상태 fixture 검증을 추가한다. 실제 모델 정확도 검증은 Analysis·06 담당이며 Web mock 테스트로 대신하지 않는다.
