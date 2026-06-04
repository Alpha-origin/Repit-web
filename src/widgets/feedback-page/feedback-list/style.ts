import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.4rem 2rem 2.4rem;
  box-sizing: border-box;

  @media (max-width: 48rem) {
    padding: 0.85rem 1rem 1.35rem;
  }
`;

export const Panel = styled.section`
  width: min(100%, 104rem);
  min-height: calc(100% - 0.5rem);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1.45rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(248, 250, 255, 0.94));
  border: 0.0625rem solid rgba(217, 227, 245, 0.85);
  border-radius: 2rem;
  box-shadow: 0 1.6rem 3.5rem rgba(62, 104, 171, 0.08);
  padding: 1.6rem 1.85rem 1.8rem;

  @media (max-width: 48rem) {
    border-radius: 1.45rem;
    gap: 0.95rem;
    padding: 1.15rem 1rem 1.2rem;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  padding-left: 0.45rem;
  color: #1a73e8;
  font-size: clamp(1.28rem, 1.65vw, 1.6rem);
  font-weight: 800;
  letter-spacing: -0.04rem;
`;

export const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FeedbackCard = styled.article`
  width: 100%;
  min-height: 6.2rem;
  display: grid;
  grid-template-columns: minmax(9rem, 13rem) minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 1.75rem;
  padding: 1.4rem 2rem;
  border: 0.125rem solid rgba(214, 223, 237, 0.92);
  border-radius: 1.35rem;
  background: rgba(255, 255, 255, 0.74);
  box-shadow: 0 0.45rem 1.2rem rgba(15, 23, 42, 0.04);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;

  &:hover {
    background: linear-gradient(180deg, rgba(242, 247, 255, 0.98), rgba(235, 242, 255, 0.94));
    box-shadow: 0 1rem 2.4rem rgba(66, 106, 176, 0.09);
    border-color: rgba(157, 194, 247, 0.98);
  }

  @media (max-width: 64rem) {
    grid-template-columns: 1fr auto;
    row-gap: 0.8rem;
    padding: 1.2rem 1.35rem;
  }

  @media (max-width: 40rem) {
    grid-template-columns: 1fr;
    justify-items: start;
    padding: 1.1rem 1.05rem;
  }
`;

export const CardDate = styled.p`
  margin: 0;
  color: #1d6fe5;
  font-size: clamp(1.18rem, 1.65vw, 1.55rem);
  font-weight: 800;
  letter-spacing: -0.05rem;
  line-height: 1;
`;

export const CardBody = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.24rem;
`;

export const CardTitle = styled.h3`
  margin: 0;
  color: #1f6fe4;
  font-size: clamp(1.32rem, 1.8vw, 1.65rem);
  font-weight: 800;
  letter-spacing: -0.04rem;
  line-height: 1.05;
`;

export const CardMeta = styled.p`
  margin: 0;
  color: #6d6d6d;
  font-size: clamp(0.92rem, 1.02vw, 1rem);
  font-weight: 600;
  letter-spacing: -0.02rem;
`;

export const StatusButton = styled.button`
  min-width: 7.5rem;
  height: 2.9rem;
  border: none;
  border-radius: 0.75rem;
  background: linear-gradient(180deg, #3e7df3, #2f63ec);
  color: #ffffff;
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: -0.02rem;
  cursor: pointer;
  box-shadow: 0 0.8rem 1.7rem rgba(47, 99, 236, 0.2);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-0.05rem);
    box-shadow: 0 1rem 1.9rem rgba(47, 99, 236, 0.26);
    filter: brightness(1.02);
  }

  @media (max-width: 64rem) {
    grid-column: 2;
  }

  @media (max-width: 40rem) {
    grid-column: auto;
    width: 100%;
    min-width: 0;
    height: 2.8rem;
  }
`;
