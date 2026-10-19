import styled from "styled-components";

export const Button = styled.button`
  flex: 0 0 auto;
  width: fit-content;
  min-height: 2rem;
  padding: 0.25rem 0.65rem;
  border: 0.0625rem solid #9ac5ff;
  border-radius: 999rem;
  background: #f5f9ff;
  color: #2179ed;
  font-size: 0.74rem;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.58;
  }

  &:hover:not(:disabled) {
    background: #eaf3ff;
  }
`;

export const ErrorMessage = styled.span`
  color: #c24141;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.4;
`;
