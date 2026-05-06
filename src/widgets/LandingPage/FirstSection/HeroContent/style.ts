import { LANDING_STYLE } from "@/shared/constants/LandingPage/landingStyle";
import styled from "styled-components";

export const Content = styled.div`
  position: relative;
  z-index: 1;
  height: calc(100vh - 5rem);
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
`;

export const StartButton = styled.button`
  border: 0.0625rem solid ${({ theme }) => theme.colors.white};
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  padding: 0.75rem 1.5rem;
  border-radius: 6.25rem;
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
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
