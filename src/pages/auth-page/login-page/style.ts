import styled from "styled-components";
import type { AuthPageStyleProps } from "../type";

export const Container = styled.main.attrs<AuthPageStyleProps>(({ $isLogin }) => ({
  "data-is-login": String($isLogin),
}))<AuthPageStyleProps>`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  overflow: hidden;
  background-color: #f4f8ff;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

export const LeftSection = styled.section`
  position: relative;
  width: 50%;
  min-height: 100vh;
  background-color: #1a73e8;
  overflow: hidden;

  @media (max-width: 960px) {
    width: 100%;
    min-height: 42vh;
  }
`;

export const LeftImage = styled.img`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const LeftContent = styled.div`
  position: relative;
  z-index: 1;
  width: min(27rem, calc(100% - 6rem));
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: clamp(22rem, 34vh, 28rem) 0 0 clamp(4rem, 8vw, 9rem);
  color: #ffffff;

  @media (max-width: 960px) {
    width: calc(100% - 5rem);
    justify-content: flex-end;
    padding: 2.5rem;
  }
`;

export const WelcomeTitle = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamily.calSans};
  font-size: clamp(3.15rem, 4.1vw, 4.35rem);
  line-height: 0.92;
  font-weight: 600;
  letter-spacing: -0.05em;
`;

export const WelcomeDescription = styled.p`
  margin: 1.9rem 0 0;
  font-size: clamp(1.15rem, 1.3vw, 1.45rem);
  font-weight: 700;
  line-height: 1.45;
  white-space: nowrap;
`;

export const SwitchAuthButton = styled.button`
  min-width: 15rem;
  height: 3.85rem;
  margin-top: 2.95rem;
  padding: 0 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.58);
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.03);
  color: #ffffff;
  font-size: 1.55rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.88);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.35);
    outline-offset: 4px;
  }

  @media (max-width: 960px) {
    min-width: 12rem;
    height: 3.25rem;
    font-size: 1.2rem;
  }
`;

export const RightSection = styled.section`
  position: relative;
  width: 50%;
  min-height: 100vh;
  background-color: #f7fbff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7rem 0 3rem;
  box-sizing: border-box;
  overflow-y: auto;

  @media (max-width: 960px) {
    width: 100%;
    min-height: auto;
    padding: 6rem 0 3rem;
  }
`;

export const Logo = styled.div`
  position: absolute;
  top: 24px;
  left: 32px;
  display: flex;
  align-items: center;

  svg {
    display: block;
    width: 80px;
    height: 80px;
  }
`;

export const LoginBox = styled.div`
  width: min(500px, calc(100% - 3rem));
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h2`
  margin: 0 0 26px;
  color: #2478e8;
  font-size: 52px;
  font-weight: 800;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const InputWrapper = styled.div`
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  height: 66px;
  padding: 0 52px;
  border: 1.5px solid #2478e8;
  border-radius: 999px;
  background-color: transparent;
  color: #2478e8;
  font-size: 20px;
  font-weight: 700;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #2478e8;
    opacity: 1;
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(36, 120, 232, 0.15);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  margin: 8px 0 0 16px;
  color: #ff4d4f;
  font-size: 16px;
  font-weight: 500;
`;

export const StatusMessage = styled.p`
  margin: 4px 0 0 16px;
  color: #ff4d4f;
  font-size: 16px;
  font-weight: 500;
`;

export const LoginButton = styled.button`
  width: 100%;
  height: 66px;
  margin-top: 8px;
  border: none;
  border-radius: 999px;
  background-color: #2478e8;
  color: #ffffff;
  font-size: 23px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background-color: #1767d4;
  }

  &:disabled {
    background-color: #8cb5ef;
    cursor: not-allowed;
  }
`;

export const LinkWrapper = styled.div`
  margin-top: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LinkText = styled.button`
  border: none;
  background: transparent;
  color: #2478e8;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
`;

export const Divider = styled.span`
  color: #2478e8;
  font-size: 16px;
`;
