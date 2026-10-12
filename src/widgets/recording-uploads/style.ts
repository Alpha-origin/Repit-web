import styled from "styled-components";

export const Panel = styled.aside`
  position: fixed;
  right: ${({ theme }) => theme.spacing.md};
  bottom: ${({ theme }) => theme.spacing.md};
  z-index: 1000;
  width: min(400px, calc(100vw - 2rem));
  max-height: 35vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface.background};
  color: ${({ theme }) => theme.colors.text.default};
  box-shadow: 0 4px 24px ${({ theme }) => theme.colors.shadow.blue};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
export const Job = styled.div`
  & + & { margin-top: ${({ theme }) => theme.spacing.md}; }
`;
export const Message = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;
export const Button = styled.button`
  margin-right: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface.blueLight};
  color: ${({ theme }) => theme.colors.brand.blueAction};
  cursor: pointer;
`;
