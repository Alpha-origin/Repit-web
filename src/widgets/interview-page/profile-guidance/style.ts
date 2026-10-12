import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.default};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;

  a, button { color: ${({ theme }) => theme.colors.brand.blue}; }
  button { border: 0; background: none; cursor: pointer; text-decoration: underline; }
`;
