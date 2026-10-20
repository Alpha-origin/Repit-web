# 행동 분석 구현 명세 — 01. 지표와 데이터 계약

- 공통 계약: [00](00-overview.md). 이 문서는 **신규 BehaviorData v1의 기준**이다.
- 모델은 MediaPipe Tasks Face Landmarker + Pose Landmarker Lite를 사용하는 CPU 기준안을 채택한다. 구현자는 버전·모델 파일 hash·Linux/Python 호환성을 잠그고 실측한다.
- 아래 임계값은 검증된 면접 평가 기준이 아니라, 재현 가능한 첫 구현을 위한 공학적 기본값이다. 정확도·집단 간 동등성·채용 성과를 주장하지 않는다.

## 1. 데이터 포장과 버전

```text
TerminalCallback.schemaVersion = "1"              기존 통신 포장
TerminalCallback.result.analysis.data.schemaVersion = "behavior-v1"  신규 데이터
BehaviorData.modelVersion = "mp-face-pose-v1"      모델·전처리 묶음
BehaviorData.thresholdsVersion = "behavior-policy-v1"  집계·임계값 묶음
```

모델 파일·전처리·의미 있는 집계 로직이 바뀌면 modelVersion 또는 thresholdsVersion을 올린다. 같은 버전 이름에 다른 파일을 덮어쓰지 않는다. 각 release manifest에 package 버전과 모델 SHA-256을 남긴다. `BehaviorData` 자체에는 원본 경로·URL·이미지·전체 landmark를 넣지 않는다.

## 2. 최상위 BehaviorData

| 필드 | 타입·범위 | 의미 |
|---|---|---|
| `schemaVersion` | `"behavior-v1"` | 고정 |
| `modelVersion` | string, 1~100자 | 불변 모델 release 이름 |
| `thresholdsVersion` | `"behavior-policy-v1"` | 이 버전 임계값 |
| `videoId` | string, 1~200자 | 요청의 video.videoId와 동일 |
| `durationMs` | integer, 1~3,600,000 | PreparedVideo의 검증된 영상 길이 |
| `sampleIntervalMs` | `200` | 목표 관찰 간격 |
| `sampledFrameCount` | integer, 0~18,000 | 실제 관찰한 원본 프레임 수 |
| `sampledDurationMs` | integer, 0~durationMs | 샘플이 존재한 slot 길이의 합 |
| `metrics` | 고정 5개 Metric 객체 | §3의 key. 생략 불가 |
| `timeline` | 1~60개 Bin | §7의 고정 시간 요약 |
| `events` | 0~60개 Event | §8의 관찰 구간 |
| `eventsTruncated` | boolean | 정렬 후 60개를 넘어 표시 일부가 생략됐는지 |
| `summary` | 0~3개 string, 항목당 200자 이하 | §9 템플릿으로 생성 |
| `warnings` | 중복 없는 enum array, 최대 8개 | §10. 임의 문장·개인정보 없음 |

행동 성공 JSON은 UTF-8 1MiB 이하, finite number만 허용한다. 의미 없는 null·NaN·Infinity·음수 시간·미정의 필드는 거부한다. 서버가 표시할 수 있는 고정 크기 요약만 저장한다.

## 3. 공통 Metric

metrics key: `faceVisibleRatio`, `headFacingRatio`, `shoulderLevelRatio`, `upperBodyStableRatio`, `smileShapeRatio`.

```json
{
  "status": "AVAILABLE",
  "value": 0.8,
  "numeratorMs": 43200,
  "denominatorMs": 54000,
  "coverageRatio": 0.9,
  "unavailableReason": null
}
```

| 필드 | 규칙 |
|---|---|
| `status` | `AVAILABLE` 또는 `UNAVAILABLE` |
| `value` | AVAILABLE은 [0,1] 비율. UNAVAILABLE은 null. 점수가 아님 |
| `numeratorMs` | integer, 0 ≤ numerator ≤ denominator |
| `denominatorMs` | 해당 지표를 판단할 수 있었던 시간 합. 전체 영상 길이와 다를 수 있음 |
| `coverageRatio` | denominatorMs / durationMs |
| `unavailableReason` | AVAILABLE은 null. UNAVAILABLE은 §6 enum |

비율은 Decimal의 ROUND_HALF_UP으로 소수점 6자리 반올림한다. API 의미 검증은 원래 분수와 차이 0.000001 이하를 허용한다. UI는 `value*100`을 소수점 한 자리까지 표시한다.

UNAVAILABLE에도 실제 관찰한 numerator/denominator를 남기되 value는 null이다. 예: 4초만 측정 가능했다면 denominator=4000, coverage는 4000/전체 길이. 숫자 0%로 바꾸지 않는다. AVAILABLE이면서 value=0인 경우는 유효한 0%다.

## 4. 시간축·프레임 표본화

1. 기존 검증을 통과한 원본 파일의 **PTS**를 사용한다. `frameIndex / 평균 fps`로 시간을 만들지 않는다.
2. 첫 표시 프레임의 PTS를 0으로 정규화한다. 구간은 `[0, durationMs)`이며 경계는 반열림이다.
3. 200ms마다 slot을 만든다. `slot k = [200k, min(200(k+1), durationMs))`.
4. 각 slot의 첫 표시 프레임 하나만 관찰한다. 프레임이 없는 slot은 미관찰이다. 같은 프레임을 여러 slot에 복제하지 않는다.
5. 샘플의 시간 가중치는 실제 프레임 길이가 아니라 **그 slot 길이**다. 5Hz로 관찰한 구간의 근사치임을 UI에 표시한다.
6. 모델의 VIDEO timestamp에는 실제 정규화 PTS의 밀리초 정수부를 사용한다. 선택 프레임 간 값이 엄격히 증가해야 한다.
7. 회전·SAR을 반영한 표시 영상을 모델 입력으로 만든다. 원본을 좌우 반전하지 않는다. Web의 미리보기 CSS 반전은 분석과 무관하다.
8. 모델 입력은 RGB, 긴 변 최대 640px, 종횡비 유지. 좌표 계산은 실제 입력 width·height의 pixel 좌표로 한다. 찌그러뜨리거나 정사각형으로 강제 변형하지 않는다.
9. 얼굴·어깨의 연속값은 최근 3개 **유효한 연속 slot**의 중앙값으로 완화한다. 관찰 공백·다중 인물에서 창을 초기화한다. 첫 1~2개는 있는 값만 사용한다.

전체 프레임을 저장하거나 slot 이미지 파일을 만들지 않는다. 스트리밍 상태와 집계만 유지한다. 한 slot의 결과가 다음 미관찰 slot을 채우지 않는다.

## 5. 다섯 지표의 측정식

### 5-1. 얼굴 관찰 비율 `faceVisibleRatio`

- Face Landmarker `num_faces=2`. 출력 0개는 "얼굴 미관찰", 정확히 1개는 "단일 얼굴 관찰", 2개 이상은 다중 얼굴/대상 미확정이다.
- 분모: 얼굴 모델 호출에 성공했고 얼굴이 0개 또는 1개인 slot 길이 합.
- 분자: 그중 정확히 1개의 얼굴 landmark가 finite하고 이미지 좌표와 양립하는 slot 길이 합.
- 모델 실패·잘못된 landmark·2개 이상 얼굴은 분자와 분모에서 제외한다. 다중 얼굴을 0%로 벌점화하지 않는다.
- 0개 얼굴은 유효한 관찰 실패다. 검은 화면·화면 밖·가림·검출 실패를 구별하지 않는다.
- 모델의 `min_face_detection_confidence`, `min_face_presence_confidence`, `min_tracking_confidence`는 모두 0.5. 결과가 제공하지 않는 개별 confidence를 지어내지 않는다.

### 5-2. 정면 방향 추정 비율 `headFacingRatio`

- 정확히 단일 얼굴이 있고 facial transformation matrix가 유효한 slot만 후보.
- 얼굴 bbox의 높이가 입력 높이의 12% 미만이거나 면적이 영상의 1% 미만이면 방향 추정에서 제외한다. 얼굴 관찰 지표에는 그대로 반영한다.
- `output_facial_transformation_matrixes=True`로 얻은 4×4 matrix의 좌상단 3×3에서 SVD로 scale을 제거해 proper rotation R을 복원한다. det(R)<0이면 마지막 singular vector 부호를 바로잡는다.
- 카메라 정면 canonical 방향을 identity로 두고 `R=Rz(roll) Ry(yaw) Rx(pitch)` 관례로 변환한다.
  - `yaw = atan2(-R20, hypot(R00,R10))`
  - `pitch = atan2(R21,R22)`, `roll = atan2(R10,R00)`
  - 단위 degree. `hypot(R00,R10)<1e-6`인 특이점·nonfinite matrix는 측정 불가.
- 중앙값 완화 후 `abs(yaw) ≤ 20°` 및 `abs(pitch) ≤ 20°`이면 정면 방향 slot.
- 분모: 방향 추정 가능 시간. 분자: 그중 정면 방향 시간.
- 카메라 높이·기울기·모델 좌표 관례에 민감하다. 정면/좌우/상하 fixture에서 위 수식과 모델 실제 출력의 방향·단위를 검증하기 전 운영 활성화하지 않는다. 예상 관례가 다르면 구현자가 임의로 부호·offset을 넣지 말고 계약·fixture를 함께 개정한다.
- **눈동자 방향·시선·아이콘택트가 아니다.** 카메라 정면을 향한 머리 방향의 근사다.

### 5-3. 어깨 수평 관찰 비율 `shoulderLevelRatio`

- Pose Landmarker Lite `num_poses=2`. 정확히 pose 1개, face 1개인 slot에서만 계산한다. 다중 인물에서 임의로 첫 pose를 고르지 않는다.
- 왼쪽·오른쪽 어깨 landmark index 11·12의 visibility·presence가 모두 0.5 이상, 좌표 finite, x/y가 [0,1] 안이어야 한다. 값이 없으면 불충분이다.
- 입력 크기로 환산한 두 어깨 거리 `w`가 입력 width의 10% 이상이어야 한다.
- `tilt = degrees(atan2(abs(yR-yL), abs(xR-xL)))`. `tilt ≤ 8°`면 수평 관찰 slot.
- 분모: 양쪽 어깨가 유효한 시간. 분자: 그중 수평인 시간.
- 등이 펴졌는지·척추·거북목·건강한 자세를 판정하지 않는다. 카메라 roll에 의해서도 값이 달라질 수 있다.

### 5-4. 상체 안정 구간 비율 `upperBodyStableRatio`

- 위의 양 어깨가 유효한 연속 slot 두 개가 필요하다. 각 slot의 shoulder center `c=(L+R)/2`, 폭 w는 어깨 간 pixel 거리다.
- 인접 관찰 PTS 차가 0보다 크고 400ms 이하일 때만 다음 식을 계산한다.
- `speed = norm(c_t-c_prev) / ((w_t+w_prev)/2) / deltaSeconds`.
- 중앙값 완화한 speed가 `≤0.15 shoulder-width/s`이면 현재 slot이 안정 구간이다.
- 분모: 속도를 판단한 현재 slot 길이 합. 분자: 안정 현재 slot 길이 합. 첫 slot·공백 직후·pose 누락은 제외한다.
- 회전·카메라 이동도 결과에 영향을 준다. "산만함"이나 "불안함"으로 표현하지 않는다.

### 5-5. 미소 형태 관찰 비율 `smileShapeRatio`

- Face Landmarker `output_face_blendshapes=True`. 단일 얼굴에서 `mouthSmileLeft`, `mouthSmileRight`가 모두 finite한 [0,1] 계수이면 유효하다.
- 중앙값 완화한 `(left+right)/2 ≥0.5`인 slot을 미소 형태 관찰로 집계한다.
- 분모: 두 계수가 유효한 단일 얼굴 시간. 분자: 위 조건을 만족한 시간.
- blendshape 값은 감정의 확률이 아니다. UI 명칭은 **미소 형태 관찰**, 행복·호감·태도 점수로 바꾸지 않는다. 말하는 입 모양과 혼동될 수 있다는 설명을 붙인다.
- 비율이 높아야 좋다는 기준·추천 문구·색상은 두지 않는다.

## 6. 측정 가능 여부와 종료 상태

### 6-1. 각 Metric

각 지표는 아래를 모두 만족해야 AVAILABLE이다.

1. 전체 영상 길이 ≥10,000ms.
2. 해당 denominatorMs ≥10,000ms.
3. coverageRatio ≥0.30.

UNAVAILABLE 사유는 다음 우선순위로 하나만 정한다.

| 우선순위 | 코드 | 조건 |
|---|---|---|
| 1 | `INSUFFICIENT_DURATION` | 전체 길이 <10초 |
| 2 | `NO_SINGLE_FACE` | 단일 얼굴 관찰 시간이 0이고 얼굴 기반 후속 지표에 필요 |
| 3 | `HEAD_POSE_UNAVAILABLE` | 방향 지표의 유효 denominator=0 |
| 3 | `SHOULDERS_NOT_VISIBLE` | 어깨·상체 지표의 유효 denominator=0 |
| 3 | `BLENDSHAPES_UNAVAILABLE` | 미소 지표의 유효 denominator=0 |
| 4 | `LOW_COVERAGE` | 나머지: 유효 시간 <10초 또는 비율 <30% |

faceVisibleRatio는 얼굴 0개가 계속 나와도 분모가 충분하면 AVAILABLE/value=0이다. 그래서 다른 네 지표가 없어도 부분 결과로 얼굴 미관찰 사실을 표시할 수 있다.

### 6-2. BehaviorData 유무·AnalysisOutcome

- 다섯 지표 모두 AVAILABLE, 각 coverage ≥0.80, sampledDurationMs/durationMs ≥0.90, 모델 component 실패 없음이면 `ready`.
- AVAILABLE 지표가 하나 이상이며 위 ready 기준을 못 채우면 `partial`.
- AVAILABLE 지표가 없으면 `unavailable`, `data=null`, `BEHAVIOR_NOT_MEASURABLE/retryable=false`. 부분 내부 집계는 사용자 결과로 저장하지 않는다.
- 모델 파일 누락·실행 불가·hash 불일치·프로세스 crash·출력 오류는 인프라/실행 오류다. `BEHAVIOR_NOT_MEASURABLE`로 치환하지 않는다.
- 이벤트 60개 초과는 summary 절삭 사실일 뿐 측정값 손실이 아니므로 이것만으로 partial이 되지 않는다.
- partial의 `analysis.error`는 null이다. unavailableReason·warnings가 부족한 항목을 설명한다. 동일 영상을 다시 분석하면 반드시 좋아질 것처럼 안내하지 않는다.

## 7. Timeline

`binWidthMs = max(10000, ceil(durationMs / 60 / 1000) * 1000)`.
0부터 binWidthMs 간격으로 마지막 durationMs까지 나눈다. 따라서 1~60개, 빈틈·겹침 없이 전 구간을 덮는다.

각 bin:

```json
{
  "startMs": 0,
  "endMs": 10000,
  "metrics": {
    "faceVisibleRatio": {"numeratorMs": 10000, "denominatorMs": 10000},
    "headFacingRatio": {"numeratorMs": 8000, "denominatorMs": 9000},
    "shoulderLevelRatio": {"numeratorMs": 8000, "denominatorMs": 9000},
    "upperBodyStableRatio": {"numeratorMs": 8000, "denominatorMs": 8800},
    "smileShapeRatio": {"numeratorMs": 1000, "denominatorMs": 10000}
  }
}
```

- slot이 bin 경계를 넘으면 교집합 시간으로 분할한다. 모든 bin 합은 해당 최상위 metric numerator/denominator와 같아야 한다.
- bin에는 별도 AVAILABLE 판정을 하지 않는다. 분모 0은 null 표시, 분모/(bin길이) <0.30은 낮은 관찰 범위로 표시한다.
- 전체 지표가 UNAVAILABLE이어도 bin의 숫자로 사용자에게 우회해 지표를 제공하지 않는다.

## 8. Event

| type | sourceMetric | 조건·표시 |
|---|---|---|
| `FACE_NOT_VISIBLE` | faceVisibleRatio | 유효한 얼굴 0개 slot, "얼굴을 관찰하지 못한 구간" |
| `HEAD_TURNED` | headFacingRatio | 정면 조건 밖, "정면 방향 범위를 벗어난 구간" |
| `SHOULDER_TILTED` | shoulderLevelRatio | 수평 조건 밖, "어깨선 기울기가 관찰된 구간" |
| `UPPER_BODY_MOVEMENT` | upperBodyStableRatio | 안정 속도 조건 밖, "상체 중심 이동이 관찰된 구간" |

이벤트 객체는 `{type,sourceMetric,startMs,endMs}`다. `0 ≤ start < end ≤ durationMs`.

연속 true slot을 합치며 **관찰 불가·false slot을 건너뛰어 합치지 않는다**. 지속 시간 ≥2000ms인 구간만 채택한다. 해당 전체 metric이 AVAILABLE일 때만 내보낸다. 같은 종류는 겹치지 않는다. 서로 다른 종류의 이벤트는 겹칠 수 있다.

전체 후보를 startMs → type 사전순 → endMs로 정렬해 앞 60개만 내보낸다. 더 있으면 eventsTruncated=true. 5Hz 근사이므로 시각은 대략적인 관찰 구간이며 영상의 정확한 행동 시작·종료라고 주장하지 않는다.

## 9. Summary

LLM 없이 AVAILABLE 지표 순서대로 최대 세 문장을 만든다. 첫 문장은 항상 faceVisibleRatio가 있으면 그것을 사용하고, 다음은 headFacingRatio, shoulderLevelRatio, upperBodyStableRatio, smileShapeRatio 순서다.

- 얼굴: `얼굴이 관찰된 구간은 판단 가능한 시간의 {p}%입니다.`
- 방향: `머리가 카메라 정면 방향으로 추정된 구간은 방향을 판단할 수 있는 시간의 {p}%입니다.`
- 어깨: `어깨선이 수평 범위에 있던 구간은 어깨를 관찰할 수 있는 시간의 {p}%입니다.`
- 상체: `상체 중심 이동이 기준 이하인 구간은 움직임을 판단할 수 있는 시간의 {p}%입니다.`
- 미소: `미소와 비슷한 입꼬리 형태가 관찰된 구간은 측정 가능 시간의 {p}%입니다.`

p는 ROUND_HALF_UP으로 소수점 1자리. 0.0도 표시한다. 수치가 낮다는 이유로 인성·감정·능력 평가나 행동 교정 지시를 추가하지 않는다.

## 10. Warning 코드

| 코드 | 발생 기준 |
|---|---|
| `LOW_SAMPLE_COVERAGE` | sampledDuration/duration <0.90 |
| `MULTIPLE_PEOPLE` | 얼굴 또는 pose가 2개 이상인 slot이 하나 이상 |
| `FACE_TOO_SMALL` | 단일 얼굴이지만 §5-2 크기 기준 미달 slot 있음 |
| `LOW_FACE_COVERAGE` | 방향 또는 미소 metric coverage <0.80 |
| `LOW_POSE_COVERAGE` | 어깨 또는 상체 metric coverage <0.80 |
| `COMPONENT_FAILURE` | 모델 한 종류의 작업 내 실패로 다른 종류만 결과 제공 |
| `EVENTS_TRUNCATED` | 이벤트 출력 절삭 |

코드 사전순으로 정렬한다. 경고에 따라 결과에 없는 증상을 만들어내지 않는다. 안경·피부색·장애·표정의 특정 원인을 자동 판정하지 않는다.

## 11. 기계 검증과 의미 검증

JSON Schema는 타입·길이·enum·범위를 검사한다. 추가로 Analysis·API에서 다음을 검사한다.

1. data.videoId = outer result.videoId = 요청 recordingId, data.durationMs = outer durationMs.
2. sampledFrameCount ≤ceil(durationMs/200), sampledDuration ≤duration, sampleFrameCount=0 iff sampledDuration=0.
3. numerator ≤denominator ≤duration, coverage와 value가 분수와 일치, 상태·사유 규칙 일치.
4. 다섯 지표의 available 판정과 콜백 ready/partial 기준 일치. 성공 data에 available 지표가 최소 하나.
5. timeline 길이·경계·연속성과 bin별 numerator≤denominator≤bin길이. bin 합과 최상위 합 일치.
6. 이벤트 범위·종류/sourceMetric 조합·정렬·최소 길이·같은 종류 비중첩·해당 metric AVAILABLE. 각 bin에서 같은 종류 이벤트의 교집합 시간 합은 해당 지표의 `denominatorMs-numeratorMs`를 넘지 않는다.
7. eventsTruncated와 EVENTS_TRUNCATED 경고 일치. LOW_* 경고 수치 규칙 일치.
8. UTF-8 전체 콜백 크기 제한, 문자열·숫자 finite, 미지원 스키마 차단.

여기 없는 모델 출력의 정확도는 JSON 검증으로 증명되지 않는다. 실제 정답 구간과 비교하는 [06](06-delivery-and-acceptance.md)의 모델 QA가 별도로 필요하다.
