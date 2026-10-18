import styled from "styled-components";

export { Chevron, Select, SelectWrapper } from "@/widgets/my-page/job-selection/style";

export const DocumentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const DocumentRow = styled.li<{ $hasError: boolean }>`
  display: grid;
  grid-template-columns: minmax(10rem, 14rem) auto minmax(0, 1fr) auto;
  grid-template-areas: "type attach info remove" "error error error error";
  align-items: center;
  column-gap: 0.75rem;
  padding: 0.625rem 0.5rem 0.625rem 0.75rem;
  border: 1px solid ${({ $hasError }) => ($hasError ? "#e8b4b4" : "#e4eaf2")};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface.muted};

  @media (max-width: 36rem) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas: "type type remove" "attach info info" "error error error";
    row-gap: 0.5rem;
  }
`;

export const TypeCell = styled.div`
  grid-area: type;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`;

export const Badge = styled.span`
  flex-shrink: 0;
  padding: 0.1875rem 0.4375rem;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.surface.blueLight};
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.4;
`;

export const AttachCell = styled.div`
  grid-area: attach;
`;

export const AttachButton = styled.button`
  min-height: 2.25rem;
  padding: 0 0.875rem;
  border: 1px solid #dfe5ed;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.white};
  color: #465b79;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.brand.blueLight};
    background: ${({ theme }) => theme.colors.surface.blueLight};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 2px;
  }
  &:disabled { cursor: not-allowed; opacity: 0.5; }
`;

export const InfoCell = styled.div`
  grid-area: info;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  min-width: 0;
`;

export const FileName = styled.span`
  overflow: hidden;
  color: #42516b;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FileMeta = styled.span`
  flex-shrink: 0;
  color: #7b8799;
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

export const EmptyText = styled.span`
  color: #8b96a8;
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

export const RemoveCell = styled.div`
  grid-area: remove;
`;

export const RemoveButton = styled.button`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: #8290a4;
  cursor: pointer;

  &:hover { background: #fceeee; color: #c24141; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 2px;
  }
`;

export const RowError = styled.p`
  grid-area: error;
  margin-top: 0.375rem;
  color: #c24141;
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.6;
`;

export const AddRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

export const AddButton = styled.button`
  min-height: 2.25rem;
  padding: 0 0.875rem;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface.blueLight};
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) { background: #e3efff; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 2px;
  }
  &:disabled { cursor: not-allowed; opacity: 0.5; }
`;

export const Count = styled.span`
  color: #8b96a8;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-variant-numeric: tabular-nums;
`;
