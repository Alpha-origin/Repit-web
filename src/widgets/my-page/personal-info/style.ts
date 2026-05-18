import styled from "styled-components";

export const PersonalInfoWrapper = styled.section`
  position: relative;
  width: min(100%, 78rem);
  min-height: 17.5rem;
  padding: 2rem 2.5rem;
  background-color: #ffffff;
  border-radius: 1rem;
`;

export const Title = styled.h2`
  margin: 0 0 2rem;
  color: #3f4658;
  font-size: 1.5rem;
  font-weight: 800;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-left: 2.8rem;
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  align-items: center;
`;

export const Label = styled.span`
  color: #4f8df7;
  font-size: 1.25rem;
  font-weight: 800;
`;

export const Value = styled.span`
  color: #4d5366;
  font-size: 1.15rem;
  font-weight: 700;
`;

export const EditButton = styled.button`
  position: absolute;
  right: 1.5rem;
  bottom: 1.25rem;

  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.1rem;

  background-color: #1976e8;
  color: #ffffff;

  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;

  box-shadow: 0 0.25rem 0.6rem rgba(25, 118, 232, 0.25);

  &:hover {
    background-color: #0f67d6;
  }
`;