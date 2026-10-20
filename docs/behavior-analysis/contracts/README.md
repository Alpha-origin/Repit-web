# 행동 분석 계약 예제

- 모두 **합성 fixture**다. 모델 성능·실제 사용자 상태·실제 배포 성공의 증거가 아니다.
- 기준: [00](../00-overview.md), [01](../01-behavior-contract.md).
- `behavior-data.schema.json`: JSON Schema Draft 2020-12, 행동 data 객체만 검증한다. callback/API wrapper용 스키마와 혼동하지 않는다.
- 사용자 API의 기존 wrapper는 실제 코드대로 `{ "success": true, "data": ... }`다.

| 파일 | 용도 |
|---|---|
| `behavior-ready.json` | 다섯 지표와 충분한 coverage를 갖춘 정상 데이터 |
| `behavior-partial.json` | 어깨·상체가 측정 불가인 부분 결과 |
| `behavior-zero-face.json`, `callback-zero-face.json`, `api-zero-face.json` | 실제 관찰 0%와 나머지 지표 null의 구분 |
| `callback-ready.json`, `callback-partial.json` | Analysis → API 전체 종료 포장 |
| `callback-unavailable.json` | 4초 영상으로 측정 불가, data=null |
| `callback-unconfigured.json` | 기존 분석기 미연결 호환 |
| `callback-failed.json` | 종료 문서 생성 실패, 최상위 error·result=null |
| `api-ready.json`, `api-partial.json` | API → Web 정상·부분 결과 |
| `api-analyzing-previous.json` | 요청102 분석 중, 요청101의 부분 결과 계속 표시 |
| `api-failed-previous.json` | 최신 요청102 실패, 자동 chain 예산 소진, 사용자 재분석 가능, 요청101 결과 유지 |
| `api-unavailable.json` | 최신 원본 측정 불가, 재분석 금지 |
| `api-disabled.json`, `api-no-recording.json`, `api-waiting.json` | 데이터가 없는 상태 구분 |

`api-failed-previous`의 자동 재분석 예산 소진은 서버 내부 상태다. `retryable=true`인데 FAILED인 예제는 자동 예산이 더 남아 있다는 뜻이 아니다. API 화면 계약은 canRetry와 status를 따른다.

## 검증

```sh
python3 validate_contracts.py
```

표준 라이브러리만 사용한다. 포함 스키마가 사용하는 JSON Schema 키워드 부분집합과 01의 의미 불변식을 검사하며, 음성·실제 모델·서버 구현을 실행하지 않는다. 범용 JSON Schema 라이브러리를 대신하는 제품 코드로 복사하지 않는다. 구현 저장소에서는 해당 언어의 실제 DTO/validator와 같은 fixture를 사용한다.

API JSON에는 호환용 result와 정규화 behavior가 함께 있어 데이터가 중복된다. 이 중복은 의도된 하위 호환이며, 새 Web은 behavior만 표시한다.
