import styled from "styled-components";

export const Card = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface.blueLight};
  color: ${({ theme }) => theme.colors.text.default};
`;
export const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
export const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
`;
export const Action = styled.button`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.brand.blue};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
