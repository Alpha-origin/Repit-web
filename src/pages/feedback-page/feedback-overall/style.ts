import styled from "styled-components";

export const Page = styled.section`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.5rem 1.6rem 1.8rem;
  box-sizing: border-box;

  @media (max-width: 48rem) {
    padding: 0.8rem 0.9rem 1.1rem;
  }
`;

export const Panel = styled.section`
  width: min(100%, 104rem);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1.8rem 1.7rem 2rem;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.84),
    rgba(247, 250, 255, 0.95)
  );
  border: 0.0625rem solid rgba(217, 227, 245, 0.88);
  border-radius: 1rem;
  box-shadow: 0 1.6rem 3.5rem rgba(62, 104, 171, 0.08);
  box-sizing: border-box;

  @media (max-width: 48rem) {
    gap: 0.95rem;
    padding: 1.1rem 0.95rem 1.2rem;
    border-radius: 1.45rem;
  }
`;
