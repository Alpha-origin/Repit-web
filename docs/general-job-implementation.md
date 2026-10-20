# 일반 직군 Web 구현

- 기준: `origin/dev@ec3e044` (2026-10-20 fetch). 최신 main `87a7dde`는 dev의 후손이나 이 구현의 명세 기준 및 PR 대상은 dev입니다.
- 사용자 요청에 따라 서버별 개발을 병렬 진행하며, 병합 순서 auth → Analysis → Chat → API → Web을 유지합니다. 배포·병합하지 않습니다.
- 계약: `Doc/general-job-impl-spec/01-overview.md`, UI·검증: `06-web.md`, 승인 시안 `general-job-input.html`.
- N-1: GitHub는 개발 필수, 데이터 분석가·DBA·QA·보안 선택, PM·IT 컨설턴트 숨김이며 보완 입력은 PM·IT 컨설턴트만 제공합니다.
- [가정] 계층 버튼은 기존처럼 선택 후보를 바꾸고 세부 직무를 고르는 시점에 자료 초기화 확인을 합니다. 저장은 화면 계층과 실제 선택 직무가 일치할 때만 가능합니다.
- [가정] 자료 없는 일반 대분류 간 이동은 직무명을 유지하고, IT로 이동 시에는 직무명을 비웁니다. 실제 자료 초기화 확인을 승인하면 직무명도 비웁니다.
- [가정] 입력 길이·제어문자 규칙은 클라이언트에도 서버와 같게 적용합니다. 문서 총 쪽수는 기존 서버 PDF 검증을 유지합니다.
- 팀원 공유: 이 PR은 han0911 담당 마이페이지 직무 선택·자료 카드를 변경합니다. 외부 메시지는 사용자 권한이 없어 전송하지 않으며 PR에 변경 범위를 표시합니다.

## 구현·검증 결과

- 일반 6개 대분류·직무명·문서 4종·자소서 최대 5문항, 예시 메뉴·오류 위치·초기화 및 저장 스냅샷을 구현했습니다.
- IT 9개는 항상 `jobTitle: null`, `coverLetters: []`를 보내며 N-1 GitHub·보완 입력을 직무 상수에서 읽습니다.
- 일반 카테고리 30개, 직무 6개 이름·예시·업로드 문구·문서 종류를 01 §3 표와 대조했습니다. 직무 제목 helper는 현재 화면 호출이 없어 함수까지만 확장했습니다.
- 자체 코드 리뷰: 자료 유지/초기화, 자소서 완성 여부, 요청 중 수정 보존, 전송 순서 기반 422 행 매핑, 메뉴 키보드/밖 클릭, IT 회귀를 점검했습니다. 미선택 개발 계층의 기존 GitHub 표시를 보존하도록 수정했습니다.
- `npm run lint` 성공(기존 router.tsx 불필요 disable 경고 1개), `npm run build` 성공, `node --test tests/*.test.mjs` 89개 통과.
- `tests/general-job-materials.browser.mjs` 10개 시나리오 묶음 통과: 일반 자료 UI, 자소서 단독 multipart, 예시 메뉴·Esc·포커스·밖 클릭, 저장/새로고침, 한글 입력 시 카드 유지, 직무명 변경, 5문항, 422 행 매핑, 초기화, 모바일 400px, IT QA 회귀, 이력서만/불완전 자소서 차단, 자료 없는 직무명 유지, SOLO·MULTI 자소서 면접 시작 판정.
- 기존 `profile-preparation.browser.mjs` 31개 시나리오 통과. 최신 랜딩 버튼 이름이 fixture의 오래된 이름과 달라 `/tmp/general-job-profile-regression.mjs` 복사본에서 초기 router 로딩 대기만 변경해 실행했습니다. 저장·조회 실패 복구, 저장 중 수정, 분석 상태, SOLO/MULTI 시작, 준비 재시도·타임아웃·폴링 정리 회귀입니다.
- 브라우저 검사는 로컬 fixture 응답을 사용했습니다. 실제 API/auth/Analysis/Chat 연결 및 일반 질문·면접·채점 전체 실연동은 서버 PR 반영 후 남습니다. 모바일 캡처 `/tmp/general-job-mobile.png` 시각 확인 완료.
- 실행: 기존 Playwright 설치를 `PLAYWRIGHT_MODULE_PATH`에 지정하고 `INTERVIEW_TEST_ORIGIN=http://127.0.0.1:5197`로 실행합니다. 신규 의존성·lockfile 변경 없음.
