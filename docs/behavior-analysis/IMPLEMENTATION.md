# 행동 분석 Web 구현 범위와 보완 계약

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

실제 모델·Safari/Edge·S3·서버 통합·원본 삭제는 실행하지 않았다. 기본 UI OFF를 유지하고 선행 PR #185와 API 응답 확장 뒤 연동 검증한다. PR 생성은 배포·병합 승인과 별개다.
