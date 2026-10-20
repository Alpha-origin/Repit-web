# 행동 분석 구현 명세 — 06. 작업 인계·배포·인수

- 작성일: 2026-10-20. 공통은 [00](00-overview.md), 지표 기준은 [01](01-behavior-contract.md).
- 문서·mock·단위검사만 완료한 상태와 실제 모델·S3 연동·운영 배포를 구별한다.

## 1. PR 단위와 선행 조건

| 순서 | 담당 | 제안 브랜치 | 산출물 | 선행 |
|---|---|---|---|---|
| A1 | Analysis | `codex/behavior-contract` | DTO·오류·집계·schema·기하/시간축 unit tests | 00·01 계약 |
| A2 | Analysis | `codex/behavior-model` | 실제 Face/Pose CLI·manifest·lock·process 연결·실제 영상 QA | A1 |
| P1 | API | `codex/behavior-projection` | DTO·의미검증·응답 투영·disabled 경계·멱등성·경쟁 테스트 | 계약 fixture로 병행 가능 |
| W1 | Web | `codex/behavior-feedback` | GET·polling·카드·구간·재분석·fixture UI | P1 전 fixture로 병행 가능 |
| W2 | Web | `codex/behavior-recording-compat` | 명시 코덱·제약·실제 browser 녹화 회귀 | W1과 독립 가능 |
| Q1 | 통합 담당 | `codex/behavior-integration-qa` | 실제 S3/모델/callback/브라우저 증빙·배포표 | A2·P1·W1·W2 |
| C1 | Chat | 변경 PR 없음 | 기존 종료·식별자 회귀 결과 | 통합 시 확인 |

위는 작업 분할안이며 실제로 브랜치·PR을 생성한 것은 아니다. 분담 구현은 가능하지만 병합·배포 전 공통 fixture와 계약이 일치해야 한다.

## 2. 각 담당자에게 주는 작업 지시

### Analysis

00·01·02와 contracts를 기준으로 실제 행동 분석기를 만든다. 기존 영상 파이프라인을 교체하지 않는다. 릴리스 manifest·package lock·모델 파일 hash·모델 출처·라이선스 정보를 산출한다. ready/partial/unavailable를 실제 모델·영상으로 증명한다. 가짜 analyzer가 만든 ready만으로 완료 처리하지 않는다.

### API

00·01·04와 동일 fixture를 기준으로 기존 영상 분석 연결을 보완한다. raw result 호환을 유지하며 behavior·사유·이전 결과 표시 정보를 추가한다. 비활성화 때 기존 작업을 버리지 않고 신규 접수만 멈춘다. 콜백·작업 조회 검증을 하나로 만들고 중복·늦은 결과·재분석 경쟁을 DB에서 검증한다.

### Web

00·01·05와 API fixture로 UI부터 구현한다. 행동 조회는 채점 완료와 독립시킨다. 0%와 측정 불가를 구별하고, 시선·감정·면접 점수로 표현하지 않는다. 네트워크 실패 후 POST를 자동 반복하지 않는다. 실제 브라우저에서 Analysis가 지원하는 코덱으로 녹화되는지 확인한다.

### Chat

03의 회귀만 확인한다. 전체 영상 분석을 위해 새로운 Redis 필드·HTTP 호출·프롬프트·질문별 시간 offset을 만들지 않는다.

## 3. 공통 자동 검증

| 항목 | 기대 |
|---|---|
| schema 예제 | ready·partial BehaviorData 구조와 의미 검증 통과 |
| outer callback | 모든 ID·상태·포장 일치, data schema 별도 버전 |
| 0%·null | 유효한 0%는 숫자, 측정 불가는 null/사유 |
| 분모 | 0≤N≤D≤영상길이, coverage/value 분수 일치 |
| timeline | 전 영상 연속 커버, 최상위 합과 동일 |
| 이벤트 | 2초 이상, 범위·순서·같은 종류 비중첩, 최대60 |
| 작업 | 동일 요청 재전송 멱등, callback/GET 결과 동일 검증 |
| 재분석 | 동시 요청·최대2 user chain·기존 결과 유지 |
| 스위치 | 신규 접수 OFF여도 기존 작업 완료·조회·콜백 유지 |
| UI | terminal polling 종료, 전환/unmount cleanup, 오류 독립 |

`contracts/validate_contracts.py`는 이 문서에 포함한 JSON 예제·수치 정합성을 확인하는 보조 도구다. 구현 저장소의 실제 검증기·통합 테스트를 대신하지 않는다. JSON Schema validator가 준비된 환경에서는 `behavior-data.schema.json`도 적용한다.

## 4. 실제 모델 품질 확인

### 4-1. 평가 클립

개발자가 사용 권한을 가진 성인 자원자의 녹화·승인된 평가 미디어만 쓴다. 평가용 영상·얼굴 crop을 Git·일반 이슈에 올리지 않는다. 실제 사용자 녹화를 자동 수집하거나 학습에 재사용하지 않는다.

최소 **6명·30개 클립·합계 30분 이상**을 준비한다. 이는 배포 전 최소 표본이며 인구 집단 전반의 정확도를 입증하는 규모가 아니다. 각 사람·촬영 환경이 한 가지 조건만 담당하도록 편중시키지 않는다.

| 조건 | 필수 포함 |
|---|---|
| 정면·단일 인물 | 밝은 환경, 어깨 포함 |
| 방향 변화 | 좌우·상하 머리 방향, 카메라 roll·높이 변화 |
| 어깨·몸 | 수평·기울임·천천히 이동·일시 움직임 |
| 얼굴 형태 | 무표정·미소·말하기, 안경·부분 가림 |
| 실패·부족 | 저조도·작은 얼굴·어깨 잘림·다중 인물·빈 화면 |
| 파일·시간 | Chrome VP8·VP9·Safari H.264, VFR·회전·SAR, 짧은 영상 |

사람 평가자가 각 지표의 관찰 가능/불가 및 시간 구간의 조건 충족 여부를 표기한다. 20% 이상은 두 명이 독립 주석하고 불일치를 조정한다. 표정은 "행복"이 아니라 미소와 비슷한 형태 유무만 표기한다.

### 4-2. 사전 배포 품질 gate (제안값)

숫자는 이번 명세의 초기 배포 기준이며 현재 달성했다고 주장하지 않는다.

- 표준 촬영 조건: 얼굴 유무 시간 가중 F1≥0.90.
- 관찰 가능한 정상 조건: 머리 방향·어깨 수평·상체 안정·미소 형태 각각 시간 가중 F1≥0.80. 지표별 false positive/negative·coverage도 함께 공개한다.
- 클립별 전체 비율의 사람 주석 대비 절대오차 중앙값≤10%p. 전체 평균 하나만으로 특정 지표 실패를 감추지 않는다.
- 관찰 불가 정답 구간의 90% 이상을 해당 지표 집계에서 제외한다. 다중 얼굴의 첫 얼굴을 조용히 선택하면 실패다.
- 저조도·가림·말하기 등 조건별 결과를 분리한다. 실패 조건에서 보장 범위를 줄이거나 UNAVAILABLE 처리하는 것은 가능하나 정책·version·문서를 같이 바꾼다.
- 30분 영상과 최대 입력 길이 60분 영상에서 처리 timeout·RSS·출력 크기 확인. 900초 분석 제한·기존 자원 제한을 넘어가면 배포 gate 실패.

평가 결과가 기준 미달이면 flag는 OFF로 유지하고 모델/측정 정책을 보완한다. 임계값을 평가 결과에 맞춰 바꾸면 조정에 사용하지 않은 별도 holdout 클립으로 다시 평가한다. 최종 manifest·version·평가 기준·결과를 같은 인수 보고서에 묶는다.

## 5. 실제 연동 인수 시나리오

| # | 실행 | 기대·증빙 |
|---|---|---|
| 1 | Chrome에서 정상 SOLO 음성·영상 면접 완료 | 실제 전체 파일 S3 저장, API requestId/jobId, modelVersion 확인, ready/partial UI |
| 2 | MULTI 동일 실행 | 사용자/면접/영상 연결 정확, 행동 결과가 면접관별 점수로 분해되지 않음 |
| 3 | macOS Safari MP4 녹화 | 실제 H.264 ffprobe 통과, 원본 끝까지 decode·추론·콜백 |
| 4 | 카메라 OFF 구간·어깨 잘림 | 부분 결과·항목 사유, 측정 불가를 0%로 표시하지 않음 |
| 5 | 짧은 영상·다중 인물 | 정한 품질 정책으로 partial/unavailable, 무조건 ready 금지 |
| 6 | 콜백 수신 API 일시 중단 | Analysis 콜백 예산 유지, API 작업 GET 복구, 한 종료 결과만 표시 |
| 7 | 분석 POST의 202 응답만 유실 | 같은 requestId·본문 재전송, 동일 jobId, 새 작업 폭증 없음 |
| 8 | 서명 URL 접근 실패 | 공개 오류 표시, 허용된 경우 새 requestId·새 URL로만 재분석 |
| 9 | 사용자 두 탭 동시 재분석 | 진행 중1개·user chain 최대2, 직전 결과 유지 |
| 10 | 재분석 도중 과거 콜백·상충 중복 | 옛 행에만 반영, 최신 화면·기존 고정 종료 문서 보호 |
| 11 | UI 이탈·새 면접·hidden tab·10분 경과 | timer/요청 정리, 늦은 응답 혼입 없음, 지연과 실패 구별 |
| 12 | 기능 OFF·서비스 재시작 | 신규 작업 없음, 기존 PENDING·callback/GET 복구는 끝남 |
| 13 | 텍스트 면접 | 카메라·마이크·행동 API 미요청, 기존 채점 정상 |
| 14 | 행동 오류·채점 오류 각각 주입 | 반대편 결과와 음성 분석 표시가 독립 |
| 15 | 원본 cutoff 이전·기간 초과 | NONE 사유·재분석 금지, 과거 원본 대량 분석 없음 |
| 16 | 모바일·키보드·PDF | 카드·구간·사유·이전 결과 설명 읽기 가능 |

실행하지 못한 시나리오는 BLOCKED/미검증으로 남긴다. mock·localhost S3 대체를 실제 S3 검증 성공으로 기록하지 않는다.

## 6. 배포 설정과 순서

### 6-1. 설정 대응표

| 담당 | 설정 | 조건 |
|---|---|---|
| Analysis | VIDEO_ENABLED=true | 영상 접수/조회 활성 |
| Analysis | VIDEO_API_TOKEN | API 요청 토큰 수신 |
| Analysis | APP_INTERNAL_CALLBACK_TOKEN | API INTERNAL_AUTH_TOKEN과 일치 |
| Analysis | VIDEO_ANALYZER__BACKEND=process 및 02의 경로·버전 | 실제 모델 manifest·hash·추론 준비 |
| Analysis | source/callback allowlist | 실제 S3·API HTTPS 호스트 정확히 일치 |
| API | VIDEO_ANALYSIS_API_TOKEN | Analysis VIDEO_API_TOKEN과 일치 |
| API | INTERNAL_AUTH_TOKEN | Analysis 콜백 토큰과 일치 |
| API | VIDEO_ANALYSIS_ENABLED | 최초 false, 인수 후 true |
| API | VIDEO_ANALYSIS_UPLOADED_AFTER | 실제 활성화 cutover 시각 ISO-8601+offset |
| API | CALLBACK_BASE_URL | Analysis에서 접근 가능한 외부 HTTPS 주소 |
| Web | VITE_VIDEO_ANALYSIS_UI_ENABLED | 인수 후 true. 빌드 시 env 반영 |

### 6-2. 순서

1. API 수신 계약·검증·조회 변경을 배포한다. 신규 분석 flag=false. 기존 PENDING 처리를 끊지 않는다.
2. Analysis 모델 release·의존성·오류/data 계약을 배포한다. 실제 모델 smoke·작업 레인·콜백 인증을 확인한다.
3. Web을 flag=false로 배포하고 스테이징에서만 true로 실제 경로를 검증한다.
4. 4·5절 인수와 서버 자원/원본 lifecycle 확인을 마친다.
5. 운영에서 VIDEO_ANALYSIS_UPLOADED_AFTER를 **실제 활성 시각**으로 설정하고 API 신규 분석을 켠다. 예시 시각을 그대로 넣지 않는다.
6. Web flag를 켠 빌드를 배포한다. 신규 면접 하나로 전체 흐름을 다시 확인한다.

콜백 인증 토큰을 처음 강제하거나 교체하는 경우 기존 다른 분석/채팅 콜백도 영향을 받는다. 수신측 수용 → 모든 발신 프로세스 교체 → 검증 강제 순서로 처리한다. Chat에 행동 기능을 추가하는 것과는 별개다.

## 7. 롤백

- 우선 Web flag OFF와 API 신규 분석 OFF. 업로드·기존 채점·음성 분석을 계속한다.
- Analysis의 VIDEO_ENABLED=false는 기존 설계상 라우터 등록을 끈다. API가 기존 job을 GET으로 복구해야 하는 동안 임의로 끄지 않는다. 신규 접수 차단은 우선 API flag로 한다.
- 이미 processing인 작업은 같은 model release로 종료시킨다. 모델 release를 지우거나 unconfigured로 바꿔 결과 의미를 바꾸지 않는다.
- 콜백·GET·기존 결과 reader는 유지한다. 결과 JSONB를 삭제하거나 과거 결과를 새 모델 결과로 일괄 갱신하지 않는다.
- 구버전 API/Analysis로 코드 롤백해야 한다면 새 오류·data를 읽을 수 있는 호환 버전까지를 하한으로 정한다. snapshot/DB downgrade가 필요하면 기존 백업·복구 절차를 사용한다.

## 8. 인수 보고서 템플릿

```text
날짜/환경:
각 저장소 commit:
modelVersion / thresholdsVersion / 모델 SHA-256 / runtime lock:
자동 검사 결과와 실행하지 못한 검사:
실제 모델 평가 클립 수·인원·조건·주석 방법:
지표별 F1·오차·coverage, 실패 조건:
30분/60분 처리시간·최대 RSS·callback 크기:
연동 시나리오 1~16 결과와 비밀값 없는 증빙 경로:
S3 원본 lifecycle·결과/평가 자료 보관 담당 확인:
flag·cutover·허용 호스트 설정 확인(토큰 값 기재 금지):
남은 제한과 운영 활성화 여부:
```

문서 작성 완료, 구현 완료, 실제 모델 검증 완료, 실제 서비스 연동 완료, 운영 활성화를 각각 별도 상태로 기록한다.
