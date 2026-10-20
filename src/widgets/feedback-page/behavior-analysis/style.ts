import styled from "styled-components";

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface.muted};
  color: ${({ theme }) => theme.colors.text.default};
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: anywhere;
  h2 { font-size: ${({ theme }) => theme.fontSize.lg}; }
  h3 { font-size: ${({ theme }) => theme.fontSize.md}; }
`;
export const Explanation = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
export const Badge = styled.p`
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface.blueLight};
  border-radius: ${({ theme }) => theme.radius.sm};
`;
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;
export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  strong { font-size: ${({ theme }) => theme.fontSize.xl}; }
`;
export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;
export const Button = styled.button`
  min-height: 2.75rem;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.strong};
  border: 1px solid currentColor;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  &:disabled { opacity: 0.55; cursor: default; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.blue}; outline-offset: 3px; }
`;
export const Select = styled.select`
  display: block;
  max-width: 100%;
  min-height: 2.75rem;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text.strong};
  background: ${({ theme }) => theme.colors.white};
`;
export const TableScroll = styled.div`
  overflow-x: auto;
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.blue}; }
`;
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: ${({ theme }) => theme.fontSize.sm};
  caption { text-align: left; padding: ${({ theme }) => theme.spacing.sm}; }
  th, td { padding: ${({ theme }) => theme.spacing.sm}; border-bottom: 1px solid currentColor; }
  th { white-space: nowrap; }
`;
export const List = styled.ul`
  padding-left: ${({ theme }) => theme.spacing.lg};
  list-style: disc;
`;
