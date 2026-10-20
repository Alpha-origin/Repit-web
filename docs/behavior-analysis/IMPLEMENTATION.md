# 행동 분석 Web 구현 범위와 보완 계약

## #201 통합 보완 (2026-10-21)

- Web PR #189의 `29148cb` 구현을 중단 면접 정책이 반영된 브랜치에 재사용했다.
- 피드백 진입 시 `/api/interviews/get`을 조회해 최신 상태와 답변 방식을 사용한다. 목록에 완료로 남아 있어도 단건 조회가 중단·진행 중이면 결과·영상 요청을 차단한다.
- API [PR #120](https://github.com/Alpha-origin/Repit-api-server/pull/120)의 호환 규칙에 따라 **명시적 `answerMode: null`인 이전 면접은 VOICE로 정규화**한다. 필드 누락·알 수 없는 값은 음성으로 추정하지 않는다.
- FAILED의 공개 `error.message`를 표시한다. 다시 확인은 조회 오류·10분 상한·NO_RECORDING에서만 제공하고, RESULT_SCHEMA_UNSUPPORTED에서는 재분석을 숨긴다.
- 재분석 POST 응답 유실·409 뒤에는 영상 GET으로 접수 여부를 확인한다. 이 GET도 정책 409이면 기존 `onAnalysisError`로 결과와 PDF를 차단한다.
- LOW_FACE_COVERAGE·LOW_POSE_COVERAGE 판정은 반올림된 `coverageRatio` 대신 `denominatorMs / durationMs`를 사용해 API/Analysis의 0.8 경계 판정과 일치시켰다.
- 기존 업로드 store의 완료 전환으로 영상 GET을 다시 실행한다. multipart 실제 요청 → store 완료 → 결과 GET을 합성 파일과 계약 응답으로 검증했다.
- UI 플래그는 기본 OFF를 유지한다. 로컬 개발은 Git에서 제외되는 `.env.development.local`에 `VITE_VIDEO_ANALYSIS_UI_ENABLED=true`를 설정하거나 같은 환경변수로 `npm run dev`를 실행하면 활성화된다. 배포 빌드는 해당 배포 환경에서 별도로 설정해야 한다. 별도 브라우저 MediaPipe 추론·서버 간 분석 호출은 추가하지 않았다.
- 5개 지표는 수치·비율 막대·관찰 범위로 요약하고, 시간대별 결과는 영상 길이에 비례하는 막대 그래프로 표시한다. 0%와 측정 불가·낮은 관찰 범위를 구분한다.
- 긴 지표 설명·측정 시간·시간 표는 `상세 수치·설명 보기` 안에 둔다. PDF를 만들 때는 지정된 상세 영역만 복제본에서 펼쳐 원본 화면 상태를 바꾸지 않고 내용을 포함한다. 지표 선택은 키보드를 지원하는 기본 select와 별도 화살표 아이콘을 사용한다.

### 이번 검증과 실제 연동 범위

- lint·build 통과. 기존 router의 eslint-disable 경고 1건은 그대로다.
- Node 테스트 106개, 계약 fixture 18개·부정 변형 10개 통과.
- 최종 UI 기준 행동 결과·업로드 연결·PDF 브라우저 검사 41개 통과. 상세 접힘·지표 변경·모바일·PDF 복제본 펼침을 포함하며, 외부 폰트 요청은 테스트에서만 차단한다.
- 기존 중단 정책 13개, 내용 피드백 폴링 23개, 1:1·N:1 녹화 회귀 22개도 통합 과정에서 통과했다. 이 자동 검사는 가상 장치와 합성 응답을 사용한다.
- 실제 로그인 세션의 새 완료 음성 면접에서 `WAITING` → `ANALYZING` → 관찰 완료 전환과 behavior-v1의 5개 지표·시간 구간 표시를 확인했다. 로컬 5173에서도 새 화면과 실제 결과가 표시된다. 실제 영상·개별 관찰 수치·인증 정보는 이 저장소와 화면 예시에 포함하지 않는다.
- 실제 서버 재분석·복구·동시성, Safari/Edge 코덱과 모델 정확도·성능·원본 폐기는 별도 검증 대상이다. 위 성공은 이번 면접의 업로드 이후 결과 조회·화면 표시 경로에 대한 확인이며 운영 준비 완료를 뜻하지 않는다.
- [최종 화면 예시](images/behavior-ready.png)는 합성 fixture이며 실제 사용자 결과가 아니다.

아래는 PR #189의 원래 구현·검증 기록이며, 이번 통합에서 달라진 동작은 위 내용을 우선한다.

기준: 2026-10-20 fetch, `origin/main@87a7dde`, 선행 중단 면접 정책 `origin/codex/abandoned-interview-policy@80ce0cb`.

이 문서는 첨부 v1의 00~06보다 우선하는 구현 보완이다. 기존 확정 결정을 변경하지 않는다.

## 이번 구현

- 공통 fixture와 보조 검증기의 지표별 측정 불가 사유·공개 오류 retryable 검사를 보완한다.
- Web의 behavior-v1 응답 검사·GET·폴링·POST·이전 결과·5개 지표·시간 표·이벤트·PDF 포함 표시를 구현한다.
- [가정] 기존 중단 면접 PR #185 위에 쌓는다. 먼저 해당 PR을 병합해야 하며 이번 PR에서 그 변경을 중복 병합하지 않는다.
- [가정] 제품용 플래그는 `VITE_VIDEO_ANALYSIS_UI_ENABLED`이며 정확히 `true`인 빌드만 활성화한다. 기본 OFF다. 별도 의존성은 추가하지 않는다.
- 서버가 저장한 COMPLETED만 조회·재분석·표시 자격을 가진다. 텍스트 면접은 호출하지 않는다. 채점 성공·실패·대기와는 독립적이다.
- 영상 섹션은 음성 영역 바로 아래다. 내용 채점이 아직 없으면 음성 상태와 영상 영역을 별도로 표시한다. 정책 409 후 상태 확인은 기존 `onAnalysisError`를 사용하고 결과·PDF·진행 요청을 차단한다.
- 전체 영상 업로드 store의 현재 면접 상태를 사용한다. 완료 이벤트에 GET으로 갱신하고, 실패 해결은 기존 업로드 재시도/폐기 UI에 맡긴다.
- 분석 POST는 한번만 보낸다. 응답 유실·409 때 GET으로 접수 상태를 확인한다. 자동 POST 재전송은 없다.
- [가정] 재조회·재분석 도중 현재 면접의 마지막 검증 결과는 조회 오류에서 유지한다. 새 API 응답은 서버의 behavior를 우선하며 영상 변경에 따른 null을 임의로 이전 결과로 대체하지 않는다.
- [가정] 구 API의 추가 필드 누락은 미지원 안내로 처리한다. 호환용 raw result·임의 오류 message·summary는 화면 데이터로 추측하지 않는다. 지표 문장은 검증된 수치로 만든다.

## 서버 담당에게 필요한 공통 보완

- 00의 “종료·중단 여부 필터 추가 안 함”은 폐기한다. API는 COMPLETED만 신규 요청·자동/수동 재분석·재전송·복구·조회·늦은 콜백 반영을 허용한다. ABANDONED의 녹화 보존·업로드와 분석 실행은 분리한다.
- 기능 OFF의 기존 PENDING 복구보다 위 면접 자격 검사가 우선한다. 중단·미확정 상태에서 결과나 이전 결과를 노출하지 않는다.
- 89일은 기존 API의 요청 상한이며 90일 보관 승인으로 해석하지 않는다. 피드백 생성 후 원본 폐기(D5)의 삭제 트리거·진행 작업과의 관계·삭제 후 canRetry=false는 서버 폐기 명세에서 확정해야 한다. 이번 Web은 삭제 정책을 새로 만들지 않는다.
- API·Analysis의 요청 포장에는 필드를 추가하지 않는다. API 사용자 응답 확장은 기존 00 §6을 따른다. Chat에는 행동 데이터 필드를 추가하지 않는다.

## 후속 보완 및 검증

1. API: 위 COMPLETED 경계, BehaviorValidator·응답 투영·기능 OFF 복구, 중복/늦은 콜백과 두 DB connection 경쟁 검사.
2. Analysis: 실제 Face/Pose 실행기, package lock·모델 manifest/hash, PTS·집계·기하 검사, 공개 오류 사전.
3. 원본 폐기: D5와 내용·음성·행동 완료 시점의 관계, S3/로컬 파일/전사 삭제 담당·검증.
4. 실제 Chrome/Edge WebM·Safari H.264의 코덱/해상도 회귀. 기존 지원 장치를 임의로 막지 않도록 W2 녹화 변경은 이 검증과 함께 별도 진행한다.
5. 6명·30클립 평가와 별도 holdout, 30/60분 처리 시간·RSS·정확도/coverage. 합성 fixture 성공으로 대체하지 않는다.
6. 로컬에서 실제 S3·모델·콜백·복구·동시 재분석 연동 확인 후 UI 활성화 판단. 현재 배포·스테이징·운영 작업은 하지 않는다.

실행한 검사와 결과는 PR 및 인계 기록에 남긴다. 구현 완료는 Web 범위이며 전체 행동 분석 서비스의 완료를 뜻하지 않는다.

## 검증 결과 (2026-10-20)

- `npm run lint`: 통과, 기존 router의 미사용 eslint-disable 경고 1건.
- `npm run build`: 통과. 패키지 추가·lockfile 변경 없음.
- `node --test tests/*.test.mjs`: 전체 97개 통과(신규 행동 계약·표시 검사 15개 포함).
- `python3 docs/behavior-analysis/contracts/validate_contracts.py`: 18개 fixture·10개 부정 변형 통과.
- Chromium fixture 브라우저: 신규 행동 27개, 기존 중단 정책 13개, 기존 피드백 폴링 23개, 총 63개 시나리오 통과.
- 신규 브라우저 검사는 상태·0%/null·미측정 timeline 숨김·채점 독립·이전 결과·POST 중복/유실·409·오류·10분 상한·hidden/visible·텍스트/중단/flag OFF 호출 0회·모바일·업로드 완료·전환 취소·이탈·음성 아래 배치·실제 PDF 생성까지 확인했다.
- `codex review --uncommitted`: 재분석 POST 거절 후 GET 확인 때 거절 안내가 지워지는 P2를 수정했다. 재검토에서 추가 지적 없음. 위 브라우저 검사는 구현 세션에서 별도로 실행했다.
- [화면 예시](images/behavior-ready.png)는 합성 fixture의 결과이며 실제 모델 추론 화면이 아니다.

브라우저 재실행은 기존 외부 Playwright 런타임을 사용한다. `PLAYWRIGHT_MODULE_PATH`에 `playwright/index.mjs` 경로를 지정한다. 동작이 다른 두 Vite 서버를 사용한다.

```sh
# 터미널 1: UI 활성 fixture 대상
VITE_VIDEO_ANALYSIS_UI_ENABLED=true npm run dev -- --host 127.0.0.1 --port 5185 --strictPort
# 터미널 2: 기본 비활성 회귀 대상
VITE_VIDEO_ANALYSIS_UI_ENABLED=false npm run dev -- --host 127.0.0.1 --port 5186 --strictPort
# 터미널 3: 아래 환경변수와 PLAYWRIGHT_MODULE_PATH를 함께 지정
INTERVIEW_TEST_ORIGIN=http://127.0.0.1:5185 BEHAVIOR_OFF_ORIGIN=http://127.0.0.1:5186 node tests/behavior-analysis.browser.mjs
```

위 PR #189 당시에는 실제 모델·Safari/Edge·S3·서버 통합·원본 삭제를 실행하지 않았다. 이후 #201에서 확인한 실제 연동 범위와 남은 검증은 문서 상단을 따른다. PR 생성은 배포·병합 승인과 별개다.
