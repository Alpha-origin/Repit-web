import styled from "styled-components";

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
