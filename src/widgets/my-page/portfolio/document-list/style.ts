import styled from "styled-components";
import { Select as JobSelect } from "@/widgets/my-page/job-selection/style";

export { Chevron, SelectWrapper } from "@/widgets/my-page/job-selection/style";

export const Select = styled(JobSelect)`
  padding-left: 0.875rem;
  background: ${({ theme }) => theme.colors.white};
`;

export const DocumentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const DocumentRow = styled.li<{ $hasError: boolean }>`
  display: grid;
  grid-template-columns: var(--mypage-document-width, 7.125rem) minmax(0, 1fr);
  align-items: center;
  column-gap: 0.375rem;

  ${({ $hasError }) => $hasError && "select, button { border-color: #e8b4b4; }"}

  @media (max-width: 36rem) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.5rem;
  }
`;

export const FileCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 0;
`;

export const AttachButton = styled.button`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: var(--mypage-control-height, 1.875rem);
  padding: 0 0.75rem 0 0.875rem;
  border: 1px solid #e1e3e9;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.surface.muted};
  color: #7c89a4;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  text-align: left;
  cursor: pointer;

  &:hover:not(:disabled) { border-color: ${({ theme }) => theme.colors.brand.blueLight}; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 2px;
  }
  &:disabled { cursor: not-allowed; }

  @media (max-width: 36rem) { min-height: 2.75rem; }
`;

export const FileName = styled.span<{ $hasFile: boolean }>`
  flex: ${({ $hasFile }) => $hasFile ? "0 1 auto" : "1"};
  min-width: 0;
  color: ${({ $hasFile }) => $hasFile ? "#51576e" : "inherit"};
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FileMeta = styled.span`
  flex-shrink: 0;
  font-size: var(--mypage-caption-size, 0.625rem);
`;

export const Plus = styled.span`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
`;

export const RemoveButton = styled.button`
  display: grid;
  place-items: center;
  flex: 0 0 1.25rem;
  height: var(--mypage-control-height, 1.875rem);
  padding: 0;
  border: none;
  border-radius: 0.25rem;
  background: transparent;
  color: #7c89a4;
  cursor: pointer;

  &:hover { background: #fceeee; color: #c24141; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 2px;
  }

  @media (max-width: 36rem) {
    flex-basis: 2.75rem;
    height: 2.75rem;
  }
`;

export const RowError = styled.p`
  grid-column: 1 / -1;
  margin-top: 0.25rem;
  color: #c24141;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  line-height: 1.6;
`;

export const AddRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.375rem;
`;

export const AddButton = styled.button`
  flex: 1;
  min-height: var(--mypage-control-height, 1.875rem);
  padding: 0 0.875rem;
  border: 1px dashed #b8c2d7;
  border-radius: 0.125rem;
  background: ${({ theme }) => theme.colors.white};
  color: #7c89a4;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  cursor: pointer;

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.surface.blueLight}; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 2px;
  }
  &:disabled { cursor: not-allowed; }

  @media (max-width: 36rem) { min-height: 2.75rem; }
`;

export const Count = styled.span`
  color: #7c89a4;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  font-variant-numeric: tabular-nums;
`;
