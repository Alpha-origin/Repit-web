import styled, { css } from "styled-components";

export { RequiredBadge } from "../job-selection/style";

const buttonStyle = css`
  min-height: var(--mypage-button-height, 2.125rem);
  padding: 0 1rem;
  border: 1px solid #dfe5ed;
  border-radius: 0.25rem;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 3px;
  }
  &:disabled { cursor: not-allowed; opacity: 0.5; }

  @media (max-width: 36rem) { min-height: 2.75rem; }
`;

export const PortfolioWrapper = styled.section<{ $hasSupplements: boolean }>`
  min-width: 0;
  min-height: ${({ $hasSupplements }) => $hasSupplements ? "var(--mypage-supplement-min-height, 36rem)" : "29.25rem"};
  padding: var(--mypage-card-padding, 1.75rem) var(--mypage-card-padding, 1.75rem) 2.5rem;
  border: 1px solid #e1e3e9;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.white};

  @media (max-width: 36rem) {
    padding: 1.5rem;
  }
`;

export const Section = styled.section`
  margin-top: var(--mypage-section-gap, 2rem);

  & + & {
    margin-top: 3rem;
  }
`;

export const SupplementSection = styled(Section)`
  && { margin-top: var(--mypage-supplement-gap, 2rem); }
`;

export const SectionHeading = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: var(--mypage-heading-gap, 0.375rem);
`;

export const SectionTitle = styled.h3`
  color: #51576e;
  font-size: var(--mypage-title-size, 1.25rem);
  font-weight: 700;
  line-height: 1.2;
`;

export const Label = styled.label`
  cursor: pointer;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const FieldHint = styled.p`
  margin-top: 0.25rem;
  color: #7c89a4;
  font-size: var(--mypage-caption-size, 0.625rem);
  line-height: 1.5;
  word-break: keep-all;
`;

export const FieldError = styled(FieldHint)`
  color: #c24141;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
`;

export const GuideDetails = styled.details`
  position: relative;
  margin-left: auto;

  @media (max-width: 64rem) {
    flex-basis: 100%;
    margin-left: 0;
  }
`;

export const GuideSummary = styled.summary`
  width: fit-content;
  padding: 0.25rem 0.75rem;
  border: 1px solid #e1e3e9;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: #f0f5ff;
  color: #51576e;
  font-size: var(--mypage-caption-size, 0.625rem);
  line-height: 1.4;
  list-style: none;
  cursor: pointer;

  &::-webkit-details-marker { display: none; }
  strong { color: ${({ theme }) => theme.colors.brand.blue}; font-weight: 600; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 2px;
  }
`;

export const Guide = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 2;
  width: min(20rem, 100vw - 6rem);
  padding: 0.875rem;
  border: 1px solid #dfe5ed;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 4px 16px rgba(34, 55, 88, 0.08);
  color: #748095;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  line-height: 1.6;
  word-break: keep-all;

  p + p { margin-top: 0.5rem; }

  @media (max-width: 64rem) { right: auto; left: 0; }
`;

export const GitInputWrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: var(--mypage-control-height, 1.875rem);
  padding: 0 0.75rem 0 0.875rem;
  border: 1px solid #e1e3e9;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.surface.muted};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.brand.blue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.surface.blueLight};
  }
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  width: 100%;
  height: calc(var(--mypage-control-height, 1.875rem) - 0.125rem);
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #51576e;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});

  &::placeholder { color: #7c89a4; }

  @media (max-width: 36rem) {
    min-height: 2.75rem;
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;

export const GitAddButton = styled.button`
  ${buttonStyle}
  min-height: calc(var(--mypage-control-height, 1.875rem) - 0.125rem);
  padding: 0 0.25rem 0 0.75rem;
  border: none;
  background: transparent;
  color: #51576e;

  &:hover:not(:disabled) { color: ${({ theme }) => theme.colors.brand.blue}; }
`;

export const GitUrlList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.375rem;
`;

export const GitUrlItem = styled.li`
  list-style: none;
`;

export const GitUrlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 0;
`;

export const GitUrlText = styled.span`
  flex: 1;
  min-width: 0;
  min-height: var(--mypage-control-height, 1.875rem);
  padding: 0.375rem 0.875rem;
  overflow: hidden;
  border: 1px solid #e1e3e9;
  border-radius: 0.25rem;
  color: #7c89a4;
  font-size: var(--mypage-body-size, ${({ theme }) => theme.fontSize.xs});
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const GitRemoveButton = styled.button`
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
  background: ${({ theme }) => theme.colors.white};
  color: #465b79;

  &:hover { background: ${({ theme }) => theme.colors.surface.muted}; }
`;

export const AnalysisStatus = styled.div`
  margin-top: 1.75rem;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: var(--mypage-footer-gap, 1.5rem);
`;

export const AnalysisHint = styled(FieldHint)`
  margin-top: 0.375rem;
  text-align: right;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  @media (max-width: 36rem) { width: 100%; }
`;

export const BackButton = styled.button`
  ${buttonStyle}
  min-width: var(--mypage-button-width, 4.5rem);
  border-color: ${({ theme }) => theme.colors.brand.blue};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.brand.blue};

  &:hover { background: ${({ theme }) => theme.colors.surface.blueLight}; }
  @media (max-width: 36rem) { flex: 1; }
`;

export const SaveButton = styled.button`
  ${buttonStyle}
  min-width: var(--mypage-button-width, 4.5rem);
  border-color: ${({ theme }) => theme.colors.brand.blue};
  background: ${({ theme }) => theme.colors.brand.blue};
  color: ${({ theme }) => theme.colors.white};

  &:hover:not(:disabled) { background: #1268d8; }
  &:disabled {
    border-color: #bdbdbd;
    background: #f5f5f5;
    color: #51576e;
    opacity: 1;
  }
  @media (max-width: 36rem) { flex: 1; }
`;
