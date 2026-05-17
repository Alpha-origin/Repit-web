import styled from "styled-components";

export const Page = styled.main`
  position: relative;
  width: 100%;
  height: 100dvh;
  min-height: 100dvh;
  box-sizing: border-box;
  overflow: hidden;
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100dvh;
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  row-gap: 1rem;
  box-sizing: border-box;

  @media (max-width: 56rem) {
    row-gap: 0.75rem;
  }
`;

export const OutletArea = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  align-items: stretch;
  justify-items: stretch;
  min-height: 0;
  overflow: hidden;
`;
