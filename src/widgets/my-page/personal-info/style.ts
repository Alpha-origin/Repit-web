import styled from "styled-components";

export const PersonalInfoWrapper = styled.section`
  min-width: 0;
  border: 1px solid #e1e3e9;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.white};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: var(--mypage-card-padding, 1.75rem);

  @media (max-width: 36rem) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const Title = styled.h2`
  margin-bottom: var(--mypage-personal-title-gap, 1.5rem);
  color: #51576e;
  font-size: var(--mypage-title-size, 1.25rem);
  font-weight: 700;
  line-height: 1.4;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--mypage-personal-row-gap, 0.75rem);
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: var(--mypage-personal-label-width, 4rem) minmax(0, 1fr);
  align-items: center;
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: var(--mypage-label-size, ${({ theme }) => theme.fontSize.md});
  font-weight: 600;
  line-height: 1.4;
`;

export const EditInput = styled.input`
  width: 100%;
  min-width: 0;
  height: var(--mypage-control-height, 1.875rem);
  padding: 0 0.625rem;
  border: 1px solid #e1e3e9;
  border-radius: 0.25rem;
  outline: none;
  background: ${({ theme }) => theme.colors.white};
  color: #51576e;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.brand.blue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.surface.blueLight};
  }

  &:disabled { cursor: not-allowed; opacity: 0.65; }

  @media (max-width: 36rem) {
    min-height: 2.75rem;
    font-size: var(--mypage-label-size, ${({ theme }) => theme.fontSize.md});
  }
`;

export const StatusText = styled.p`
  color: #748095;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
`;

export const ResultMessage = styled.p<{ $isError: boolean }>`
  margin-top: 0.75rem;
  color: ${({ $isError, theme }) => $isError ? "#c24141" : theme.colors.brand.blue};
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  line-height: 1.6;
  overflow-wrap: anywhere;
`;

export const SaveButton = styled.button`
  align-self: flex-end;
  min-height: var(--mypage-personal-save-height, 1.25rem);
  margin-top: var(--mypage-personal-save-gap, 1.125rem);
  padding: 0;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  cursor: pointer;

  &:hover:not(:disabled) { text-decoration: underline; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 3px;
  }
  &:disabled { cursor: not-allowed; opacity: 0.5; }

  @media (max-width: 36rem) { min-height: 2.75rem; }
`;
