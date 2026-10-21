import styled from "styled-components";

export const Content = styled.section`
  width: min(100%, 40rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  margin-block: auto;
  text-align: center;
`;

export const CompletionIcon = styled.img`
  display: block;
  width: 5rem;
  height: 5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: clamp(1.5rem, 2.4vw, ${({ theme }) => theme.fontSize.xl});
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.04em;
`;

export const Description = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: #888888;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.5;
  word-break: keep-all;
`;

export const ActionRow = styled.div`
  width: min(100%, 23.5rem);
  display: grid;
  grid-template-columns: 1.08fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: 1.75rem;

  @media (max-width: 25rem) {
    grid-template-columns: 1fr;
  }
`;

const BaseButton = styled.button`
  min-width: 0;
  min-height: 2.75rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 500;
  line-height: 1.5;
  cursor: pointer;
  transition: background-color 0.16s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.blueAction};
    outline-offset: 3px;
  }
`;

export const PrimaryButton = styled(BaseButton)`
  border: 1px solid ${({ theme }) => theme.colors.brand.blue};
  background: ${({ theme }) => theme.colors.brand.blue};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background: ${({ theme }) => theme.colors.brand.blueAction};
  }
`;

export const SecondaryButton = styled(BaseButton)`
  border: 1px solid ${({ theme }) => theme.colors.brand.blueLight};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.brand.blue};

  &:hover {
    background: ${({ theme }) => theme.colors.surface.blueLight};
  }
`;
