# 중단 면접 Web 연동

기준: `origin/main@87a7ddec55fc7dc795eed01ae9d2449c27e56354` (2026-10-20 fetch).
사용자 제공 공통 계약(00)·Web 명세(04)·구현 명세 README를 따른다.

## 범위와 기술 가정

- 이번 구현은 Web만 대상으로 한다. 서버가 확정한 `COMPLETED`만 완료 화면·피드백·음성 조회 자격을 갖는다.
- [가정] 상태 없는 END·QUIT 실패/404는 기존 `GET /api/interviews/get?interviewId=…`로 확인한다. 조회 제한은 기존 저장 확인과 같은 15초다. 확정 상태를 확인하지 못하면 기존 종료 복구 UI에서 재시도·저장 확인 안내를 제공한다.
- [가정] 구 END는 이벤트 `type=END`로 식별한다. message 문자열로 정상 완료를 추정하지 않는다. 확정된 종료 상태는 ref에 보관하며 늦은 반대 응답이 바꾸지 못한다.
- [가정] 정책 409는 오류 문구로 구분하지 않는다. 저장 상태를 재조회해 COMPLETED일 때만 기존 중복 재채점 복구를 허용한다. 상태 확인 실패도 결과를 가리고 재조회 안내를 표시한다.
- 기존 생성 전 최신 상태 검사, 중복 Promise 공유, 종료 Promise 공유, 녹화 업로드·실패 재시도·장치 해제는 유지한다. 파일 업로드가 면접 상태를 바꾸거나 분석을 요청하지 않는다.
- 강제 나가기는 기존의 명시적 선택을 유지한다. 서버 상태를 새로 확정하거나 완료로 추정하지 않는다.

## 변경

- REST QUIT, 답변 응답, WebSocket END의 확정 상태를 종료 경로에 반영한다. ABANDONED 이벤트 수신 후 QUIT를 재전송하지 않는다. QUIT가 COMPLETED를 반환하면 완료 화면으로 이동한다.
- 피드백 409 또는 생성 전 정책 거절에서 저장 상태를 확인하고 텍스트 요청을 취소한다. 결과·이전 점수를 비우고 음성 조회/폴링도 취소한다. 정책 거절 뒤 GET→POST나 중복 피드백 GET으로 우회하지 않는다.
- 피드백 화면·PDF·음성 enabled에 COMPLETED 조건을 적용한다. 비교 점수 후보에도 COMPLETED 필터를 적용한다.
- 이 기준 main에는 영상 분석 조회·폴링 구현이 없다. 새 영상 API를 추측해 추가하지 않았다. 영상 호출을 추가할 때도 같은 상태 조건과 취소 처리가 필요하다.

## 서버별 선행 변경과 검증 경계

- Chat: 종료 상태의 불변성, END.status, QUIT의 실제 최종 상태 반환과 outbox 기록 보존.
- API: 저장된 COMPLETED 상태를 자동·수동·업로드·복구·재전송·콜백·조회에서 강제. 중단 대기 dispatch의 SKIPPED 정리와 과거 결과 노출 차단. Web의 상태 확인은 이를 대체하지 않는다.
- Analysis v2: API가 interviewStatus를 먼저 전송한 뒤 `/feedback/solo`, `/feedback/multi` 수신 경계에서 COMPLETED만 필수 허용. Web은 이 필드를 보내지 않는다.
- Auth·Config·구 Analysis 변경은 없다. 배포와 기존 데이터 정리는 이번 Web 코드 검증에 포함하지 않는다.

## 검증 방법

```sh
npm run lint
npm run build
node --test tests/*.test.mjs
```

기존 `docs/interview-recording.md`의 외부 Playwright 런타임과 로컬 Vite fixture 방식을 사용한다.
`PLAYWRIGHT_MODULE_PATH`와 `INTERVIEW_TEST_ORIGIN`을 지정하고 아래를 실행한다.

```sh
node tests/interview-complete-flow.browser.mjs
node tests/interview-recording.browser.mjs
node tests/interview-recovery.browser.mjs
node tests/interview-terminal-status.browser.mjs
node tests/feedback-abandoned-policy.browser.mjs
```

추가 시나리오는 두 END 상태, 구 END, QUIT 404/실패·재시도, 늦은 완료 응답, 직접 URL,
과거 결과 차단, 텍스트·음성·재채점 409, 완료 면접 중복 접수 복구, 이전 중단 점수 제외를 검증한다.
모의 API/소켓/음성 인식과 Chromium MediaRecorder를 사용한다. 실제 서버 분석 호출 0회·늦은 업로드 뒤 분석 차단·S3·실제 모델 호출은 API/통합 인수 테스트에서 별도 검증해야 한다.

## 검증 결과 (2026-10-20)

- lint 통과(기존 router의 미사용 eslint-disable 경고 1건), build 통과, 단위 테스트 82개 통과.
- 브라우저: 정상 완료 13, 녹화 22, 종료 복구 10, 종료 상태 19, 피드백 정책 13, 피드백 폴링 23개 시나리오(총 100개).
- `codex review --uncommitted`의 P2 1건을 반영했다. 폴링 종료 시 취소된 controller를 재채점·음성 정책 상태 확인에서 재사용하지 않도록 요청 수명을 분리했다. PENDING→FAILED→재채점 및 PENDING→SUCCEEDED→음성 409 회귀를 추가했다.
- 기존 브라우저 테스트는 취소된 POST의 response 대신 requestfailed를 검증하고, 최신 마이페이지의 aria-label과 답변 방식 선택 상태 반영을 기다리도록 보완했다.
