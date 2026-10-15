import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const TabGroup = styled.nav`
  display: inline-flex;
  flex-shrink: 0;
  padding: 0.1875rem;
  border: 1px solid #e1e3e7;
  border-radius: 0.375rem;
  background: #ededed;
`;

export const TabLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.625rem;
  padding: 0.25rem 0.625rem;
  border-radius: 0.25rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.default};
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;

  &[aria-current="page"] {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.brand.blue};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 2px;
  }
`;
