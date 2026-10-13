import styled from "styled-components";

export const PersonalInfoWrapper = styled.section`
  min-width: 0;
  border: 1px solid #e1e7ef;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 4px 24px rgba(34, 55, 88, 0.025);
  overflow: hidden;
`;

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 1.75rem;
  border-bottom: 1px solid #edf0f5;
  background: linear-gradient(180deg, #f5f9ff 0%, #ffffff 100%);
  text-align: center;
`;

export const Avatar = styled.div`
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border: 1px solid #dce9fc;
  border-radius: ${({ theme }) => theme.radius.circle};
  background: ${({ theme }) => theme.colors.surface.blueLight};
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 700;
`;

export const ProfileName = styled.p`
  max-width: 100%;
  color: #25324a;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5;
  overflow-wrap: anywhere;
`;

export const ProfileCaption = styled.p`
  margin-top: 0.375rem;
  color: #778398;
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.5;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const Title = styled.h2`
  color: #344159;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  line-height: 1.5;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
`;

export const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Label = styled.label`
  color: #566176;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  line-height: 1.4;
`;

export const EditInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 2.75rem;
  padding: 0 0.875rem;
  border: 1px solid #dfe5ed;
  border-radius: ${({ theme }) => theme.radius.sm};
  outline: none;
  background: ${({ theme }) => theme.colors.white};
  color: #344159;
  font-size: ${({ theme }) => theme.fontSize.sm};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.brand.blue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.surface.blueLight};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  &:read-only {
    background: ${({ theme }) => theme.colors.surface.muted};
    color: #788397;
  }

  @media (max-width: 36rem) {
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;

export const FieldHint = styled.p`
  color: #7b8799;
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.5;
`;

export const StatusText = styled.p`
  color: #68758a;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
`;

export const ResultMessage = styled.p<{ $isError: boolean }>`
  color: ${({ $isError, theme }) =>
    $isError ? "#c24141" : theme.colors.brand.blue};
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.6;
  overflow-wrap: anywhere;
`;

export const SaveButton = styled.button`
  width: 100%;
  min-height: 2.75rem;
  border: 1px solid #dce7f8;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface.blueLight};
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: #e3efff;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 3px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
