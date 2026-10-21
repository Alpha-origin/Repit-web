import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

const focusRing = css`
  &:focus-visible {
    outline: 0.1875rem solid #9ec7ff;
    outline-offset: 0.1875rem;
  }
`;

export const Section = styled.section`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1.4vw, 1rem);
`;

export const BannerCard = styled.div`
  min-height: 2.5rem;
  padding: 0.25rem clamp(0.875rem, 1.8vw, 1.5rem);
  border-radius: 0.375rem;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 30rem) {
    padding: 0.875rem;
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: clamp(0.875rem, 1.7vw, 1.125rem);
  font-weight: 700;
  line-height: 1.4;
  word-break: keep-all;
`;

export const ActionLink = styled(Link)`
  flex-shrink: 0;
  min-height: 1.75rem;
  padding: 0.25rem 0.625rem;
  border: 1px solid #e2e5eb;
  border-radius: 0.375rem;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.default};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(0.75rem, 1.35vw, 0.875rem);
  line-height: 1.4;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:hover { border-color: #9ec7ff; background: #eef6ff; }
  ${focusRing}

  @media (max-width: 42rem) {
    min-height: 2.75rem;
  }
`;

export const PromotionCard = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(1rem, 3vw, 2rem);
  padding: clamp(1.25rem, 2.6vw, 2.5rem) clamp(0.875rem, 1.4vw, 1.5rem)
    clamp(1.25rem, 2.6vw, 2.5rem) clamp(1.5rem, 5.7vw, 4rem);
  border-radius: 0.375rem;
  background: ${({ theme }) => theme.colors.brand.blue};
  color: ${({ theme }) => theme.colors.white};

  @media (max-width: 42rem) {
    grid-template-columns: 1fr;
    padding: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

export const PromotionContent = styled.div`
  min-width: 0;
`;

export const PromotionTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.125rem, 2.35vw, 1.75rem);
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.03em;
  word-break: keep-all;
`;

export const PromotionDescription = styled.p`
  margin-top: 0.875rem;
  font-size: clamp(0.75rem, 1.55vw, 1rem);
  line-height: 1.5;
  word-break: keep-all;

  span { display: block; }
`;
