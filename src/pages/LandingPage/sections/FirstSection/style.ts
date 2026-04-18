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

export const Header = styled.header`
  position: relative;
  z-index: 1;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  font-size: ${({ theme }) => theme.fontSize.logoFont};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.landingLogo};

  svg {
    width: 3.5rem;
    height: 3.5rem;
    flex-shrink: 0;
    display: block;
  }
`;

export const Nav = styled.div`
  display: flex;
  gap: 12px;
`;

export const SignUp = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.navFont};
  cursor: pointer;
`;

export const Login = styled.button`
  background: ${({ theme }) => theme.colors.landingLogin};
  border: none;
  color: ${({ theme }) => theme.colors.white};
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.landingLoginHover};
  }
`;

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
