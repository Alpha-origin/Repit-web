import { LANDING_STYLE } from "@/shared/constants/landing-page/first-section";
import styled from "styled-components";

export const Content = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: ${LANDING_STYLE.badge};
  padding: 0.625rem 1rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: clamp(0.75rem, 0.71rem + 0.18vw, 0.9rem);
  line-height: 1.25;
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  margin-bottom: 1.375rem;
`;

export const BadgeBrand = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

export const Title = styled.h1`
  font-size: clamp(2.25rem, 2rem + 0.8vw, 3rem);
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  text-align: center;
  line-height: 1.2;
  margin: 0;
`;

export const Subtitle = styled.p`
  margin: 0.5rem 0 2rem;

  max-width: 38rem;
  font-size: clamp(0.75rem, 0.73rem + 0.12vw, 0.85rem);
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  color: ${LANDING_STYLE.subtitle};
  text-align: center;
  font-weight: 200;
`;

export const StartButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0.0625rem solid ${({ theme }) => theme.colors.white};
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  width: 10.25rem;
  height: 3rem;
  padding: 0;
  border-radius: 6.25rem;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
  font-family: ${({ theme }) => theme.fontFamily.pretendard};
  letter-spacing: -0.03rem;
  cursor: pointer;

  &:hover {
    background: ${LANDING_STYLE.buttonHover};
  }
`;

export const MainTitle = styled.h1`
  font-size: clamp(2.45rem, 2.15rem + 0.95vw, 3.25rem);
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  text-align: center;
  line-height: 1.2;
  margin: 0;
  color: ${LANDING_STYLE.mainTitle};
`;
