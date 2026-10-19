import styled, { css } from "styled-components";

export { AddButton, AddRow, Count, RemoveButton, RowError } from "../document-list/style";

export const FormFields = styled.fieldset`
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;

  &:disabled textarea, &:disabled input, &:disabled select {
    cursor: not-allowed;
  }
`;

const fieldStyle = css`
  width: 100%;
  padding: 0.375rem 0.625rem;
  border: 1px solid #e1e3e9;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.surface.muted};
  color: #51576e;
  font-family: inherit;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder { color: #7c89a4; }
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.blue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.surface.blueLight};
  }

  @media (max-width: 36rem) {
    min-height: 2.75rem;
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;

export const Project = styled.section`
  & + & {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e1e3e9;
  }
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
  gap: 0.5rem 0.625rem;

  @media (max-width: 36rem) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Field = styled.div`
  min-width: 0;
`;

export const FieldTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  color: #51576e;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  font-weight: 600;
`;

export const TextInput = styled.input`
  ${fieldStyle}
  height: var(--mypage-control-height, 1.875rem);
`;

export const DocumentSelect = styled.select`
  ${fieldStyle}
  height: var(--mypage-control-height, 1.875rem);
  cursor: pointer;
`;

export const TextArea = styled.textarea`
  ${fieldStyle}
  display: block;
  height: var(--mypage-control-height, 1.875rem);
  min-height: var(--mypage-control-height, 1.875rem);
  resize: none;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:focus {
    min-height: 4.5rem;
    overflow: auto;
    white-space: pre-wrap;
  }
`;
