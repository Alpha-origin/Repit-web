import { css } from "styled-components";

export const pageLayout = css`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.contentPadding} ${({ theme }) => theme.spacing.xl};
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.layout.mobileBreakpoint}) {
    padding-inline: ${({ theme }) => theme.spacing.md};
  }
`;
