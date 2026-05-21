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
  min-height: 4.7rem;
  padding: 0.85rem 1.8rem;
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.94);
  box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 48rem) {
    padding: 1.25rem;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: #2d73de;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.04rem;

  @media (max-width: 48rem) {
    font-size: 1.5rem;
  }
`;

export const ActionButton = styled.button`
  min-width: 15.75rem;
  height: 3.5rem;
  padding: 0 1.75rem;
  border: 0.0625rem solid rgba(0, 65, 150, 0.12);
  border-radius: 0.875rem;
  background-color: #ffffff;
  color: #555555;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.04);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-0.0625rem);
    border-color: rgba(45, 115, 222, 0.24);
    box-shadow: 0 0.25rem 1rem rgba(45, 115, 222, 0.1);
  }

  @media (max-width: 48rem) {
    min-width: 100%;
  }
`;
