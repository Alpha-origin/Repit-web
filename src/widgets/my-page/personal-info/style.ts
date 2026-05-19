import styled from "styled-components";

export const PersonalInfoWrapper = styled.section`
  position: relative;
  width: 100%;
  min-height: 20.75rem;
  padding: 1.9rem 2.3rem 2rem;
  background-color: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 1.1rem 2.8rem rgba(169, 181, 205, 0.14);

  @media (max-width: 48rem) {
    min-height: auto;
    padding: 1.5rem 1.4rem 1.75rem;
  }
`;

export const Title = styled.h2`
  margin: 0 0 2.6rem;
  color: #46506a;
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  font-weight: 800;
  line-height: 1.2;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-left: 3.25rem;

  @media (max-width: 48rem) {
    margin-left: 0;
    gap: 1.2rem;
  }
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  align-items: center;
  column-gap: 0.65rem;

  @media (max-width: 36rem) {
    grid-template-columns: 6rem minmax(0, 1fr);
  }
`;

export const Label = styled.span`
  color: #4c91f3;
  font-size: clamp(1.15rem, 2vw, 1.55rem);
  font-weight: 800;
  line-height: 1.35;
`;

export const Value = styled.span`
  color: #55607b;
  font-size: clamp(1.1rem, 1.8vw, 1.45rem);
  font-weight: 700;
  line-height: 1.35;
  word-break: break-all;
`;

export const EditButton = styled.button`
  position: absolute;
  right: 1.7rem;
  bottom: 1rem;
  min-width: 7.4rem;
  height: 2.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 0.5rem;
  padding: 0 1rem;

  background-color: #1976e8;
  color: #ffffff;

  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;

  box-shadow: 0 0.25rem 0.6rem rgba(25, 118, 232, 0.25);
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #0f67d6;
    transform: translateY(-1px);
  }

  @media (max-width: 48rem) {
    position: static;
    display: inline-flex;
    margin-top: 1.8rem;
  }
`;
