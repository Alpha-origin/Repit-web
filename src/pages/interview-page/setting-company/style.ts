import styled from "styled-components";

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const Description = styled.p`
  margin: 0;
  color: #6b7080;
  font-size: 0.95rem;
  line-height: 1.6;
  word-break: keep-all;
`;

export const Disclaimer = styled.p`
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: #f1f2f4;
  color: #5b606c;
  font-size: 0.85rem;
  line-height: 1.5;
  word-break: keep-all;
`;

export const InfoIcon = styled.span`
  width: 1.1rem;
  height: 1.1rem;
  margin-top: 0.1rem;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #4d5570;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
`;

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem 1.5rem;
`;

export const Summary = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7080;
  font-size: 0.95rem;

  strong {
    color: #257ee8;
    font-weight: 700;
  }
`;

export const Actions = styled.div`
  flex: 0 1 18rem;

  @media (max-width: 34rem) {
    flex-basis: 100%;
  }
`;
