import styled, { css } from "styled-components";

interface TopButtonProps {
  $active: boolean;
}

const topButtonGlow = css`
  color: #0061e0;

  text-shadow:
    0 0 30px rgba(0, 97, 224, 0.95),
    0 0 80px rgba(0, 97, 224, 0.85),
    0 0 140px rgba(0, 97, 224, 0.7);
`;

export const Header = styled.header`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 4.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2.5rem;
  margin-top: 0.6rem;
`;

export const LogoImage = styled.img`
  width: auto;
  height: 3.75rem;
  display: block;
  flex-shrink: 0;
`;

export const TopButtons = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

export const TopButton = styled.button<TopButtonProps>`
  border: none;
  background: none;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  color: #004196;
  padding: 1rem 2rem;
  border-radius: 999px;
  transition: color 0.2s ease, text-shadow 0.2s ease;

  ${({ $active }) => $active && topButtonGlow}

  &:hover {
    ${topButtonGlow}
  }
`;

export const StatusButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
`;

export const StatusButton = styled.button`
  border: none;
  font-size: 1.1rem;
  width: 6.5rem;
  height: 3rem;
  border-radius: 1rem;
  cursor: pointer;
  background-color: #3388f7;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LogoutButton = styled.button`
  border: none;
  font-size: 1.1rem;
  width: 6.5rem;
  height: 3rem;
  border-radius: 1rem;
  cursor: pointer;
  background-color: transparent;
  color: #1A73E8;
`;
