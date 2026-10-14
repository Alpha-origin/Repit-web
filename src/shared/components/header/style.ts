import styled, { css } from "styled-components";

interface TopButtonProps {
  $active: boolean;
}

const BaseHeader = styled.header`
  position: relative;
  z-index: 1;

  width: 100%;
  min-height: 5rem;

  box-sizing: border-box;

  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;

  padding: 0 2.5rem;

  background-color: transparent;

  @media (max-width: 72rem) {
    padding: 0 1.5rem;
  }

  @media (max-width: 56rem) {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
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
    margin-left: 0;
  }
`;

export const TopButtons = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 2.5rem;

  justify-self: center;

  margin-top: 0.2rem;

  @media (max-width: 56rem) {
    gap: 0.5rem;
    width: 100%;
    margin-top: 0;
  }
`;

export const TopButton = styled.button<TopButtonProps>`
  position: relative;

  border: none;
  background: transparent;

  color: ${({ $active }) => ($active ? "#0061E0" : "#000000")};

  font-size: 1.1rem;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};

  cursor: pointer;

  padding: 1rem 1.25rem 1rem;

  transition:
    color 0.25s ease,
    font-weight 0.25s ease;

  &::after {
    content: "";

    position: absolute;

    left: 50%;
    bottom: 0.35rem;

    width: ${({ $active }) => ($active ? "3.2rem" : "0")};
    height: 3px;

    border-radius: 999px;

    background-color: #0061e0;

    transform: translateX(-50%);

    transition: width 0.25s ease;
  }

  &:hover {
    color: #0061e0;
  }

  @media (max-width: 56rem) {
    flex: 1;
    padding: 0.8rem 0.5rem 0.9rem;
    font-size: 0.95rem;
  }

  @media (max-width: 36rem) {
    min-width: 5rem;
    font-size: 0.9rem;
  }
`;

export const StatusButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.5rem;

  justify-self: end;

  @media (max-width: 56rem) {
    justify-self: center;
    gap: 0.75rem;
  }
`;

export const StatusButton = styled.button`
  border: none;

  width: 5.5rem;
  height: 2.5rem;

  border-radius: 0.5rem;

  background-color: #3388f7;
  color: #ffffff;

  font-size: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: default;

  @media (max-width: 56rem) {
    width: 6rem;
    height: 2.8rem;
    font-size: 0.95rem;
  }
`;

export const LogoutButton = styled.button`
  border: none;

  width: 6.5rem;
  height: 3rem;

  border-radius: 1rem;

  background-color: transparent;

  color: #1a73e8;

  font-size: 1rem;

  cursor: pointer;

  transition:
    color 0.25s ease,
    background-color 0.25s ease;

  &:hover {
    color: #c90505;
    background-color: rgba(201, 5, 5, 0.05);
  }

  @media (max-width: 56rem) {
    width: 6rem;
    height: 2.8rem;
    font-size: 0.95rem;
  }
`;
export const ErrorMessage = styled.p`
  grid-column: 1 / -1;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.text.default};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

export const Header = styled(BaseHeader)<{ $compact?: boolean; $detail?: boolean }>`
  ${({ $compact }) => $compact && css`
    min-height: 4.1875rem;
    grid-template-columns: auto 1fr auto;
    gap: 2rem;
    padding: 0 2rem;
    border-bottom: 1px solid #dfe5ef;

    ${LogoImage} { height: 3rem; margin-left: -0.25rem; justify-self: start; }
    ${TopButtons} { justify-self: start; width: auto; gap: 2rem; margin: 0; }
    ${TopButton} {
      min-width: 0;
      flex: none;
      padding: 0.75rem;
      font-size: 0.8125rem;
      &::after { display: none; }
    }
    ${StatusButtons} { justify-self: end; gap: 0.75rem; }
    ${StatusButton} { width: 4.25rem; height: 1.875rem; font-size: 0.75rem; border-radius: 0.375rem; }
    ${LogoutButton} { width: auto; height: 1.875rem; padding: 0 0.375rem; font-size: 0.8125rem; }

    @media (max-width: 42rem) {
      grid-template-columns: auto 1fr;
      gap: 0.25rem 0.5rem;
      padding: 0.5rem 1rem;
      ${TopButtons} { grid-row: 2; grid-column: 1 / -1; justify-self: center; gap: 1.5rem; }
      ${StatusButtons} { grid-row: 1; grid-column: 2; }
    }
  `}
  ${({ $detail }) => $detail && css`
    min-height: 5rem;
    padding: 0 1.5rem;
    ${LogoImage} { height: 3.75rem; }
    ${TopButton} { font-size: 0.875rem; }
    ${StatusButton} { width: 4.875rem; height: 2.125rem; font-size: 0.8125rem; }
    ${LogoutButton} { font-size: 0.875rem; }

    @media (max-width: 42rem) {
      padding: 0.5rem 1rem;
      ${LogoImage} { height: 3rem; }
    }
  `}
`;
