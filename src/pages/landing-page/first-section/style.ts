import { LANDING_STYLE } from "@/shared/constants/landing-page/first-section";
import styled from "styled-components";

export const Section = styled.section`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    ${LANDING_STYLE.gradientTop} 0%,
    ${LANDING_STYLE.gradientMiddle} 45%,
    ${LANDING_STYLE.gradientAccent} 78%,
    ${LANDING_STYLE.gradientBottom} 100%
  );
  color: ${({ theme }) => theme.colors.white};
`;

export const BackgroundGlow = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 50% 40%,
      ${LANDING_STYLE.glowSoft},
      transparent 25%
    ),
    radial-gradient(
      circle at 50% 100%,
      ${LANDING_STYLE.glowStrong},
      transparent 30%
    );
  pointer-events: none;
`;
