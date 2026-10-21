import styled, { css } from "styled-components";

import { pageLayout } from "@/shared/styles/pageLayout";

interface StatusBadgeProps {
  $complete: boolean;
}

const focusRing = css`
  &:focus-visible {
    outline: 0.125rem solid rgba(26, 115, 232, 0.32);
    outline-offset: 0.125rem;
  }
`;

export const Page = styled.div`
  ${pageLayout}
  min-height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

export const Panel = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
`;

export const Toolbar = styled.div`
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 34rem) {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #1a73e8;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.25;
`;


export const SortSelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  &::after {
    content: "";
    position: absolute;
    right: 0.8rem;
    width: 0.4rem;
    height: 0.4rem;
    border-right: 0.1rem solid #1a73e8;
    border-bottom: 0.1rem solid #1a73e8;
    pointer-events: none;
    transform: translateY(-0.12rem) rotate(45deg);
  }
`;
export const SortControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 30rem) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

export const SortSelect = styled.select`
  appearance: none;
  min-height: 2.8rem;
  padding: 0.65rem 2.5rem 0.65rem 1rem;

  border: 1px solid #d8e2f0;
  border-radius: 0.5rem;
  background: #f3f7ff;
  color: #1a73e8;

  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;

  &:focus,
  &:focus-visible,
  &:active {
    outline: none !important;
    box-shadow: none !important;
  }
`;

export const SortDirectionButton = styled.button`
  min-height: 2.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: 0.65rem 1rem;

  border: 1px solid #d8e2f0;
  border-radius: 0.5rem;
  background: #ffffff;
  color: #344054;

  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;

  ${focusRing}
`;


export const List = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 60rem) {
    grid-template-columns: 1fr;
  }
`;

export const StateCard = styled.div`
  width: 100%;
  min-height: 11rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 2rem;
  border: 0.0625rem dashed #bfd1ef;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.86);
  text-align: center;
`;

export const StateText = styled.p`
  margin: 0;
  max-width: 36rem;
  color: #4f6389;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  overflow-wrap: anywhere;
`;

export const RetryButton = styled.button`
  appearance: none;
  min-width: 7rem;
  height: 2.6rem;
  border: none;
  border-radius: 0.5rem;
  background: #1f6fe4;
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-0.05rem);
    filter: brightness(1.03);
  }

  ${focusRing}
`;

export const FeedbackCard = styled.button`
  appearance: none;
  position: relative;
  width: 100%;
  min-width: 0;
  min-height: 11rem;

  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  align-items: center;

  column-gap: 2rem;

  padding: 1.25rem 6.5rem 1.25rem 1.25rem;

  border: 0.0625rem solid #d8dde8;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.95);

  color: inherit;
  cursor: pointer;
  font-family: inherit;
  text-align: left;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #9cc5fb;
    box-shadow: 0 0.65rem 1.4rem rgba(26, 115, 232, 0.08);
    transform: translateY(-0.05rem);
  }

  ${focusRing}

  @media (max-width: 60rem) {
    min-height: 10.5rem;
    grid-template-columns: 7rem minmax(0, 1fr);
    column-gap: 1.5rem;
    padding-right: 6rem;
  }

  @media (max-width: 30rem) {
    grid-template-columns: 5.5rem minmax(0, 1fr);
    min-height: 8.5rem;
    padding: 0.9rem;
  }
`;

export const CardImage = styled.img`
  width: 7.5rem;
  height: 8.5rem;
  display: block;
  border-radius: 0.3rem;
  background: #edf1f8;
  object-fit: cover;

  @media (max-width: 60rem) {
    width: 7rem;
    height: 8rem;
  }

  @media (max-width: 30rem) {
    width: 5.5rem;
    height: 6.2rem;
  }
`;

export const CardBody = styled.div`
  min-width: 0;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

export const CardTitle = styled.h3`
  margin: 0;
  color: #30343b;
  font-size: 1.2rem;
  font-weight: 900;
  line-height: 1.25;
`;

export const ScoreLine = styled.p`
  margin: 0;
  color: #526b92;
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1.25;
`;

export const ScoreValue = styled.strong`
  margin-left: 0.25rem;
  color: #1f6fe4;
  font-size: 1.05rem;
`;

export const CardSummary = styled.p`
  display: -webkit-box;
  margin: 0.05rem 0 0;
  color: #526078;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.4;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const AnswerCount = styled.p`
  margin: 0;
  color: #6b7d9d;
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.2;
`;

export const MetaGroup = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const MetaLabel = styled.span`
  color: #5f6978;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.2;
`;

export const TagGroup = styled.div`
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 1.3rem;
  max-width: 100%;

  padding: 0.12rem 0.45rem;

  border: 0.0625rem solid #9bc9ff;
  border-radius: 0.15rem;
  background: #eef6ff;

  color: #1376ef;
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1.15;
`;

export const CardDate = styled.p`
  margin: 0.1rem 0 0;
  color: #53606f;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.2;
`;

export const StatusBadge = styled.span<StatusBadgeProps>`
  position: absolute;
  top: 1.1rem;
  right: 1rem;

  min-height: 1.7rem;

  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  padding: 0 0.85rem;

  border: 0.0625rem solid
    ${({ $complete }) => ($complete ? "#1a73e8" : "#86bdff")};

  border-radius: 999rem;

  background: ${({ $complete }) =>
    $complete ? "#1a73e8" : "#f4f9ff"};

  color: ${({ $complete }) =>
    $complete ? "#ffffff" : "#1a73e8"};

  font-size: 0.75rem;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;

  &::after {
    content: "";
    display: ${({ $complete }) => ($complete ? "block" : "none")};

    width: 0.38rem;
    height: 0.65rem;

    border: solid #ffffff;
    border-width: 0 0.13rem 0.13rem 0;

    transform: translateY(-0.05rem) rotate(45deg);
  }

  @media (max-width: 30rem) {
    position: static;
    grid-column: 1 / -1;
    justify-self: start;
    margin-top: 0.15rem;
  }
`;
