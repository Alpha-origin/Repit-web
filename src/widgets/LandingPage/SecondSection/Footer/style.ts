import styled from "styled-components";

export const Container = styled.footer`
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.xl} 40px;
  background: ${({ theme }) => theme.colors.surface.background};
`;

export const Inner = styled.div`
  position: relative;

  width: 100%;
  height: 152px;

  overflow: hidden;

  border-radius: ${({ theme }) => theme.radius.md};

  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface.blueSoft} 0%,
    ${({ theme }) => theme.colors.surface.blueMuted} 100%
  );
`;

export const LeftSection = styled.div`
  position: relative;
  z-index: 10;

  display: flex;
  align-items: center;
  gap: 36px;

  height: 100%;

  padding-left: ${({ theme }) => theme.spacing.xxl};
`;

export const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.brand.blue};

  font-size: 24px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.8px;
`;

export const StartButton = styled.button`
  width: 168px;
  height: 56px;

  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};

  background: ${({ theme }) => theme.colors.brand.blueAction};

  color: ${({ theme }) => theme.colors.white};

  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 700;

  cursor: pointer;

  box-shadow: 0 4px 10px ${({ theme }) => theme.colors.shadow.blue};

  transition: 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const BackgroundCircle = styled.div`
  position: absolute;

  top: -180px;
  right: -140px;

  width: 520px;
  height: 520px;

  border-radius: ${({ theme }) => theme.radius.circle};

  background: rgba(255, 255, 255, 0.28);
`;

export const BackgroundCircleSmall = styled.div`
  position: absolute;

  top: -70px;
  right: 120px;

  width: 220px;
  height: 220px;

  border-radius: ${({ theme }) => theme.radius.circle};

  background: rgba(255, 255, 255, 0.18);
`;

export const LogoWrapper = styled.div`
  position: absolute;

  right: 120px;
  top: 50%;

  width: 120px;
  height: 120px;

  transform: translateY(-50%) rotate(25deg);
`;

export const LogoBar = styled.div`
  position: absolute;

  left: 50%;
  top: 0;

  width: 36px;
  height: 120px;

  border-radius: ${({ theme }) => theme.radius.lg};

  background: linear-gradient(180deg, #5ea1ff 0%, #1b38ff 100%);

  transform: translateX(-50%);
`;

export const LogoCircle = styled.div`
  position: absolute;

  right: -10px;
  top: 18px;

  width: 84px;
  height: 84px;

  border: 18px solid #5c96e8;
  border-left-color: transparent;

  border-radius: ${({ theme }) => theme.radius.circle};
`;
