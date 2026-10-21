import { Link } from "react-router-dom";
import styled from "styled-components";

import type { NavButtonStyleProps } from "./type";

export const Section = styled.section`
  width: 50%;
  min-height: 42rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem clamp(1.5rem, 4vw, 4rem) 3rem;
  box-sizing: border-box;

  @media (max-width: 60rem) {
    width: 100%;
    min-height: auto;
    padding: 6.25rem 1.5rem 2.5rem;
  }
`;

export const Header = styled.header`
  position: absolute;
  top: 1.45rem;
  left: 1.5rem;
  right: 1.75rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;

  @media (max-width: 60rem) {
    top: 1rem;
    left: 1rem;
    right: 1rem;
  }
`;

export const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  pointer-events: auto;

  img {
    display: block;
    width: 5.9rem;
    height: auto;
  }

  @media (max-width: 60rem) {
    img {
      width: 5rem;
    }
  }
`;

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  pointer-events: auto;
`;

export const NavButton = styled.button<NavButtonStyleProps>`
  min-width: ${({ $active }) => ($active ? "4.6rem" : "auto")};
  height: ${({ $active }) => ($active ? "2.05rem" : "auto")};
  padding: ${({ $active }) => ($active ? "0 1rem" : "0")};
  border: none;
  border-radius: 0.4rem;
  background-color: ${({ $active }) => ($active ? "#3388f7" : "transparent")};
  color: ${({ $active, theme }) => ($active ? "#ffffff" : theme.colors.brand.blue)};
  box-shadow: ${({ $active }) => ($active ? "0 0.25rem 0.125rem rgba(0, 0, 0, 0.25)" : "none")};
  font-family: ${({ theme }) => theme.fontFamily.pretendard};
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  &:not(:disabled):hover {
    color: ${({ $active }) => ($active ? "#ffffff" : "#1767d4")};
    background-color: ${({ $active }) => ($active ? "#287be6" : "transparent")};
  }

  @media (max-width: 32rem) {
    min-width: ${({ $active }) => ($active ? "4.1rem" : "auto")};
    font-size: 0.85rem;
  }
`;

export const Content = styled.div`
  position: relative;
  width: min(26rem, 100%);
  color: ${({ theme }) => theme.colors.brand.blue};

  @media (max-width: 60rem) {
    width: 100%;
    max-width: 28rem;
    text-align: center;
  }
`;

export const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.55rem;
  padding-bottom: 1.25rem;

  @media (max-width: 60rem) {
    align-items: center;
    padding-bottom: 0;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamily.calSans};
  font-size: clamp(3.1rem, 5.8vw, 4.2rem);
  line-height: 0.98;
  font-weight: 500;
  letter-spacing: 0;
`;

export const Description = styled.p`
  margin: 0;
  color: rgba(0, 0, 0, 0.58);
  font-size: clamp(0.95rem, 1.25vw, 1.05rem);
  font-weight: 400;
  line-height: 1.45;
  word-break: keep-all;
  font-family: ${({ theme }) => theme.fontFamily.A2Z};
`;

export const SwitchButton = styled.button`
  min-width: 8.75rem;
  height: 2.85rem;
  padding: 0 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0.1563rem solid #a8d8ff;
  border-radius: ${({ theme }) => theme.radius.pill};
  background-color: ${({ theme }) => theme.colors.brand.blue};
  color: #ffffff;
  box-shadow:
    inset 0 0.35rem 0.7rem rgba(53, 106, 185, 0.09),
    inset 0 -0.0625rem 0.0625rem rgba(151, 193, 255, 0.4);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background-color: #1767d4;
    transform: translateY(-0.0625rem);
  }

  &:focus-visible {
    outline: 0.1875rem solid rgba(26, 115, 232, 0.22);
    outline-offset: 0.25rem;
  }
`;
