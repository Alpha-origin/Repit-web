import styled from "styled-components";

export const Page = styled.div`
  width: calc(100% - clamp(2rem, 15.5vw, 10.25rem));
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.375rem 0 3.5rem;
  color: ${({ theme }) => theme.colors.text.default};

  button, input, select, textarea {
    font-family: inherit;
  }

  @media (min-width: 64rem) {
    --mypage-title-size: clamp(1.25rem, 1.74vw, 1.5rem);
    --mypage-label-size: clamp(1rem, 1.305vw, 1.125rem);
    --mypage-body-size: clamp(0.75rem, 1.015vw, 0.875rem);
    --mypage-caption-size: clamp(0.625rem, 0.87vw, 0.75rem);
    --mypage-control-height: clamp(1.875rem, 2.754vw, 2.375rem);
    --mypage-card-padding: clamp(1.75rem, 2.61vw, 2.25rem);
    --mypage-section-gap: clamp(1.5rem, 2.61vw, 2.25rem);
    --mypage-heading-gap: clamp(0.375rem, 0.725vw, 0.625rem);
    --mypage-supplement-gap: clamp(2rem, 2.9vw, 2.5rem);
    --mypage-footer-gap: clamp(1.5rem, 2.61vw, 2.25rem);
    --mypage-button-height: clamp(2.125rem, 3.116vw, 2.6875rem);
    --mypage-button-width: clamp(4.5rem, 6.81vw, 5.875rem);
    --mypage-category-width: clamp(7.875rem, 11.96vw, 10.3125rem);
    --mypage-document-width: clamp(7.125rem, 10.725vw, 9.25rem);
    --mypage-personal-title-gap: clamp(1.5rem, 2.61vw, 2.25rem);
    --mypage-personal-row-gap: clamp(0.75rem, 1.16vw, 1rem);
    --mypage-personal-label-width: clamp(4rem, 6.232vw, 5.375rem);
    --mypage-personal-save-gap: clamp(1.125rem, 1.884vw, 1.625rem);
    --mypage-personal-save-height: clamp(1.25rem, 1.884vw, 1.625rem);
    --mypage-supplement-min-height: clamp(36rem, 50.8vw, 43.8125rem);
    --mypage-column-gap: clamp(0.6875rem, 1.087vw, 0.9375rem);
    width: 84.4%;
    padding-top: clamp(1.375rem, calc(12vw - 7rem), 3.1875rem);
  }

  @media (max-width: 48rem) {
    width: calc(100% - 2rem);
    padding-top: 1rem;
  }
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: minmax(14.5rem, 0.358fr) minmax(0, 1fr);
  align-items: start;
  gap: var(--mypage-column-gap, 0.6875rem);

  @media (max-width: 48rem) {
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing.md};
  }
`;
