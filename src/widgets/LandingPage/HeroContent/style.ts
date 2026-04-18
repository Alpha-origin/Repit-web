import styled from "styled-components";

export const Content = styled.div`
  position: relative;
  z-index: 1;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.colors.landingBadge};
  padding: 8px 14px;
  border-radius: 20px;
  font-size: ${({ theme }) => theme.fontSize.badgeFont};
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  margin-bottom: 20px;
`;

export const BadgeBrand = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.bigFont};
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  text-align: center;
  line-height: 1.2;
  margin: 0;
`;

export const Subtitle = styled.p`
  margin: 20px 0;
  font-size: ${({ theme }) => theme.fontSize.subtitleFont};
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  color: ${({ theme }) => theme.colors.landingSubtitle};
`;

export const StartButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.white};
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  padding: 12px 24px;
  border-radius: 100px;
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.landingButtonHover};
  }
`;
