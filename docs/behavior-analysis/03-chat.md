# 행동 분석 구현 명세 — 03. Chat

- 레포: `Alpha-origin/Repit-chat-server`, `main` `95f2cc0`.
- 공통: [00](00-overview.md).
- **신규 기능 코드 변경 없음**이 이번 버전의 기본 계획이다. 서버별로 문서를 나눈다고 불필요한 새 endpoint·Redis 필드를 만들지 않는다.

## 1. 변경하지 않아도 되는 이유

행동 분석 입력은 Web이 올린 전체 영상과 API의 interview/user/session/recording ID다. 이 식별자들은 기존 API 요청에 이미 있다. 분석은 면접 종료 뒤 별도 작업으로 실행되므로 Chat이 영상 URL·모델 결과를 전달하거나 처리 완료를 기다릴 이유가 없다.

확인한 파일:

- `src/main/java/com/person/repit/interview/dto/request/ChatInterviewPrepareRequest.java`: sessionId/interviewId/userId와 면접 구성·질문 수신.
- `src/main/java/com/person/repit/interview/domain/ChatInterviewSession.java`: Redis 세션에 기존 면접 식별자·질문·답변 보관.

이 구조에 행동 지표·원본 URL·landmark·modelVersion을 추가하지 않는다. 채팅 종료 응답이나 피드백 생성을 영상 분석 완료까지 지연하지 않는다.

## 2. 유지할 계약

| 구간 | 책임 |
|---|---|
| 면접 준비 | API가 발급한 sessionId·interviewId·userId 그대로 보관 |
| 질문·답변 | 기존 순서·저장·전달 유지 |
| 정상 종료 | 기존 최종 기록을 API에 전달 |
| 중단·재접속 | 기존 정책 유지. 영상 분석에 맞춰 임의로 면접 상태를 새로 만들지 않음 |
| API 기록 전달 실패 | 기존 복구 경로 유지. Web 영상 업로드와 결합한 분산 트랜잭션을 만들지 않음 |

면접 내용 채점·음성 분석·행동 분석은 각자 종료한다. 행동 분석 장애가 꼬리질문·TTS·면접 완료를 실패시켜서는 안 된다.

## 3. 담당자가 확인할 회귀

1. SOLO·MULTI 모두 준비 때 받은 식별자와 종료 기록의 식별자가 일치한다.
2. 정상 종료 HTTP·실시간 알림이 겹쳐도 Web 기존 종료 처리에서 전체 영상 업로드가 중복되지 않는다. 주 수정·검증 책임은 Web이다.
3. 종료 기록이 먼저 도착하거나 영상 업로드가 먼저 도착해도 기존 API 결과·채점 경로가 동작한다.
4. 텍스트 면접은 기존 면접 흐름을 유지하고 행동 분석을 기다리지 않는다.
5. 행동 분석 서버가 내려가 있어도 면접 진행·꼬리질문·TTS가 동작한다.

필요한 버그가 발견되면 기존 종료·식별자 계약의 결함으로 좁혀 별도 변경한다. 행동 모델을 Chat 프롬프트에 넣는 방식으로 해결하지 않는다.

## 4. 다음 버전에서만 필요한 계약

질문별 행동 분석·영상 다시보기 구간 연결을 추가하려면 `recordingStartedAt`과 질문/답변별 **동일 미디어 시간축의 offset**이 먼저 필요하다. 서버 wall-clock·전사 수신 시각·질문 createdAt만으로 영상 구간을 계산하지 않는다.

이 버전에서는 그 필드·endpoint·Redis 마이그레이션을 만들지 않는다. 관련 기능을 완성했다고 인수 목록에 넣지 않는다.

## 5. 완료 조건

- Chat 변경 PR은 필수가 아니다. 회귀 결과와 "행동 분석 계약 변경 없음"을 인수 기록에 남기면 된다.
- Chat 코드를 변경했다면 저장소 기존 `./gradlew test`와 관련 종료·세션 테스트를 통과한다.
- API/Analysis/Web 배포 순서에 Chat 신규 배포를 끼워 넣지 않는다. 기존 콜백 토큰 교체가 필요한 경우에만 별도 보안 배포 순서를 따른다.
