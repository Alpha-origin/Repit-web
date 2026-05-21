import styled from "styled-components";

export const Section = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  min-height: 0;
  max-width: 108rem;
  margin: 0 auto;
  padding: 0.45rem 1.35rem 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 0.88fr);
  gap: 1.35rem;

  @media (max-width: 64rem) {
    padding: 0.35rem 1rem 0;
  }
`;

const cardBase = `
  position: relative;
  width: 100%;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 0.625rem 2rem rgba(0, 0, 0, 0.08);
`;

export const TopCard = styled.article`
  ${cardBase}
  min-height: 0;
  padding: 0.7rem;
`;

export const BottomCard = styled.article`
  ${cardBase}
  min-height: 0;
  padding: 0.7rem;
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
`;

export const TopCardInner = styled.div`
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 72rem) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

export const BottomCardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  border-radius: 1rem;
  overflow: hidden;
`;

export const TopBanner = styled.div`
  position: relative;
  height: 100%;
  min-height: 0;
  border-radius: 1rem;
  overflow: hidden;

  @media (max-width: 72rem) {
    min-height: 14rem;
  }
`;

export const TopBannerImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
`;

export const LeftCopy = styled.div`
  position: absolute;
  left: 1.75rem;
  bottom: 1.35rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 72rem) {
    left: 1.25rem;
    bottom: 1rem;
  }
`;

export const ChallengeBadge = styled.span`
  min-width: 6rem;
  height: 2.35rem;
  padding: 0 1.2rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-color: #0c66de;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 0.25rem 0.75rem rgba(12, 102, 222, 0.24);

  @media (max-width: 72rem) {
    height: 2rem;
    padding: 0 1rem;
    font-size: 0.875rem;
  }
`;

export const TopTitle = styled.h2`
  margin: 1rem 0 0;
  color: #2774df;
  font-size: clamp(2.15rem, 3.2vw, 3.8rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.08rem;
`;

export const RightCopy = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.2rem 0.65rem 0.2rem 0;
  min-height: 0;

  @media (max-width: 72rem) {
    padding: 0;
  }
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

export const CheckIcon = styled.span`
  width: 2.1rem;
  height: 2.1rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 999rem;
  background-color: #2f8ff3;
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 900;
  line-height: 1;
`;

export const Description = styled.p`
  margin: 0;
  flex: 1;
  color: #4b4b4b;
  font-size: clamp(1rem, 1.4vw, 1.25rem);
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.03rem;
`;

export const AiBadge = styled.span`
  min-width: 7rem;
  height: 3.5rem;
  padding: 0 1.6rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 999rem;
  background-color: rgba(255, 255, 255, 0.95);
  color: #486fe6;
  font-size: 1.95rem;
  font-weight: 900;
  line-height: 1;

  @media (max-width: 72rem) {
    min-width: 5rem;
    height: 2.9rem;
    font-size: 1.5rem;
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  align-items: end;
  margin: 1.4rem 0 1rem;

  @media (max-width: 72rem) {
    margin: 1rem 0 0.75rem;
  }
`;

export const FeatureItem = styled.div`
  text-align: center;
`;

export const FeatureDescription = styled.p`
  margin: 0;
  color: #4b4b4b;
  font-size: clamp(0.95rem, 1.25vw, 1.2rem);
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.02rem;
`;

export const FeatureTitle = styled.strong`
  display: block;
  margin-top: 0.55rem;
  color: #2874df;
  font-size: clamp(1.55rem, 2vw, 2.35rem);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.05rem;
`;

export const StartButton = styled.button`
  width: 100%;
  height: 3.55rem;
  border: none;
  border-radius: 0.875rem;
  background-color: #2371dc;
  color: #ffffff;
  font-size: clamp(1rem, 1.4vw, 1.35rem);
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 0.2rem 0.45rem rgba(0, 65, 150, 0.22);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    transform: translateY(-0.0625rem);
    background-color: #1d68cf;
    box-shadow: 0 0.35rem 0.8rem rgba(0, 65, 150, 0.22);
  }

  @media (max-width: 72rem) {
    height: 3.1rem;
  }
`;

export const BottomOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 0 0 10.25%;

  @media (max-width: 72rem) {
    padding-left: 7%;
  }
`;

export const ReadyBadge = styled.span`
  min-width: 8rem;
  height: 2.35rem;
  padding: 0 1.3rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-color: #0c66de;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 0.25rem 0.75rem rgba(12, 102, 222, 0.24);

  @media (max-width: 72rem) {
    min-width: 6.5rem;
    height: 2rem;
    font-size: 0.875rem;
  }
`;

export const BottomTitle = styled.h2`
  margin: 1rem 0 0;
  color: rgba(255, 255, 255, 0.92);
  font-size: clamp(2rem, 3vw, 3.9rem);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.06rem;
`;
