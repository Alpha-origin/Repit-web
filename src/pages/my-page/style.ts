import styled from "styled-components";

export const Page = styled.div`
  width: min(calc(100% - 4rem), 70rem);
  margin: 0 auto;
  padding: 1.75rem 0 3rem;
  color: ${({ theme }) => theme.colors.text.default};
  margin-top: -16px;


  button, input {
    font-family: inherit;
  }

  @media (max-width: 56rem) {
    width: min(calc(100% - 2rem), 42rem);
    padding-top: 1rem;
  }
`;



export const Content = styled.div`
  display: grid;
  grid-template-columns: 18rem minmax(0, 1fr);
  align-items: start;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 56rem) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
