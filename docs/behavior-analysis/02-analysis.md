# 행동 분석 구현 명세 — 02. Analysis

- 레포: `Alpha-origin/repit-analysis-server-v2`, `main` `3b2103d`.
- 계약: [00](00-overview.md), 측정: [01](01-behavior-contract.md).
- 가장 큰 신규 범위: **실제 행동 분석 실행 프로그램**. 기존 다운로드·전체 디코딩·작업·콜백 프레임워크는 재사용한다.

## 1. 현재 코드와 수정 지점

| 기존 파일 | 현재 역할 | 작업 |
|---|---|---|
| `src/app/outbound/adapters/video/analyzer.py` | 미연결 결과 | 기본 fallback 유지 |
| `src/app/outbound/adapters/video/process_analyzer.py` | 외부 프로세스, 제한, 버전 검사 | behavior-v1 출력의 타입·의미 검증 연결 |
| `src/app/core/common/video/dto.py` | PreparedVideo·AnalysisOutcome·콜백 | 기존 포장은 유지, 행동 DTO와 분리 |
| `src/app/core/common/video/errors.py` | 공개 오류 사전 | BEHAVIOR_NOT_MEASURABLE 추가 |
| `src/app/main/video_config.py` | process 실행 파일·모델 설정 | 기존 설정 재사용, 동작 문서·hash 검사 보완 |
| `src/app/main/video_worker.py` | 레인·분석기 구성 | CPU 기동 때 모델 manifest·실행 가능성 검사 |
| `src/app/core/commands/process_video_task.py` | 단계 처리·임대·재시도 | 포트 유지, timeout·취소 회수 회귀 |
| `docs/video-api.md`, `docs/video-analysis.md` | 계약·운영 문서 | 신규 data·실행·오류·제약 문서화 |

기존 DB·idempotency·콜백 저장·보관 상태 머신을 대체하지 않는다. GPU·메시지 브로커·새 비전 HTTP 서버를 도입하지 않는다.

## 2. 모듈 구성 (신규)

```text
src/app/core/common/behavior/
  dto.py                 BehaviorData·Metric·Timeline·Event
  policy.py              behavior-policy-v1 고정 상수
  aggregate.py           시간 가중 집계, 상태·사유·summary
  validation.py          01 §11 의미 검증

src/app/outbound/adapters/behavior/
  cli.py                 기존 process 어댑터용 실행 진입점
  manifest.py            모델 파일·hash·runtime 버전 확인
  frames.py              로컬 PTS 기반 RGB 스트림
  mediapipe_models.py    Face/Pose Tasks wrapper
  geometry.py            회전 행렬·어깨·속도 계산

tests/behavior/
  test_dto.py
  test_sampling.py
  test_geometry.py
  test_aggregate.py
  test_cli.py
  test_real_models.py
  test_contract_examples.py
evaluation/behavior/
  manifest.example.json
  evaluate.py
  README.md
```

inner core는 MediaPipe·PyAV·파일 IO·subprocess를 import하지 않는다. 모델 관찰치 배열/iterator를 core 집계에 전달한다. 실제 파일 처리와 모델 호출은 outbound에 둔다.

## 3. 모델·런타임 고정

### 3-1. 선택

- 얼굴: 공식 MediaPipe Face Landmarker Tasks 모델, landmark·facial transformation matrix·blendshape 출력.
- 어깨: 공식 Pose Landmarker **Lite** 모델. 세그멘테이션 마스크 출력 끔.
- CPU, Face num_faces=2, Pose num_poses=2. 실제 다중 인물 정체성 추적은 하지 않는다.
- 프레임: PyAV를 사용하는 것을 기본 구현안으로 한다. FFmpeg/PyAV가 반환하는 PTS·time_base를 사용한다. `CAP_PROP_FPS`로 전체 시간을 대체하지 않는다.
- 의존성은 `mediapipe`, `av`, `numpy`. 기존 패키지와 wheel 호환성 확인 후 optional extra `behavior`에 고정하고 lockfile을 커밋한다. 기존 API·텍스트 프로세스에 불필요한 설치를 강제하지 않는다.

현재 저장소는 Python >=3.12다. 배포할 Linux CPU 아키텍처·Python 3.12에서 실제 import·모델 로드·VIDEO 추론이 되는 버전을 선택한다. "최신"이라는 범위로 배포하지 않는다. 이 명세 작성 중 패키지 설치·벤치마크를 완료한 것은 아니다.

### 3-2. release manifest

기존 `VIDEO_ANALYZER__MODEL_PATH`는 단일 `.task`가 아니라 **읽기 전용 manifest JSON 파일**을 가리킨다. 모델 파일 경로는 manifest 기준 상대 경로로 쓰고 같은 release 디렉터리 내부의 일반 파일만 허용한다.

```json
{
  "manifestVersion": "1",
  "modelVersion": "mp-face-pose-v1",
  "dataSchemaVersion": "behavior-v1",
  "thresholdsVersion": "behavior-policy-v1",
  "runtime": {"python": "3.12", "mediapipe": "실제 잠근 버전", "av": "실제 잠근 버전", "numpy": "실제 잠근 버전"},
  "face": {"path": "face_landmarker.task", "sha256": "실제 64자리 소문자 hex", "sourceUrl": "공식 다운로드 URL"},
  "pose": {"path": "pose_landmarker_lite.task", "sha256": "실제 64자리 소문자 hex", "sourceUrl": "공식 다운로드 URL"}
}
```

위는 설명용으로 placeholder가 있다. 개발자가 실제 파일을 받아 hash·버전·출처·라이선스 정보를 채운 산출물을 남긴다. 모델 artifact는 운영 artifact 저장소 또는 read-only 배포 volume에 둔다. **기동·분석 중 모델 자동 다운로드는 금지**한다. 모델·클립의 라이선스 파일/참조 URL을 release와 함께 보관한다.

manifest 버전·스키마·thresholds·env modelVersion이 서로 다르거나 hash가 틀리면 CPU 워커가 작업을 claim하기 전에 실패한다. API/io/callback 레인은 모델이 없어도 기존 역할을 수행한다. 잘못된 release를 사용자 파일 손상으로 기록하지 않는다.

## 4. 실행 계약

기존 ProcessVideoAnalyzer의 인자를 그대로 사용한다.

```text
repit-behavior-analyzer
  --model-path /srv/repit/models/mp-face-pose-v1/manifest.json
  --model-version mp-face-pose-v1
  --input-json '<PreparedVideo의 snake_case JSON>'
```

- console script는 extra 설치 시 같은 venv에 생성한다. `pyproject.toml`의 scripts entry로 연결한다.
- `PreparedVideo`의 path는 이미 다운로드·전체 검사된 **로컬 파일**이다. 원격 URL을 다시 받지 않는다.
- stdin·쉘·원격 credentials가 필요 없다. 기존 어댑터가 자식 환경을 제한하는 방식을 유지한다.
- stdout: `AnalysisOutcome` JSON 하나, **camelCase 데이터**, 1MiB 이하. SDK의 native 로그가 stdout을 오염시키지 않도록 초기화 단계에서 stderr로 격리한다.
- stderr: 사용자 영상·landmark·URL·토큰·프로세스 인자 없이 오류 코드와 진단 종류만. 개인정보가 포함된 원문을 저장하지 않는다.
- 정상 종료/품질 부족: exit 0 + ready/partial/unavailable 결과. 잘못된 manifest·실행 실패·출력 검증 실패는 nonzero → 기존 INTERNAL_ERROR.
- worker timeout·임대 상실·취소 시 CLI와 PyAV/native thread까지 기존 process group 종료·회수 대상이다. CLI에서 별도 유실 가능한 background 프로세스를 만들지 않는다.

process wrapper의 기존 `data.schemaVersion/modelVersion` 검사 후 BehaviorData DTO·01 §11 의미 검증을 수행한다. ready/partial에서 JSON 임의 객체를 통과시키지 않는다.

## 5. 프레임 처리

1. 로컬 파일 열기. 외부 참조·네트워크를 허용하지 않는다. 기존 파일의 sha256·크기·검증 결과를 전달받는다.
2. 첫 영상 stream과 검증된 presentation PTS를 순서대로 읽는다. 기존 검사와 다른 stream·시간 역전·길이 해석이 나오면 내부 오류로 끝낸다.
3. 01 §4 slot 규칙으로 프레임을 선택한다. 전체 원본은 기존 validate 단계가 이미 끝까지 검증했으므로 새 추론이 파일 검사를 대체하지 않는다.
4. rotation·SAR을 반영해 표시 좌표로 변환하고 긴 변 640의 RGB로 만든다. 메타데이터 auto-rotation과 수동 회전을 중복 적용하지 않는다.
5. Face/Pose의 VIDEO detect_for_video를 순차 호출한다. 모드의 자동 프레임 drop이 있는 LIVE_STREAM을 사용하지 않는다.
6. 프레임 관찰치와 slot 길이를 aggregate에 전달하고 즉시 frame 참조를 해제한다.
7. 끝까지 집계 후 다섯 지표·timeline·이벤트·summary를 계산한다. 모델 instance는 job 종료 때 close한다.

첫 모델 call이 실패하면 해당 component를 이 job에서 비활성화하고 COMPONENT_FAILURE를 기록한다. 같은 모델을 매 slot 재호출해 예외를 누적하지 않는다. 나머지 component의 안전한 지표만 계속한다. face가 전부 실패하면 얼굴 연계가 필요한 다른 지표도 추정하지 않는다. 전체 프로세스 손상·메모리 오류는 이 방식으로 삼키지 않는다.

## 6. 모델·품질 예외

| 입력·상황 | 기대 |
|---|---|
| 유효한 검은 화면 | faceVisibleRatio가 0인 PARTIAL 또는 전체 시간 부족이면 unavailable. 카메라 OFF라고 단정하지 않음 |
| 얼굴만 보임·어깨 잘림 | 얼굴·방향·미소 가능, 어깨·상체 UNAVAILABLE → partial |
| 여러 얼굴/pose | 해당 slot을 모호한 관찰로 제외, MULTIPLE_PEOPLE. 첫 사람을 자동 선택하지 않음 |
| 아주 작은 얼굴 | 얼굴 비율은 계산, 방향 제외·FACE_TOO_SMALL |
| 10초 미만 | 모든 지표 UNAVAILABLE → BEHAVIOR_NOT_MEASURABLE |
| 한 지표 coverage 부족 | 해당 지표만 UNAVAILABLE, 다른 지표 유지 |
| 모델 미연결 | 기존 ANALYZER_NOT_CONFIGURED |
| task 파일 누락/hash 불일치 | 워커 boot 실패, 작업 claim 안 함 |
| CLI crash/잘못된 JSON/NaN | 기존 INTERNAL_ERROR |
| 분석 단계 시간 상한 | 기존 PROCESSING_TIMEOUT, 기존 단계 재시도 예산 적용 |

BEHAVIOR_NOT_MEASURABLE를 `errors.py`의 Literal·MESSAGES·RETRYABLE에 추가한다. 메시지: `이 영상에서는 행동 지표를 측정할 수 있는 구간이 충분하지 않습니다.` retryable=false. 상위 callback/result 포장은 기존 unavailable 규칙을 따른다.

## 7. 성능·자원과 버전 배포

- 60분 영상의 추론 표본은 최대 18,000개. 원본 전체 decode 검사 비용과 별도다.
- 기존 분석 timeout 900초, RSS 감시 2GiB, job disk·공유 예산을 유지한다. 별도 GPU 가정을 하지 않는다.
- 최장 영상에서 CPU worker 처리량·최대 RSS·응답 크기를 측정한다. 900초 안에 끝나지 않으면 이를 통과로 기록하지 않는다.
- 5Hz/640px/Lite 기준을 임의 축소해 같은 버전 이름을 유지하지 않는다. 목표를 못 맞추면 profiling과 배포 자원 조정 후 계약 버전 변경을 검토한다.
- **v1 모델 교체 절차:** API 신규 분석을 끄고 기존 PENDING/Analysis processing 작업을 모두 끝낸 다음 modelVersion·manifest·패키지를 함께 교체한다. 기존 결과를 덮어쓰지 않는다. 처리 중에 일부 worker만 새 모델로 바꾸지 않는다.
- 향후 무중단 다중 모델이 필요하면 job별 model release snapshot·라우팅을 별도 구현한다. 현재 작업에서 지원한다고 주장하지 않는다.

## 8. 설정 예제

```dotenv
VIDEO_ENABLED=true
VIDEO_ANALYZER__BACKEND=process
VIDEO_ANALYZER__EXECUTABLE=/srv/repit/venv/bin/repit-behavior-analyzer
VIDEO_ANALYZER__MODEL_PATH=/srv/repit/models/mp-face-pose-v1/manifest.json
VIDEO_ANALYZER__MODEL_VERSION=mp-face-pose-v1
VIDEO_ANALYZER__DATA_SCHEMA_VERSION=behavior-v1
```

VIDEO_API_TOKEN·콜백 토큰·allowlist·DB/artifact 경로는 기존 운영 문서대로 모든 프로세스에서 일치시킨다. secret 실제 값은 명세·PR·증빙에 쓰지 않는다.

## 9. 테스트·증빙

| 범위 | 필수 검증 |
|---|---|
| geometry | identity/±yaw/±pitch/roll/scale 행렬, reflection·특이점·NaN, 어깨 pixel 비율·미러 불변성 |
| sampling | CFR/VFR, PTS 정규화, 정확한 200ms 경계, 빈 slot, 마지막 짧은 slot, 회전·SAR |
| aggregate | 분자·분모·0%·null 구분, 10초/30%/80%/90% 경계, 공백 창 reset, event 합치기·절삭, bin 합 |
| 모델 stub | 0/1/2얼굴, 0/1/2pose, 잘린 어깨, 누락 blendshape, component 오류 |
| CLI 실제 | 실행·manifest hash·nonzero·stdout 오염·1MiB·취소·RSS/timeout |
| real model | 실제 task 파일로 Chrome VP8/VP9·Safari H.264·정면·회전·미소·저조도·다중 인물 클립 |
| 기존 video/security | 다운로드·재전송·동시성·콜백·보관·브라우저 검증 전부 유지 |

프로젝트 기존 lint/type/import 검사와 pytest를 실행한다. 기본 명령 예시는 다음과 같고 CI의 실제 lock·extra 설치 명령에 맞춘다.

```sh
uv sync --frozen --extra behavior
uv run ruff check
uv run ruff format --check
uv run mypy src tests
uv run lint-imports
uv run pytest tests/behavior tests/video tests/security
```

모델·ffmpeg 없는 CI는 core 단위검사를 할 수 있다. 실제 모델 job은 별도 필수 CI/스테이징 gate로 실행하고, skip을 실제 모델 검증 통과로 기록하지 않는다. 기존 텍스트·음성 검사도 해당 저장소 CI 기준대로 유지한다.

`evaluation/behavior/evaluate.py`는 클립 manifest·사람 주석 구간을 받아 예측과 비교한 JSON/Markdown을 출력한다. 영상·얼굴 이미지 자체는 저장소에 커밋하지 않는다. 수동 정답의 사람·환경·샘플 범위를 기록한다. 상세 인수 기준은 06 §4.

## 10. 공식 기술 참고

- [Face Landmarker Python](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/python): VIDEO 입력, landmark·blendshape·변환 행렬 출력 및 옵션 확인용.
- [FaceLandmarkerOptions](https://ai.google.dev/edge/api/mediapipe/python/mp/tasks/vision/FaceLandmarkerOptions): transformation matrix 옵션 이름 확인용.
- [Pose Landmarker Python](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/python), [모델 개요](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker): pose 출력·Lite 모델 선택 확인용.

이 공식 문서가 면접 행동 지표·임계값을 검증해 주는 것은 아니다. 측정·표시 정책은 01의 신규 설계다.
