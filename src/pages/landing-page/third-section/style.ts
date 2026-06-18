import styled from "styled-components";

export const Container = styled.section`
  position: relative;
  left: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
  min-height: 100vh;
  margin-left: -50vw;
  background:
    radial-gradient(circle at 50% 12%, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.82) 16%, rgba(234, 242, 255, 0.88) 38%, rgba(242, 243, 245, 0.96) 74%),
    linear-gradient(180deg, #edf4ff 0%, #f6f8fc 45%, #f2f3f5 100%);
  overflow: hidden;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 5.5rem 6.5rem 6.5rem;

  @media (max-width: 56.25rem) {
    padding: 4.5rem 1.5rem 5rem;
  }
`;

export const Footer = styled.footer`
  width: 100%;
  height: 7.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    180deg,
    #d8e8ff 0%,
    #c5dcff 100%
  );
  font-size: 2rem;
  font-weight: 700;
  color: black;
`;
