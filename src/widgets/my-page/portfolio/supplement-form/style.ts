import styled, { css } from "styled-components";

export { AddButton, AddRow, Count, RemoveButton, RowError } from "../document-list/style";

const fieldStyle = css`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #dfe5ed;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.white};
  color: #344159;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.sm};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder { color: #8b96a8; }
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.blue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.surface.blueLight};
  }

  @media (max-width: 36rem) {
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;

export const Project = styled.section`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: 1rem;
  border: 1px solid #e4eaf2;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface.muted};
`;

export const ProjectHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #344159;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 36rem) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Field = styled.div<{ $isFull?: boolean }>`
  ${({ $isFull }) => $isFull && "grid-column: 1 / -1;"}
  min-width: 0;
`;

export const FieldTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.375rem;
  color: #596a82;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 600;
`;

export const CharCount = styled.span`
  color: #8b96a8;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
`;

export const TextInput = styled.input`
  ${fieldStyle}
  height: 2.5rem;
`;

export const DocumentSelect = styled.select`
  ${fieldStyle}
  height: 2.5rem;
  cursor: pointer;
`;

export const TextArea = styled.textarea`
  ${fieldStyle}
  min-height: 4.5rem;
  resize: vertical;
  line-height: 1.6;
`;
