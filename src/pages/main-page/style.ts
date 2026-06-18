import styled from "styled-components";

export const Page = styled.main`
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  row-gap: 0.9rem;
  padding-bottom: 0;
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};

  button {
    font-family: inherit;
  }
`;
