import styled, { css } from "styled-components";

import type { InterviewModeCardVariant } from "./type";

interface VariantProps {
  $variant: InterviewModeCardVariant;
}

interface ReversedProps {
  $isReversed: boolean;
}

const focusRing = css`
  &:focus-visible {
    outline: 0.1875rem solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 0.1875rem;
  }
`;

export const Card = styled.article`
  width: 100%;
  min-width: 0;
  padding: clamp(0.5rem, 1.05vw, 0.875rem);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(255, 255, 255, 0.48);
  box-shadow: 0 0.25rem 0.75rem rgba(31, 55, 87, 0.06);
`;

export const CardInner = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 2.3vw, 1.5rem);

  @media (max-width: 42rem) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const Banner = styled.div<ReversedProps>`
  position: relative;
  min-width: 0;
  min-height: clamp(11.25rem, 23.5vw, 16.5rem);
  border-radius: 0.375rem;
  overflow: hidden;
  order: ${({ $isReversed }) => ($isReversed ? 2 : 1)};

  @media (max-width: 42rem) {
    order: 1;
    min-height: 11rem;
    aspect-ratio: 1.9;
  }
`;

export const BannerImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
`;

export const BannerCopy = styled.div`
  position: absolute;
  left: clamp(1.25rem, 2.85vw, 2.75rem);
  right: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-20%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const BannerBadge = styled.button<VariantProps>`
  min-height: 1.5rem;
  padding: 0.25rem 0.875rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 0.25rem;
  font-size: clamp(0.625rem, 1.25vw, 0.8125rem);
  font-weight: 500;
  line-height: 1.2;
  background: ${({ $variant, theme }) => $variant === "dark" ? theme.colors.white : theme.colors.brand.blueAction};
  color: ${({ $variant, theme }) => $variant === "dark" ? theme.colors.brand.blue : theme.colors.white};
  cursor: pointer;

  &:disabled { cursor: default; }
  ${focusRing}
`;

export const BannerTitle = styled.h2<VariantProps>`
  margin: 0;
  color: ${({ $variant, theme }) => $variant === "dark" ? theme.colors.white : theme.colors.brand.blue};
  font-size: clamp(1.75rem, 3.4vw, 2.875rem);
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.04em;
  word-break: keep-all;
`;

export const Content = styled.div<ReversedProps>`
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  order: ${({ $isReversed }) => ($isReversed ? 1 : 2)};
  padding: ${({ $isReversed }) => $isReversed ? "0.25rem 0 0.25rem 0.375rem" : "0.25rem 0.375rem 0.25rem 0"};

  @media (max-width: 42rem) {
    order: 2;
    padding: 0.25rem;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

export const DescriptionRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
`;

export const CheckIcon = styled.img<ReversedProps>`
  width: clamp(1rem, 2vw, 1.375rem);
  height: clamp(1rem, 2vw, 1.375rem);
  display: block;
  flex-shrink: 0;
  object-fit: contain;
  margin-top: 0.125rem;
  margin-left: ${({ $isReversed }) => ($isReversed ? "auto" : "0")};
`;

export const Description = styled.p<ReversedProps>`
  min-width: 0;
  margin: 0;
  flex: ${({ $isReversed }) => ($isReversed ? "0 1 auto" : "1")};
  color: ${({ theme }) => theme.colors.text.default};
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  line-height: 1.5;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const AiBadge = styled.span<ReversedProps>`
  order: ${({ $isReversed }) => ($isReversed ? -1 : 0)};
  min-width: clamp(3.25rem, 6.5vw, 4.25rem);
  min-height: clamp(1.5rem, 3.15vw, 2rem);
  padding: 0.125rem 0.75rem;
  flex-shrink: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(0, 65, 150, 0.08);
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0.125rem 0.25rem rgba(31, 55, 87, 0.04);
  color: #487dff;
  font-size: clamp(1rem, 2.1vw, 1.375rem);
  font-weight: 700;
  line-height: 1.2;
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  align-items: start;
  margin: 0.5rem 0;
`;

export const FeatureItem = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  text-align: center;
`;

export const FeatureDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.default};
  font-size: clamp(0.6875rem, 1.4vw, 0.9375rem);
  line-height: 1.45;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const FeatureTitle = styled.strong<VariantProps>`
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: clamp(0.9375rem, 1.95vw, 1.375rem);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.035em;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const StartButton = styled.button<VariantProps>`
  width: 100%;
  min-height: clamp(1.875rem, 3.6vw, 2.75rem);
  padding: 0.375rem 1rem;
  border: 1px solid ${({ $variant }) => $variant === "dark" ? "#d5e4fa" : "transparent"};
  border-radius: 0.375rem;
  background: ${({ $variant, theme }) => $variant === "dark" ? theme.colors.white : theme.colors.brand.blue};
  color: ${({ $variant, theme }) => $variant === "dark" ? theme.colors.brand.blue : theme.colors.white};
  font-size: clamp(0.8125rem, 1.5vw, 1rem);
  font-weight: 600;
  line-height: 1.35;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ $variant }) => $variant === "dark" ? "#eef6ff" : "#1267dc"};
    box-shadow: 0 0.25rem 0.75rem rgba(24, 119, 242, 0.12);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  ${focusRing}

  @media (max-width: 42rem) {
    min-height: 2.75rem;
  }
`;
