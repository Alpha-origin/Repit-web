import styled from "styled-components";

export const Section = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 108rem;
  margin: 0 auto;
  padding: 0 1.35rem 0;

  @media (max-width: 64rem) {
    padding: 0 1rem 0;
  }
`;

export const BannerCard = styled.div`
  width: 100%;
  min-height: 3.05rem;
  padding: 0.8rem 1.35rem;
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.94);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 48rem) {
    padding: 0.85rem;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamily.pretendard};
  color: #2d73de;
  font-size: 1.38rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.04rem;

  @media (max-width: 48rem) {
    font-size: 1.34rem;
  }
`;

export const ActionButton = styled.button`
  min-width: 15.75rem;
  height: 2.35rem;
  padding: 0 1.35rem;
  border: 0.0625rem solid rgba(0, 65, 150, 0.12);
  border-radius: 0.875rem;
  background-color: #ffffff;
  color: #555555;
  font-size: 1.02rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;

  && {
    font-family: ${({ theme }) => theme.fontFamily.pretendard};
  }

  &:hover {
    transform: translateY(-0.0625rem);
    border-color: rgba(45, 115, 222, 0.24);
  }

  @media (max-width: 48rem) {
    min-width: 100%;
    height: 2.45rem;
  }
`;
