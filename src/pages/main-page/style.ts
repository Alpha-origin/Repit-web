import styled from "styled-components";

export const Page = styled.main`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
`;
