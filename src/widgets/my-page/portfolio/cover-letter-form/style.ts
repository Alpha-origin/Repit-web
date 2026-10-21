import styled from "styled-components";

import { TextInput as SupplementInput } from "../supplement-form/style";

export { AddButton, AddRow, Count, RemoveButton, RowError } from "../document-list/style";
export { FieldTop } from "../supplement-form/style";

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const Card = styled.section`
  min-width: 0;
  padding: 0.875rem;
  border: 1px solid #e1e3e9;
  border-radius: 0.375rem;
`;

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #51576e;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
`;

export const Field = styled.div`
  min-width: 0;
  margin-top: 0.75rem;
`;

export const TextInput = styled(SupplementInput)`
  min-width: 0;
  &[aria-invalid="true"] { border-color: #c24141; }
`;

export const QuestionArea = styled.div`
  position: relative;
`;

export const QuestionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 36rem) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ExampleButton = styled.button`
  flex-shrink: 0;
  min-height: var(--mypage-control-height, 1.875rem);
  padding: 0.375rem 0.625rem;
  border: 1px solid #c5dcff;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  cursor: pointer;

  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.blue}; outline-offset: 2px; }
  @media (max-width: 36rem) { min-height: 2.75rem; }
`;

export const ExampleMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  right: 0;
  z-index: 3;
  max-height: 19rem;
  overflow-y: auto;
  padding: 0.375rem;
  border: 1px solid #dfe5ed;
  border-radius: 0.375rem;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 4px 16px rgba(34, 55, 88, 0.1);
`;

export const ExampleOption = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  padding: 0.625rem;
  border: 0;
  border-radius: 0.25rem;
  background: transparent;
  color: #51576e;
  text-align: left;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  line-height: 1.5;
  overflow-wrap: anywhere;
  cursor: pointer;

  span { color: #7c89a4; }
  &:hover, &:focus { outline: none; background: ${({ theme }) => theme.colors.surface.blueLight}; }
`;

export const Answer = styled.textarea`
  display: block;
  width: 100%;
  min-height: 8.5rem;
  padding: 0.625rem;
  border: 1px solid #e1e3e9;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.surface.muted};
  color: #51576e;
  font-family: inherit;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  line-height: 1.6;
  resize: vertical;

  &::placeholder { color: #7c89a4; }
  &[aria-invalid="true"] { border-color: #c24141; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.blue}; outline-offset: 2px; }
  @media (max-width: 36rem) { font-size: ${({ theme }) => theme.fontSize.md}; }
`;
