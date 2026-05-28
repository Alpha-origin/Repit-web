import { LANDING_STYLE } from "@/shared/constants/landing-page/first-section";
import styled from "styled-components";

export const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoImage = styled.img`
  width: auto;
  height: clamp(3.4rem, 6vw, 3.9rem);
  flex-shrink: 0;
  display: block;
`;

export const Nav = styled.div`
  display: flex;
  gap: 0.875rem;
`;

export const SignUp = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  padding: 0.5rem 0.375rem;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${LANDING_STYLE.gradientAccent};
  }
`;

export const Login = styled.button`
  background: ${LANDING_STYLE.login};
  border: none;
  color: ${({ theme }) => theme.colors.white};
  min-height: 2.25rem;
  padding: 0.55rem 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: ${LANDING_STYLE.loginHover};
  }
`;
