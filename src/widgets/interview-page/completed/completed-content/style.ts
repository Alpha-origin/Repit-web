import styled from "styled-components";

export const Card = styled.section`
  width: min(100%, 38rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.35rem;
  padding: 3rem 2rem 2.2rem;
  border: 1px solid rgba(112, 140, 190, 0.18);
  border-radius: 2rem;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.98), rgba(240, 246, 255, 0.94)),
    #ffffff;
  box-shadow: 0 1rem 2.5rem rgba(61, 102, 171, 0.12);
  text-align: center;
`;

export const Badge = styled.span`
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.1);
  color: #2867c7;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: #111827;
  font-size: clamp(1.9rem, 2.4vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.05rem;
`;

export const Description = styled.p`
  margin: 0;
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.7;
`;

export const ActionRow = styled.div`
  width: 100%;
  display: flex;
  gap: 0.9rem;
  margin-top: 0.5rem;

  @media (max-width: 40rem) {
    flex-direction: column;
  }
`;

const BaseButton = styled.button`
  flex: 1;
  min-height: 3.2rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    background-color 0.16s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

export const PrimaryButton = styled(BaseButton)`
  border: none;
  background: linear-gradient(135deg, #2f6ee5, #4f8ffc);
  color: #ffffff;
  box-shadow: 0 0.8rem 1.8rem rgba(47, 110, 229, 0.22);
`;

export const SecondaryButton = styled(BaseButton)`
  border: 1px solid rgba(112, 140, 190, 0.28);
  background: #ffffff;
  color: #334155;
`;
