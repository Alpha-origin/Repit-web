import styled from "styled-components";

export const Page = styled.main`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  background: linear-gradient(108deg, #eaf1ff 0%, #f6f8fc 48%, #ffffff 100%);

  @media (max-width: 36rem) {
    padding: 1.25rem;
  }
`;
