import styled from "styled-components";

export const Content = styled.section`
  width: min(100%, 34rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const SuccessIcon = styled.img`
  width: 4.5rem;
  height: 4.5rem;
  margin-bottom: 1.25rem;

  @media (max-width: 36rem) {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
  }
`;

export const Title = styled.h1`
  margin: 0;
  color: #111111;
  font-size: clamp(1.45rem, 2vw, 1.75rem);
  font-weight: 750;
  letter-spacing: -0.045em;
  line-height: 1.35;
`;

export const Description = styled.p`
  margin: 0.45rem 0 0;
  color: #8b8b8b;
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.5;
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;

  @media (max-width: 34rem) {
    width: 100%;
    flex-direction: column;
    margin-top: 1.5rem;
  }
`;

const BaseButton = styled.button`
  width: 12.4rem;
  min-height: 2.9rem;
  padding: 0.5rem 1rem;
  border-radius: 0.55rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.16s ease, transform 0.16s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid rgba(33, 118, 237, 0.45);
    outline-offset: 2px;
  }

  @media (max-width: 34rem) {
    width: 100%;
  }
`;

export const PrimaryButton = styled(BaseButton)`
  border: 1px solid #2176ed;
  background: #2176ed;
  color: #ffffff;

  &:hover {
    background: #1768d8;
  }
`;

export const SecondaryButton = styled(BaseButton)`
  border: 1px solid #bdd5ff;
  background: #ffffff;
  color: #2176ed;

  &:hover {
    background: #f7faff;
  }
`;
