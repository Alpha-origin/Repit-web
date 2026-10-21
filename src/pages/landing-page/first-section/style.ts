import styled from "styled-components";
import GroundImg from "@/shared/img/landing-page/ground.svg?url";

export const Section = styled.section`
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #0E0814;
  color: ${({ theme }) => theme.colors.white};

  @media (max-width: 56.25rem) {
    height: auto;
    min-height: 100dvh;
  }
`;

export const BackgroundGlow = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(212, 231, 255, 0.08),
    transparent 60%
  );
  pointer-events: none;
  z-index: 0;
`;

export const BackgroundGround = styled.div`
  position: absolute;
  top: 45%;
  left: 58.5%;
  transform: translate(-50%, -50%);
  width: 280vw;
  // max-width: 2200px;
  height: 240vh;
  background-image: url(${GroundImg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  
  pointer-events: none;
  z-index: 1;
  // opacity: 1;
`;
