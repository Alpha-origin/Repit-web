import styled from "styled-components";
import { Link } from "react-router-dom";

export const Section = styled.section`
  margin: ${({ theme }) => theme.spacing.lg} 0;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface.muted};
  border: 1px solid ${({ theme }) => theme.colors.brand.blueLight};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text.default};
  line-height: 1.7;
  overflow-wrap: anywhere;
  h2 { font-size: ${({ theme }) => theme.fontSize.lg}; margin: 0 0 0.5rem; }
  h3 { font-size: ${({ theme }) => theme.fontSize.md}; margin: 1rem 0 0.5rem; }
  p { margin: 0.25rem 0; }
  ul { margin: 0; padding-left: 1.25rem; }
  li + li { margin-top: 0.75rem; }
`;

export const QuestionLink = styled(Link)`
  display: inline-block;
  margin-right: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.brand.blue};
  text-decoration: underline;
  &:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
`;
