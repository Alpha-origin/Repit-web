import styled, { keyframes } from "styled-components";

const spin = keyframes`to { transform: rotate(360deg); }`;
const pulse = keyframes`50% { opacity: 0.35; }`;

export const Container = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 1rem clamp(1rem, 6.8vw, 6.125rem) 2rem;
  box-sizing: border-box;
`;

export const Content = styled.div`
  max-width: 66rem;
  margin: 0 auto;
`;

export const Stage = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: clamp(2rem, 7vh, 5rem) 1rem 2rem;
  word-break: keep-all;
`;

export const Eyebrow = styled.p`
  margin: 0 0 2rem;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  letter-spacing: 0.04em;
`;

export const Orb = styled.div<{ $paused: boolean }>`
  position: relative;
  width: 10rem;
  height: 10rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface.blueLight};
  box-shadow: 0 0 0 1rem ${({ theme }) => theme.colors.surface.blueLight}66;
  margin: 0 0 2.5rem;
  &::before {
    content: "";
    position: absolute;
    inset: -0.25rem;
    border: 2px solid ${({ theme }) => theme.colors.brand.blueLight};
    border-top-color: ${({ theme }) => theme.colors.brand.blue};
    border-radius: 50%;
    animation: ${spin} 2s linear infinite;
    animation-play-state: ${({ $paused }) => $paused ? "paused" : "running"};
  }
  img { width: 7rem; max-height: 7rem; object-fit: contain; }
  @media (prefers-reduced-motion: reduce) { &::before { animation: none; } }
`;

export const Title = styled.h1`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: clamp(1.35rem, 2.5vw, 2rem);
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.04em;
`;

export const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.default};
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.8;
`;

export const Status = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 2rem;
  padding: 0.8rem 1.2rem;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

export const Dot = styled.span`
  width: 0.4rem;
  height: 0.4rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: currentColor;
  animation: ${pulse} 1.4s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export const Actions = styled.div`
  width: min(100%, 34rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  &:not(:empty) { margin-top: 1.5rem; }
  a { color: ${({ theme }) => theme.colors.brand.blue}; }
`;

export const Hint = styled.p`
  margin: 1.5rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
`;
