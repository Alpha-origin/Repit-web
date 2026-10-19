import styled from "styled-components";

export const Page = styled.section`
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
`;

export const StateCard = styled.div`
  width: calc(100% - 3rem);
  margin: 1.5rem;
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
