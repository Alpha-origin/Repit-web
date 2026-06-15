import styled from "styled-components";

interface RouteLayoutProps {
  $isInterviewRoute: boolean;
}

export const Page = styled.main`
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
`;

export const Content = styled.div<RouteLayoutProps>`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  row-gap: ${({ $isInterviewRoute }) => ($isInterviewRoute ? 0 : "1rem")};
  box-sizing: border-box;

  @media (max-width: 56rem) {
    row-gap: ${({ $isInterviewRoute }) => ($isInterviewRoute ? 0 : "0.75rem")};
  }
`;

export const OutletArea = styled.div<RouteLayoutProps>`
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  align-items: start;
  justify-items: stretch;
  min-height: 0;
  padding-bottom: ${({ $isInterviewRoute }) => ($isInterviewRoute ? 0 : "1.5rem")};
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: ${({ $isInterviewRoute }) => ($isInterviewRoute ? "hidden" : "auto")};
  scrollbar-width: none;
  -ms-overflow-style: none;

  @media (max-width: 56rem) {
    padding-bottom: ${({ $isInterviewRoute }) => ($isInterviewRoute ? 0 : "1rem")};
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;
