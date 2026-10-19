# 기업 선택·생성 복구·피드백

기준: 2026-10-19 사용자 제공 「기업 데이터셋 구현 명세 — 00. 공통 계약」·「01. Web」.
기반 커밋: `34ac21b` (기업 선택 임시 화면, PR #163), 원격 `dev` 확인: `6f10536`.
이슈: #166. 의존 PR #163을 먼저 병합한다.

## 화면과 API

`/main/setting/interview` 또는 `/main/setting/interview/multi` → `/main/setting/interview/company?draftId=<uuid>` → `/main/interview/:id?draftId=<uuid>`.

사전 설정은 검증·초안 저장·다음 단계 이동만 한다. 최종 시작에서 기존 페르소나 저장 로직으로 생성 DTO를 만들고, 선택한 경우에만 `companyId`를 추가한다. 면접 생성은 `submitSetupDraft` 한 곳에서만 호출한다.

- 목록: `GET /api/companies`. 검색 300ms 디바운스·최대 30자, 1자는 q 생략, 전체 분류는 category 생략. 요청 취소와 취소 여부 검사로 이전 결과가 현재 결과를 덮지 않는다.
- 단건 복구: `GET /api/interviews/get?interviewId=…`. 사용자·면접 ID 확인 후 종료 상태를 처리한다.
- 준비: 기존 `GET /api/questions/tailor?interviewId=…`, `POST /api/interviews/:id`, `POST /api/interviews/:id/preparation/retry`. READY와 chatDelivered를 확인한 뒤 진행 화면에 진입한다. 준비 실패로 create를 다시 호출하지 않는다.
- 기업 배지: 단건 면접 API의 snapshot 배지를 진행 화면에 전달한다. 이력과 피드백도 API 배지만 사용한다.

## 초안과 제출

Zustand 메모리 + 현재 탭 sessionStorage의 `repit:interview-setup:<ownerKey>:<draftId>`에 저장한다. 초기화·복원·변경 시 설정 enum·면접관·역할·중복·safe integer·UUID·제출 본문을 검사하고 알려진 필드만 보관한다. 토큰·문서 바이트·답변 원문을 저장하지 않는다. 해당 사용자의 로그아웃·사용자 변경 시 이 기능의 초안만 제거한다.

미제출 초안은 2시간 후 만료한다. 생성 ID가 있는 초안과 결과 불명인 제출은 TTL로 제거하지 않는다. 불명인 요청을 만료시키고 새 키로 생성하면 중복 면접이 될 수 있기 때문이다. 완료 면접은 피드백으로, 중단된 면접은 명시적 새 면접 안내로 복구한다.

최종 본문과 UUID `Idempotency-Key`를 **POST 전에 저장**한다. 저장 실패 시 POST하지 않는다. 연타·같은 탭에서 재진입한 제출은 같은 promise를 공유한다. 타임아웃·네트워크 실패·409는 본문과 키를 보존하며 설정 편집을 잠근다. 새로고침의 SUBMITTING/UNKNOWN도 같은 본문·키로만 재전송한다. COMPANY_UNAVAILABLE/COMPANY_CONTEXT_UNAVAILABLE 또는 확정된 동기 검증 실패는 선택을 유지하고 편집으로 돌아간다.

기술 가정: 생성 요청 타임아웃은 30초, 조회는 15초, 준비 확인은 기존 런타임과 같은 최대 20분·기본 1초/질문 대기 3초 폴링을 재사용한다. 서버 retryAfterMs보다 빨리 조회하지 않으며, 대기 초과 시 수동 상태 확인을 제공한다. 새 면접은 draftId 없는 명시적 설정 진입에서 시작한다. 예전 완료 초안을 자동으로 쓰지 않는다.

## 기업 코멘트

기업 선택 없음은 섹션을 숨긴다. company가 있으면서 null·유효하지 않은 companyFit이면 ‘기업 관점 코멘트를 제공하지 못했습니다’를 표시한다. 점수·그래프·합격 예측을 추가하지 않는다.

공통 상한(총평 300자, 목록별 3항목, factId 32자, focus 20자, 근거/제안 150자)은 Unicode code point로 검사한다. 긴 결과를 잘라 이어 붙이지 않는다. 같은 목록의 factId는 첫 유효 항목을 사용한다. 문항 ID는 `String(feedbacks[].questionId)`와 불투명 문자열로 비교하고 표시 번호는 실제 피드백 배열 순서를 쓴다. 유효 문항이 없는 항목은 숨기며, 원래 있던 항목이 전부 제거되면 총평도 숨긴다. 처음부터 두 목록이 빈 정상 결과는 총평만 표시한다.

종합·상세 화면과 기존 PDF 캡처 영역에 같은 기업 섹션을 포함한다. 링크는 `questionId` query로 실제 문항·답변을 선택하며 꼬리질문도 동일하게 처리한다.

## 검증

```sh
npm run lint
npm run build
node --test tests/*.test.mjs
PLAYWRIGHT_MODULE_PATH=/absolute/path/to/playwright/index.mjs INTERVIEW_TEST_ORIGIN=http://127.0.0.1:5174 node tests/company-setup.browser.mjs
```

Playwright는 기존 브라우저 검사처럼 외부 설치 경로를 지정할 수 있으며 새 패키지는 추가하지 않는다. `COMPANY_SCREENSHOT_DIR`로 화면 저장 위치를 지정한다.

기업 검사는 API 응답 대역을 사용한다. 초안 훼손·만료·소유자 변경·저장 실패, SOLO/MULTI 기업 유무, 최종 연타, SUBMITTING/UNKNOWN 새로고침, 같은 본문·키 유지, 검색 응답 역전, 목록 0개/장애, 검색 밖/숨김 기업 유지, 모바일·키보드, 준비 실패 재시도·완료 복구, snapshot 이름·꼬리질문·PDF를 검사한다.

## 서버 선행 조건과 검증 한계

로컬 API 소스의 기업 목록·snapshot 배지·companyFit DTO와 기존 준비 endpoint를 확인했다. 다만 현재 확인한 API `InterviewController`에는 Idempotency-Key 처리 코드가 없다. 공통 계약의 **서버 중복 방지 구현과 계약 테스트를 먼저 적용해야 한다**. Web의 고정 키 재전송만으로 서버 중복 생성이 방지되는 것은 아니다.

공개·검수 완료 기업 필터링, 숨김·snapshot 불가 오류 코드, 배포된 API/Analysis/Chat의 수신·저장·실제 사용도 서버 계약 테스트와 실제 연동으로 확인해야 한다. 이번 Web 작업에서는 실제 서버에 면접을 생성하거나 배포하지 않았다. 검수 데이터 완성·실제 모델 정확도·서버 실연동을 완료한 것으로 보지 않는다.


## 확인 결과

- `npm run lint`: 오류 0, 기존 router.tsx의 사용하지 않는 eslint-disable 경고 1개.
- `npm run build`: 통과 (TypeScript project build 포함).
- `node --test tests/*.test.mjs`: 32개 통과.
- 기업 설정 브라우저: 18개 시나리오 통과.
- 기존 면접 복구: 10개, 피드백 폴링: 11개, 녹화·종료·업로드: 22개 시나리오 통과.
- 녹화 검사의 기존 설정 버튼명 2곳을 현재 화면의 ‘텍스트 답변’·‘영상/음성 답변’에 맞췄다.
- 자체 리뷰: 생성 호출 단일화, POST 이전 저장, 소유자 변경 시 정리, 서버 준비 상태 확인, 문자열 문항 연결을 점검했다.
