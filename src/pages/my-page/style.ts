import styled from "styled-components";

export const Page = styled.main`
  width: min(100%, 64rem);
  min-height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  padding: 2rem 1rem 3.5rem;
  justify-content: flex-start;
  align-items: stretch;

  @media (max-width: 48rem) {
    gap: 1.5rem;
    padding: 1.25rem 0.9rem 2.5rem;
  }
`;
