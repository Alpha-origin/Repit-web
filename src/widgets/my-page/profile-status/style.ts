import styled from "styled-components";

export const Card = styled.section<{ $hasError: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.125rem;
  border: 1px solid ${({ $hasError }) => $hasError ? "#f0d9c5" : "#e0eafa"};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $hasError }) => $hasError ? "#fff9f2" : "#f4f8ff"};
`;

export const StatusIcon = styled.span<{ $isComplete: boolean }>`
  display: grid;
  place-items: center;
  flex: 0 0 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
  border-radius: ${({ theme }) => theme.radius.circle};
  background: ${({ $isComplete }) => $isComplete ? "#e0f2ed" : "#e4edfb"};
  color: ${({ $isComplete, theme }) => $isComplete ? "#2d806d" : theme.colors.brand.blue};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 700;
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Title = styled.h3`
  margin-bottom: 0.25rem;
  color: #486080;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 650;
  line-height: 1.6;
`;

export const Message = styled.p`
  color: #65758e;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
  overflow-wrap: anywhere;
`;

export const Action = styled.button`
  min-height: 2.25rem;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: 0.5rem 0.75rem;
  border: 1px solid #dce5f2;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.surface.blueLight}; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blue};
    outline-offset: 2px;
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
