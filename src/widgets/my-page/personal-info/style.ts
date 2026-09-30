import styled from "styled-components";

export const PersonalInfoWrapper = styled.section`
  width: 100%;
  min-width: 0;
  min-height: 18.25rem;
  padding: 1.55rem 1.5rem 1.25rem;
  border: 0.0625rem solid #dce2ec;
  border-radius: 0.75rem;
  background-color: rgba(255, 255, 255, 0.94);

  @media (min-width: 90rem) {
    min-height: 19.125rem;
  }

  @media (max-width: 56rem) {
    min-height: auto;
  }
`;

export const Form = styled.form`
  position: relative;
  min-height: 15.4rem;

  @media (min-width: 90rem) {
    min-height: 16.15rem;
  }
`;

export const Title = styled.h2`
  margin: 0 0 1.7rem;
  color: #46506a;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: 90rem) {
    font-size: 1.125rem;
  }
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-left: 0.5rem;

  @media (min-width: 90rem) {
    gap: 1.5rem;
  }
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 3.4rem minmax(0, 1fr);
  align-items: center;
  column-gap: 0.35rem;

  @media (min-width: 90rem) {
    grid-template-columns: 5.1rem minmax(0, 1fr);
  }
`;

export const Label = styled.label`
  color: #0875ef;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;

  @media (min-width: 90rem) {
    font-size: 0.875rem;
  }
`;

export const EditInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 1.85rem;
  padding: 0 0.8rem;
  border: 0.0625rem solid #e0e4ec;
  border-radius: 0.38rem;
  outline: none;
  background-color: #ffffff;
  color: #525c72;
  font-size: 0.88rem;
  font-weight: 500;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  @media (min-width: 90rem) {
    font-size: 0.75rem;
  }

  &:focus-visible {
    border-color: #247bed;
    box-shadow: 0 0 0 0.15rem rgba(36, 123, 237, 0.13);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  &:read-only {
    background-color: #f5f6f9;
    color: #8a93a6;
    cursor: default;
  }
`;

export const StatusText = styled.p`
  color: #68738a;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.5;
`;

export const ResultMessage = styled.p<{ $isError: boolean }>`
  position: absolute;
  right: 0;
  bottom: 1.7rem;
  left: 0;
  overflow: hidden;
  color: ${({ $isError }) => ($isError ? "#d64f4f" : "#1976e8")};
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SaveButton = styled.button`
  position: absolute;
  right: 0;
  bottom: 0;
  border: none;
  padding: 0;
  background-color: transparent;
  color: #0875ef;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover:not(:disabled) {
    color: #005ec9;
  }

  &:focus-visible {
    border-radius: 0.2rem;
    outline: 0.125rem solid rgba(36, 123, 237, 0.45);
    outline-offset: 0.2rem;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
