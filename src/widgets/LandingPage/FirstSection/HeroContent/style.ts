import { LANDING_STYLE } from "@/shared/constants/LandingPage/FirstSection";
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
  padding: 0.5rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  margin-bottom: 1.25rem;
`;

export const BadgeBrand = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  text-align: center;
  line-height: 1.2;
  margin: 0;
`;

export const Subtitle = styled.p`
  margin: 1.25rem 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  color: ${LANDING_STYLE.subtitle};
  text-align: center;
`;

export const StartButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0.0625rem solid ${({ theme }) => theme.colors.white};
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  width: 13rem;
  height: 3.875rem;
  padding: 0;
  border-radius: 6.25rem;
  font-size: 1.5rem;
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
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  text-align: center;
  line-height: 1.2;
  margin: 0;
  color: ${LANDING_STYLE.mainTitle};
`;
