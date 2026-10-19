import styled, { keyframes } from "styled-components";

const appear = keyframes`
  from { opacity: 0; transform: translateY(0.5rem); }
  to { opacity: 1; transform: translateY(0); }
`;

// 서버는 진행률을 제공하지 않는다. 완료 응답 전에는 끝까지 채우지 않는다.
const fillProgress = keyframes`
  0% { transform: scaleX(0.03); }
  10% { transform: scaleX(0.35); }
  35% { transform: scaleX(0.6); }
  70% { transform: scaleX(0.8); }
  100% { transform: scaleX(0.92); }
`;

const shimmer = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
`;

const drawCheck = keyframes`
  from { stroke-dashoffset: 24; }
  to { stroke-dashoffset: 0; }
`;

export const Card = styled.section<{ $hasError: boolean }>`
  display: grid;
  grid-template-columns: 2.25rem minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 0.75rem;
  row-gap: 0.375rem;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${({ $hasError }) => $hasError ? "#f0d9c5" : "#9ec7ff"};
  border-radius: 0.25rem;
  background: ${({ $hasError }) => $hasError ? "#fff9f2" : "#f0f5ff"};
  animation: ${appear} 240ms ease-out both;

  @media (max-width: 36rem) {
    grid-template-columns: 2.25rem minmax(0, 1fr);
  }
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export const StatusIcon = styled.span<{ $hasError: boolean }>`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radius.circle};
  background: ${({ $hasError, theme }) => $hasError ? "#a15c07" : theme.colors.brand.blue};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 700;

  svg { width: 1.5rem; height: 1.5rem; }
`;

export const CompleteIcon = styled.svg`
  path {
    stroke-dasharray: 24;
    animation: ${drawCheck} 350ms ease-out both;
  }
  @media (prefers-reduced-motion: reduce) { path { animation: none; } }
`;

export const Content = styled.div`
  min-width: 0;
`;

export const Title = styled.h3<{ $hasError: boolean }>`
  color: ${({ $hasError, theme }) => $hasError ? "#a15c07" : theme.colors.brand.blue};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 700;
  line-height: 1.5;
`;

export const Message = styled.p`
  color: #51576e;
  font-size: 0.625rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
`;

export const Action = styled.button`
  min-height: 1.875rem;
  margin-top: 0.5rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.brand.blue};
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 0.625rem;
  white-space: nowrap;
  cursor: pointer;

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.surface.blueLight}; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 2px;
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  @media (max-width: 36rem) { min-height: 2.75rem; font-size: ${({ theme }) => theme.fontSize.xs}; }
`;

export const InterviewButton = styled(Action)`
  margin-top: 0;

  @media (max-width: 36rem) {
    grid-column: 2;
    justify-self: start;
  }
`;

export const ProgressTrack = styled.div`
  grid-column: 1 / -1;
  height: 0.25rem;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: #cfe0ff;
`;

export const ProgressFill = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.brand.blue};
  transform-origin: left;
  animation: ${fillProgress} 180s ease-out forwards;

  &::after {
    position: absolute;
    inset: 0;
    content: "";
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    animation: ${shimmer} 1.8s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: scaleX(0.6);
    &::after { animation: none; display: none; }
  }
`;
