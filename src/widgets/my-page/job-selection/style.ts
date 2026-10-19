import styled from "styled-components";

export const Section = styled.section``;

export const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: var(--mypage-heading-gap, 0.5rem);
`;

export const Title = styled.h3`
  color: #51576e;
  font-size: var(--mypage-title-size, 1.25rem);
  font-weight: 700;
  line-height: 1.2;
`;

export const RequiredBadge = styled.span`
  padding: 0.125rem 0.375rem;
  border: 1px solid #c5dcff;
  border-radius: 0.125rem;
  background: ${({ theme }) => theme.colors.surface.blueLight};
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: var(--mypage-caption-size, 0.625rem);
  line-height: 1.2;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  @media (max-width: 36rem) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const CategoryGroup = styled.fieldset`
  display: flex;
  flex: 0 0 var(--mypage-category-width, 7.875rem);
  min-width: 0;
  height: var(--mypage-control-height, 1.875rem);
  border: 1px solid #c8cedd;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;

  @media (max-width: 36rem) {
    flex-basis: auto;
    height: 2.75rem;
  }
`;

export const CategoryOption = styled.label`
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  cursor: pointer;

  & + & { border-left: 1px solid #e1e3e9; }
`;

export const CategoryInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

export const CategoryText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #7c89a4;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  line-height: 1.5;
  transition: background-color 0.2s ease, color 0.2s ease;

  ${CategoryInput}:checked + & {
    background: ${({ theme }) => theme.colors.brand.blue};
    color: ${({ theme }) => theme.colors.white};
    font-weight: 600;
  }
  ${CategoryInput}:not(:checked) + &:hover {
    background: ${({ theme }) => theme.colors.surface.muted};
  }
  ${CategoryInput}:focus-visible + & {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: -2px;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

export const Select = styled.select<{ $isPlaceholder: boolean }>`
  width: 100%;
  height: var(--mypage-control-height, 1.875rem);
  padding: 0 2rem 0 0.875rem;
  border: 1px solid #e1e3e9;
  border-radius: 0.25rem;
  appearance: none;
  background: ${({ theme }) => theme.colors.surface.muted};
  color: ${({ $isPlaceholder }) => $isPlaceholder ? "#7c89a4" : "#51576e"};
  font-family: inherit;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  cursor: pointer;

  &:hover:not(:disabled) { border-color: #b9cbe4; }
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.blue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.surface.blueLight};
  }
  &:disabled { cursor: not-allowed; }

  @media (max-width: 36rem) {
    height: 2.75rem;
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;

export const Chevron = styled.svg`
  position: absolute;
  top: 50%;
  right: 0.75rem;
  width: 1rem;
  height: 1rem;
  color: #7c89a4;
  transform: translateY(-50%);
  pointer-events: none;
`;

export const Hint = styled.p`
  margin-top: 0.25rem;
  color: #7c89a4;
  font-size: var(--mypage-caption-size, 0.625rem);
  line-height: 1.5;
  word-break: keep-all;
`;
