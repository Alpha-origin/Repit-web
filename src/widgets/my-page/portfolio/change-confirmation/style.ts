import styled from "styled-components";

export const Dialog = styled.dialog`
  width: min(calc(100% - 2rem), 28rem);
  padding: ${({ theme }) => theme.spacing.lg};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text.default};
  background: ${({ theme }) => theme.colors.surface.background};
  &::backdrop { background: rgba(0, 0, 0, 0.4); }
`;
export const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
`;
export const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
`;
export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;
export const Cancel = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface.muted};
  color: ${({ theme }) => theme.colors.text.default};
  cursor: pointer;
`;
export const Confirm = styled(Cancel)`
  background: ${({ theme }) => theme.colors.brand.blue};
  color: ${({ theme }) => theme.colors.white};
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
