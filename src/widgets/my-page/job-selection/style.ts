import styled from "styled-components";

export const Section = styled.section`
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid #edf0f5;
`;

export const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const SectionNumber = styled.span`
  margin-right: 0.125rem;
  color: #95a4ba;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

export const Title = styled.h3`
  color: #344159;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 650;
  line-height: 1.5;
`;

export const RequiredBadge = styled.span`
  padding: 0.1875rem 0.4375rem;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.surface.blueLight};
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.4;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 64rem) and (min-width: 56.01rem), (max-width: 36rem) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const CategoryGroup = styled.fieldset`
  display: flex;
  flex: 0 0 11rem;
  min-width: 0;
  height: 2.75rem;
  padding: 0.1875rem;
  border: 1px solid #dfe5ed;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface.muted};

  @media (max-width: 64rem) and (min-width: 56.01rem), (max-width: 36rem) {
    flex-basis: auto;
  }
`;

export const CategoryOption = styled.label`
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  cursor: pointer;
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
  border-radius: 0.375rem;
  color: #748095;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  line-height: 1.5;
  transition: background-color 0.2s ease, color 0.2s ease;

  ${CategoryInput}:checked + & {
    background: ${({ theme }) => theme.colors.brand.blue};
    color: ${({ theme }) => theme.colors.white};
  }

  ${CategoryInput}:not(:checked) + &:hover {
    background: ${({ theme }) => theme.colors.surface.blueLight};
    color: ${({ theme }) => theme.colors.brand.blue};
  }

  ${CategoryInput}:focus-visible + & {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 3px;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

export const Select = styled.select<{ $isPlaceholder: boolean }>`
  width: 100%;
  height: 2.75rem;
  padding: 0 2.5rem 0 0.875rem;
  border: 1px solid #dfe5ed;
  border-radius: ${({ theme }) => theme.radius.sm};
  appearance: none;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ $isPlaceholder }) => $isPlaceholder ? "#8b96a8" : "#344159"};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.sm};
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover { border-color: #b9cbe4; }
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.blue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.surface.blueLight};
  }

  @media (max-width: 36rem) {
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;

export const Chevron = styled.svg`
  position: absolute;
  top: 50%;
  right: 0.875rem;
  width: 1.125rem;
  height: 1.125rem;
  color: #8290a4;
  transform: translateY(-50%);
  pointer-events: none;
`;

export const Hint = styled.p`
  margin-top: 0.625rem;
  color: #7b8799;
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.6;
  word-break: keep-all;
`;
