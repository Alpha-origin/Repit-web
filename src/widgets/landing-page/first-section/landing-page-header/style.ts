import { LANDING_STYLE } from "@/shared/constants/landing-page/first-section";
import styled from "styled-components";

export const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 1.25rem 1.875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  font-size: 1.875rem;
  font-weight: 800;
  color: ${LANDING_STYLE.logo};

  svg {
    width: 3.5rem;
    height: 3.5rem;
    flex-shrink: 0;
    display: block;
  }
`;

export const Nav = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const SignUp = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.8125rem;
  cursor: pointer;
`;

export const Login = styled.button`
  background: ${LANDING_STYLE.login};
  border: none;
  color: ${({ theme }) => theme.colors.white};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;

  &:hover {
    background: ${LANDING_STYLE.loginHover};
  }
`;
