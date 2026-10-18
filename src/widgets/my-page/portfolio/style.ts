import styled, { css } from "styled-components";

const buttonStyle = css`
  min-height: 2.75rem;
  padding: 0 1.125rem;
  border: 1px solid #dfe5ed;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 3px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const PortfolioWrapper = styled.section`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid #e1e7ef;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 4px 24px rgba(34, 55, 88, 0.025);

  @media (max-width: 36rem) {
    padding: 1.5rem 1.25rem;
  }
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: #25324a;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.025em;
`;

export const Description = styled.p`
  color: #748095;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
  word-break: keep-all;
`;

export const Section = styled.section`
  margin-top: 1.75rem;

  & + & {
    padding-top: 1.75rem;
    border-top: 1px solid #edf0f5;
  }
`;

export const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const SectionNumber = styled.span`
  margin-right: 0.125rem;
  color: #95a4ba;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

export const SectionTitle = styled.h3`
  color: #344159;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 650;
  line-height: 1.5;
`;

export const Label = styled.label`
  cursor: pointer;
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

export const HiddenFileInput = styled.input`
  display: none;
`;

export const FieldHint = styled.p`
  margin-top: 0.625rem;
  color: #7b8799;
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.6;
  word-break: keep-all;
`;

export const FieldError = styled(FieldHint)`
  color: #c24141;
`;

export const GitInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-height: 3rem;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: 0.25rem 0.375rem 0.25rem 0.875rem;
  border: 1px solid #dfe5ed;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.brand.blue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.surface.blueLight};
  }
`;

export const InputIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: #8a96a8;
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 2.375rem;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #344159;
  font-size: ${({ theme }) => theme.fontSize.sm};

  &::placeholder { color: #8b96a8; }

  @media (max-width: 36rem) {
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;

export const GitAddButton = styled.button`
  ${buttonStyle}
  min-height: 2.25rem;
  padding: 0 0.875rem;
  border-color: transparent;
  background: ${({ theme }) => theme.colors.surface.blueLight};
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: ${({ theme }) => theme.fontSize.xs};

  &:hover:not(:disabled) { background: #e3efff; }
`;

export const GitUrlList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: 0.75rem;
`;

export const GitUrlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.75rem;
  padding: 0.25rem 0.375rem 0.25rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface.muted};
`;

export const LinkIndicator = styled.span`
  color: #8a96a8;
  font-size: ${({ theme }) => theme.fontSize.md};
`;

export const GitUrlText = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: #596a82;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const GitRemoveButton = styled.button`
  display: grid;
  place-items: center;
  flex: 0 0 2.25rem;
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

const SAVE_STATUS_COLORS = {
  info: "#596a82",
  success: "#1877f2",
  warning: "#a15c07",
  error: "#c24141",
} as const;

export const SaveStatus = styled.p<{ $tone: keyof typeof SAVE_STATUS_COLORS }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ $tone }) => SAVE_STATUS_COLORS[$tone]};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
  overflow-wrap: anywhere;
`;

export const InlineButton = styled.button`
  ${buttonStyle}
  min-height: 2.25rem;
  padding: 0 0.875rem;
  background: ${({ theme }) => theme.colors.white};
  color: #465b79;
  font-size: ${({ theme }) => theme.fontSize.xs};

  &:hover { background: ${({ theme }) => theme.colors.surface.muted}; }
`;

export const Notice = styled.p`
  margin-top: 1.75rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface.muted};
  color: #748095;
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

export const Guide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: #748095;
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.6;
  word-break: keep-all;
`;

export const RequiredLine = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  margin: 0.25rem 0;
  color: #596a82;
  font-weight: 600;
`;

export const GitUrlItem = styled.li`
  list-style: none;
`;

export const AnalysisStatus = styled.div`
  margin-top: 1.75rem;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid #edf0f5;

  @media (max-width: 64rem) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FooterHint = styled.p`
  color: #7b8799;
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.6;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const BackButton = styled.button`
  ${buttonStyle}
  background: ${({ theme }) => theme.colors.white};
  color: #68758a;

  &:hover { background: ${({ theme }) => theme.colors.surface.muted}; }

  @media (max-width: 36rem) { flex: 1; }
`;

export const SaveButton = styled.button`
  ${buttonStyle}
  min-width: 6rem;
  border-color: ${({ theme }) => theme.colors.brand.blue};
  background: ${({ theme }) => theme.colors.brand.blue};
  color: ${({ theme }) => theme.colors.white};

  &:hover:not(:disabled) { background: #1268d8; border-color: #1268d8; }

  @media (max-width: 36rem) { flex: 1; }
`;
