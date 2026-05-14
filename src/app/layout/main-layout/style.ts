import styled from "styled-components";

export const Page = styled.main`
  position: relative;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  row-gap: 1rem;
  padding-bottom: 1rem;
  box-sizing: border-box;
`;

export const OutletArea = styled.div`
  min-height: 0;
`;
