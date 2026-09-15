# AGENTS.md

## Project Overview

Re:pit is a React + TypeScript + Vite web app for AI mock interview practice and feedback. The app includes landing/auth flows, a main dashboard, interview setup and interview runtime pages, feedback pages, and my-page profile/portfolio flows.

## Tech Stack

- React 18 with TypeScript and Vite
- React Router DOM v7 for routing
- styled-components v6 for styling and theming
- axios for HTTP clients
- zustand for small shared state
- react-hook-form for auth forms
- framer-motion for page/section animation
- html2canvas + jspdf for PDF export
- vite-plugin-svgr for SVG imports with `?react` or `?url`

## Commands

- Install dependencies: use the existing lockfile policy before changing dependencies. This repo currently has both `package-lock.json` and `pnpm-lock.yaml`, so ask before adding or updating packages.
- Start dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Preview production build: `npm run preview`

Run `npm run lint` and `npm run build` before finishing code changes when the change touches TypeScript, routing, API code, or shared UI behavior. There is no dedicated test script configured right now.

## Source Layout

- `src/app`: app bootstrap, router, layout, global styles, theme.
- `src/pages`: route-level page components. Pages should mainly compose feature hooks and widgets.
- `src/widgets`: reusable page sections and UI blocks. Most folders keep `index.tsx`, `style.ts`, and sometimes `type.ts` or `animation.ts`.
- `src/features`: feature-specific API calls, hooks, models, and screen-level logic.
- `src/shared`: shared API clients, constants, fixtures, images, components, stores, models, and utilities.

Prefer the existing feature-sliced style: route composition in `pages`, business/UI logic in `features`, presentational sections in `widgets`, and cross-cutting utilities in `shared`.

## Routing

Routes are defined in `src/app/router.tsx` with lazy imports and a shared `Loading` fallback from `src/app/main.tsx`.

Important paths:

- `/`: landing page
- `/login`, `/signup`: auth pages
- `/main`: main layout root
- `/main/setting/interview`: interview setup
- `/main/interview/:id`: interview runtime
- `/main/interview/completed`: interview completion
- `/main/feedback/list`: feedback list
- `/main/feedback/overall/:id`: overall feedback
- `/main/feedback/detail/:id`: detailed feedback
- `/main/mypage`: my page

When adding routes under `/main`, add them as children of the main layout route.

## Styling Guidelines

- Use `styled-components` and colocated `style.ts` files for component styles.
- Use `src/app/styles/theme.ts` for shared colors, spacing, font sizes, font families, and radii.
- Keep global resets in `src/app/styles/GlobalStyle.ts`.
- The app root uses `overflow: hidden`; individual page or panel components should own scrolling where needed.
- Prefer existing constants from `src/shared/constants/**` for repeated labels, options, and design values.
- Keep Korean user-facing copy consistent and natural. This product is Korean-first.

## Imports and Assets

- Use the `@/*` alias for source imports. It maps to `src/*` in `vite.config.ts` and `tsconfig.app.json`.
- SVGs can be imported as URLs with `?url` or React components with `?react`.
- Static images live under `src/shared/img/**`.
- Keep index exports and barrel files consistent with nearby feature folders when adding new API modules.

## API and Auth

Shared axios clients live in `src/shared/api/axiosInstance.ts`.

- `authInstance`: auth API, based on `VITE_AUTH_URL`.
- `apiInstance`: main API. In development its base URL is empty so Vite proxy handles `/api`; in production it uses `VITE_API_URL`.
- `chatInstance`: chat/interview API, based on `VITE_CHAT_URL`.
- All clients use credentials and sync access tokens from responses.
- 401 responses try `/api/v1/auth/refresh`; if refresh fails, the token is cleared and the user is sent to `/login`. Concurrent requests share one refresh call.
- `apiInstance` and `chatInstance` require an access token. When refresh cannot supply one, the request fails locally with `로그인이 필요합니다.` instead of being sent without an `Authorization` header.
- `apiInstance` removes `Content-Type` automatically for `FormData`.

Backend auth contract:

- A missing token and an expired token both return `401 { "message": ... }`. There is no 400 auth error anymore.
- Ownership checks on answer/question queries return `403 { "message": ... }` where a 404 used to be expected. A 403 must not clear the session.
- Read error text through `extractErrorMessage` in `src/shared/api/errorMessage.ts`; it falls back to status-specific Korean copy for 401 and 403.

Relevant environment variables:

- `VITE_AUTH_URL`
- `VITE_API_URL`
- `VITE_CHAT_URL`
- `VITE_TTS_API_KEY`

Do not hardcode backend hosts, tokens, or API keys. Use the existing axios clients and env variables.

## Interview Runtime Notes

The interview flow uses camera, speech recognition, Supertone TTS, generated interview APIs, and socket-like chat/interview updates. Be careful when changing:

- `src/features/interview-page/interview/model/useInterviewSession.ts`
- `src/features/interview-page/interview/model/useInterviewCamera.ts`
- `src/features/interview-page/interview/model/useVoiceAnswer.ts`
- `src/features/interview-page/interview/model/useSupertoneTts.ts`
- `src/features/interview-page/interview/api/**`

Preserve cleanup behavior for active interview sessions, camera streams, sockets, and navigation on quit/completion.

## State and Data Flow

- Shared user state is in `src/shared/store/userStore.ts`.
- Feature hooks generally use local React state and async functions rather than React Query, even though `@tanstack/react-query` is installed.
- Error messages should go through `src/shared/api/errorMessage.ts` where possible.
- Feedback pages currently mix real interview summary API data with fixture-based detail content until dedicated detail APIs are connected.

## TypeScript and Code Style

- Keep files TypeScript-first; avoid `any` unless there is no practical alternative.
- The compiler has `noUnusedLocals` and `noUnusedParameters` enabled.
- Use type-only imports for types.
- Preserve local formatting and quote style in the file being edited.
- Keep comments sparse and useful.
- Do not introduce broad refactors while fixing a focused bug.

## Before Finishing

- Check `git status --short` and mention only files you changed.
- For code changes, run `npm run lint` and `npm run build` when practical.
- For UI changes, start the dev server with `npm run dev` and verify affected routes in the browser when practical.
- Do not revert unrelated uncommitted changes. Work with existing changes in the tree.
