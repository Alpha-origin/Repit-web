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
  width: min(100%, 84rem);
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

export const StateCard = styled.div`
  width: 100%;
  min-height: 12rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  padding: 1.6rem;
  border: 0.125rem dashed rgba(181, 199, 232, 0.92);
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.62);
  text-align: center;
`;

export const StateText = styled.p`
  margin: 0;
  color: #4f6389;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.02rem;
`;

export const RetryButton = styled.button`
  min-width: 7rem;
  height: 2.6rem;
  border: none;
  border-radius: 0.8rem;
  background: #1f6fe4;
  color: #ffffff;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-0.05rem);
    filter: brightness(1.03);
  }
`;
