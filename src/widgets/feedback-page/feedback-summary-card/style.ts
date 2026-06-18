import styled from "styled-components";

export const Card = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1.35rem;
  border-radius: 1.15rem;
  background: linear-gradient(135deg, rgba(31, 111, 228, 0.08), rgba(132, 196, 255, 0.08));
  border: 0.0625rem solid rgba(160, 198, 247, 0.78);

  @media (max-width: 48rem) {
    padding: 1rem;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 40rem) {
    flex-direction: column;
  }
`;

export const HeaderText = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const Eyebrow = styled.p`
  margin: 0;
  color: #3f73bf;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: -0.02rem;
`;

export const Title = styled.h2`
  margin: 0;
  color: #184f9b;
  font-size: clamp(1.15rem, 1.8vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.05rem;
`;

export const Description = styled.p`
  margin: 0;
  color: #55709f;
  font-size: 0.95rem;
  line-height: 1.55;
  letter-spacing: -0.02rem;
`;

export const StatusBadge = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.35rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999rem;
  background: #1f6fe4;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.02rem;
`;

export const MetaGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.8rem;

  @media (max-width: 64rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 40rem) {
    grid-template-columns: 1fr;
  }
`;

export const MetaCard = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
  padding: 0.9rem 1rem;
  border-radius: 0.95rem;
  background: rgba(255, 255, 255, 0.72);
  border: 0.0625rem solid rgba(196, 215, 246, 0.88);
`;

export const MetaLabel = styled.p`
  margin: 0;
  color: #6682af;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: -0.01rem;
`;

export const MetaValue = styled.p`
  margin: 0;
  color: #215da9;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.03rem;
  word-break: break-word;
`;

export const Notice = styled.p`
  margin: 0;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.62);
  color: #5370a0;
  font-size: 0.9rem;
  line-height: 1.5;
  letter-spacing: -0.02rem;
`;
