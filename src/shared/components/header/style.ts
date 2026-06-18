import styled, { css } from "styled-components";

interface TopButtonProps {
  $active: boolean;
}

const topButtonGlow = css`
  color: #0061e0;

  text-shadow:
    0 0 1.875rem rgba(0, 97, 224, 0.95),
    0 0 5rem rgba(0, 97, 224, 0.85),
    0 0 8.75rem rgba(0, 97, 224, 0.7);
`;

export const Header = styled.header`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 4.25rem;
  background-color: transparent;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  padding: 0 2.5rem;
  margin-top: 0.6rem;

  @media (max-width: 72rem) {
    padding: 0 1.5rem;
  }

  @media (max-width: 56rem) {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem 0;
  }
`;

export const LogoImage = styled.img`
  width: auto;
  height: 3.75rem;
  display: block;
  flex-shrink: 0;
  justify-self: start;
  margin-left: -1rem;
  cursor: pointer;

  @media (max-width: 56rem) {
    height: 3.1rem;
    justify-self: center;
  }
`;

export const TopButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  justify-self: center;

  @media (max-width: 56rem) {
    gap: 0.75rem;
    width: 100%;
  }
`;

export const TopButton = styled.button<TopButtonProps>`
  border: none;
  background: none;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  color: #004196;
  padding: 1rem 2rem;
  border-radius: 999rem;
  transition: color 0.2s ease, text-shadow 0.2s ease;

  ${({ $active }) => $active && topButtonGlow}

  &:hover {
    ${topButtonGlow}
  }

  @media (max-width: 56rem) {
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
  }

  @media (max-width: 36rem) {
    flex: 1 1 calc(33.333% - 0.5rem);
    min-width: 5rem;
    padding: 0.8rem 0.5rem;
  }
`;

export const StatusButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  justify-self: end;

  @media (max-width: 56rem) {
    justify-self: center;
    gap: 0.75rem;
  }
`;

export const StatusButton = styled.button`
  border: none;
  font-size: 1rem;
  width: 5.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: #3388F7;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 56rem) {
    width: 6rem;
    height: 2.8rem;
    font-size: 0.95rem;
  }
`;

export const LogoutButton = styled.button`
  border: none;
  font-size: 1rem;
  width: 6.5rem;
  height: 3rem;
  border-radius: 1rem;
  cursor: pointer;
  background-color: transparent;
  color: #1A73E8;

  @media (max-width: 56rem) {
    width: 6rem;
    height: 2.8rem;
    font-size: 0.95rem;
  }
`;
