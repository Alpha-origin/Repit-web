## Git and Commit Convention

All commits must follow the repository commit convention. Invalid commit messages may be rejected by CI and must not be used.

### Commit Format

Use the following format:

```text
<type>: <subject>
```

Do not add scopes, issue numbers, or other metadata to the commit subject unless the repository rules are explicitly changed.

### Allowed Commit Types

Only the following commit types are allowed:

* `feat`: 새로운 기능 추가
* `fix`: 버그 수정
* `docs`: 레포지토리 내 문서 수정
* `style`: 코드 포맷팅 수정. UI 변경을 의미하지 않음
* `refactor`: 코드 리팩토링
* `chore`: 빌드, 의존성, 설정 변경. 코드 로직 변경에는 사용하지 않음
* `perf`: 코드 성능 개선
* `ci`: CI/CD 설정 변경
* `revert`: 기존 커밋 되돌리기
* `merge`: 브랜치 병합

Do not invent or use commit types outside this list.

### Commit Subject Rules

Commit subjects must follow all of these rules:

* Korean and English are both allowed.
* Spaces are allowed.
* Use a concise phrase rather than a full sentence.
* Do not end with or include periods or commas.
* Keep the subject within 50 characters.
* Describe the actual change specifically.
* Do not include issue numbers in the commit message.
* Avoid vague subjects such as `기능 추가`, `수정`, `bug fixed`, or similar messages.

Good examples:

```text
feat: 웹뷰 브릿지 카메라 API 구현
fix: 로그인 시 토큰 갱신 오류 수정
docs: 사용자 API 엔드포인트 문서 추가
refactor: 알림 서비스 책임 분리
chore: netty socket 의존성 추가
ci: git action workflow 추가
```

Bad examples:

```text
추가
feat: 기능 추가
feat: 로그아웃 버튼 추가 #82
feat(mobile): 로그인 버튼 클릭했을 때 화면이 잘 나오도록 수정했어요
fix: bug fixed.
```

### Commit Units

Commits should be small, focused, and logically independent.

Use the following rule when deciding whether to create a commit:

> Except for `fix` commits, reverting the commit should leave the application in a working state.

Additional rules:

* Do not wait until an entire feature is complete before committing.
* Commit meaningful intermediate units during development.
* Do not combine unrelated changes into one commit.
* Changes requiring different commit types should normally be separated into different commits.
* Use `git add -p` or equivalent partial staging when files contain changes belonging to different commits.
* Each commit should have one clear purpose.
* Do not include unrelated formatting, refactoring, or cleanup in a focused feature or bug-fix commit.

### Amending Commit Messages

If a commit message violates these rules and has not been pushed yet, correct it with:

```bash
git commit --amend
```

Do not rewrite already pushed history unless explicitly requested.

## Before Finishing

* Check `git status --short` and mention only files you changed.
* For code changes, run `npm run lint` and `npm run build` when practical.
* For UI changes, start the dev server with `npm run dev` and verify affected routes in the browser when practical.
* Do not revert unrelated uncommitted changes. Work with existing changes in the tree.
