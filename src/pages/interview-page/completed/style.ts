import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 7rem;
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.layout.mobileBreakpoint}) {
    padding: 2rem 1rem 4rem;
  }
`;
