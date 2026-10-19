import styled from "styled-components";

interface TopButtonProps {
  $active: boolean;
}

export const Header = styled.header`
  position: relative;
  z-index: 1;

  width: 100%;
  min-height: clamp(4.5rem, 8vw, 5.25rem);

  box-sizing: border-box;

  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(1.5rem, 3.5vw, 3rem);

  padding: 0 clamp(1rem, 3.65vw, 3rem);
  border-bottom: 1px solid #dfe5ef;

  background-color: transparent;

  @media (max-width: 42rem) {
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.25rem 0.5rem;
    padding: 0.5rem 1rem 0;
  }
`;

export const LogoImage = styled.img`
  width: auto;
  height: clamp(3rem, 6vw, 3.75rem);

  display: block;
  flex-shrink: 0;

  justify-self: start;

  margin-left: -0.25rem;

  cursor: pointer;
`;

export const TopButtons = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: clamp(0.75rem, 2.4vw, 2rem);

  justify-self: start;

  @media (max-width: 42rem) {
    grid-row: 2;
    grid-column: 1 / -1;
    justify-self: center;
    gap: 1rem;
  }
`;

export const TopButton = styled.button<TopButtonProps>`
  position: relative;

  border: none;
  background: transparent;

  color: ${({ $active }) => ($active ? "#0061E0" : "#000000")};

  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};

  cursor: pointer;

  min-width: 0;
  min-height: 3rem;
  flex: none;
  padding: 0.875rem;

  transition:
    color 0.25s ease,
    font-weight 0.25s ease;

  &:hover {
    color: #0061e0;
  }
`;

export const StatusButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.75rem;

  justify-self: end;

  @media (max-width: 42rem) {
    grid-row: 1;
    grid-column: 2;
    gap: 0.5rem;
    min-width: 0;
  }
`;

export const StatusButton = styled.button`
  border: none;

  width: auto;
  min-width: 5rem;
  max-width: 8rem;
  height: 2.5rem;
  padding: 0 0.875rem;

  border-radius: 0.5rem;

  background-color: #3388f7;
  color: #ffffff;

  font-size: ${({ theme }) => theme.fontSize.sm};

  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  cursor: default;

  @media (max-width: 42rem) {
    max-width: 7rem;
  }
`;

export const LogoutButton = styled.button`
  border: none;

  width: auto;
  height: 1.875rem;
  min-height: 3rem;
  padding: 0 0.5rem;

  border-radius: 1rem;

  background-color: transparent;

  color: #1a73e8;

  font-size: ${({ theme }) => theme.fontSize.md};

  cursor: pointer;

  transition:
    color 0.25s ease,
    background-color 0.25s ease;

  &:hover {
    color: #c90505;
    background-color: rgba(201, 5, 5, 0.05);
  }
`;
export const ErrorMessage = styled.p`
  grid-column: 1 / -1;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.text.default};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
