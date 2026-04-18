import styled from "styled-components";

export const BackGround = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    linear-gradient(
      180deg,
      #041b63 0%,
      #0a3ea8 45%,
      #2f8fff 78%,
      #cfe6ff 100%
    );
  color: white;
`;

export const BackgroundGlow = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.08), transparent 25%),
    radial-gradient(circle at 50% 100%, rgba(255, 255, 255, 0.18), transparent 30%);
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
  gap: 8px;
  font-size: 30px;
  font-weight: 800;
  color: #7ec0ff;
  font-style: italic;

  svg {
    width: 28px;
    height: 28px;
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
  color: white;
  font-size: 13px;
  cursor: pointer;
`;

export const Login = styled.button`
  background: #1f6fff;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #175de0;
  }
`;

export const Main = styled.div`
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
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 12px;
  margin-bottom: 20px;
`;

export const BadgeBrand = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    display: block;
  }
`;

export const Title = styled.h1`
  font-size: 60px;
  text-align: center;
  line-height: 1.2;
  margin: 0;
`;

export const Subtitle = styled.p`
  margin: 20px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

export const StartButton = styled.button`
  border: 1px solid white;
  background: transparent;
  color: white;
  padding: 12px 24px;
  border-radius: 999px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
