import styled from "styled-components";

import type { AuthPageStyleProps } from "@/pages/auth-page/type";

export const Container = styled.main.attrs<AuthPageStyleProps>(({ $isLogin }) => ({
  "data-is-login": String($isLogin),
}))<AuthPageStyleProps>`
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  display: flex;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;

  background:
    radial-gradient(ellipse 65% 80% at 0% -5%, #61C2FF 0%, rgba(97, 194, 255, 0.85) 35%, rgba(255, 255, 255, 0) 70%),
    radial-gradient(ellipse 85% 85% at 100% -5%, #AFF3FF 0%, rgba(175, 243, 255, 0.8) 40%, rgba(255, 255, 255, 0) 75%),
    radial-gradient(ellipse 55% 85% at 50% -10%, #8BDCFF 0%, rgba(139, 220, 255, 0.75) 40%, rgba(255, 255, 255, 0) 75%),
    linear-gradient(180deg, #edf7ff 0%, #ffffff 78%);

  @media (max-width: 60rem) {
    flex-direction: column;
  }
`;

export const FullOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(2px);
`;
