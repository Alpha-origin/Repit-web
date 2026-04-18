import styled from "styled-components";

export const Section = styled.section`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.landingGradientTop} 0%,
      ${({ theme }) => theme.colors.landingGradientMiddle} 45%,
      ${({ theme }) => theme.colors.landingGradientAccent} 78%,
      ${({ theme }) => theme.colors.landingGradientBottom} 100%
    );
  color: ${({ theme }) => theme.colors.white};
`;

export const BackgroundGlow = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 40%, ${({ theme }) => theme.colors.landingGlowSoft}, transparent 25%),
    radial-gradient(circle at 50% 100%, ${({ theme }) => theme.colors.landingGlowStrong}, transparent 30%);
  pointer-events: none;
`;
