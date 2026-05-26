import footerGraphic from "@/shared/img/landing-page/repitMain.svg?url";
import styled from "styled-components";

export const Container = styled.footer`
  width: 100%;
  padding: 0;
  background: transparent;
`;

export const Inner = styled.div`
  position: relative;
  width: 100%;
  height: 10.5rem;
  overflow: hidden;
  border-radius: 0; 
  padding: 0 4rem;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface.blueSoft} 0%,
    ${({ theme }) => theme.colors.surface.blueMuted} 100%
  );

  @media (max-width: 56.25rem) {
    min-height: 13rem;
    height: auto;
  }
`;

export const LeftSection = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  height: 100%;
  padding-left: ${({ theme }) => theme.spacing.xxl};

  @media (max-width: 56.25rem) {
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    gap: 1.25rem;
    padding: 2.25rem 1.5rem;
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 1.55rem;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.05rem;

  @media (max-width: 56.25rem) {
    font-size: 1.125rem;
  }
`;

export const StartButton = styled.button`
  width: 10.5rem;
  height: 3rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.brand.blueAction};
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 0.1875rem 0.5rem ${({ theme }) => theme.colors.shadow.blue};
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-0.125rem);
  }

  @media (max-width: 56.25rem) {
    width: 100%;
    max-width: 10.5rem;
    height: 3.25rem;
  }
`;

export const GraphicImage = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  width: 40rem;
  height: 125%;
  pointer-events: none;
  background: url(${footerGraphic}) right center / auto 100% no-repeat;

  @media (max-width: 56.25rem) {
    width: 24rem;
    height: 100%;
  }
`;
