import styled from "styled-components";

export const Container = styled.section`
  position: relative;
  left: 50%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 7.5rem;

  width: 100vw;
  min-height: 100vh;
  margin-left: -50vw;
  padding: 6.75rem 0 0;
  background: #f2f3f5;

  @media (max-width: 56.25rem) {
    gap: 6rem;
    padding: 5rem 0 0;
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 6.5rem;

  @media (max-width: 56.25rem) {
    padding: 0 1.5rem;
  }
`;
