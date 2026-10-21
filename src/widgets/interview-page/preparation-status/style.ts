import styled, { keyframes } from "styled-components";

const pulse = keyframes`50% { opacity: 0.35; }`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 1rem clamp(1rem, 6.8vw, 6.125rem);
  overflow-y: auto;
  box-sizing: border-box;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 66rem;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

export const Stage = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  margin-block: auto;
  text-align: center;
  padding: 2rem 1rem;
  word-break: keep-all;
`;

export const Eyebrow = styled.p`
  margin: 0 0 2rem;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  letter-spacing: 0.04em;
`;

export const PreparationIcon = styled.img`
  display: block;
  width: 7rem;
  height: 7rem;
  object-fit: contain;
  margin: 0 0 2.5rem;
`;

export const SpinnerSlot = styled.div`
  flex-shrink: 0;
  margin: 0 0 2.5rem;
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
