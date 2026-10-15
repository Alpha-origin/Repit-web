import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  max-width: 88rem;
  margin: 0 auto;
  padding: 0 clamp(1rem, 2.5vw, 2rem) 1rem;
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1.4vw, 1rem);
  font-family: ${({ theme }) => theme.fontFamily.pretendard};

  button {
    font-family: inherit;
  }

  @media (max-width: 42rem) {
    padding-inline: ${({ theme }) => theme.spacing.md};
  }
`;
