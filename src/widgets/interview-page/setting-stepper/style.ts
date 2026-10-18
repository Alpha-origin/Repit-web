import styled from "styled-components";

type StepState = "done" | "current" | "next";

export const List = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0;
`;

export const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Line = styled.span`
  width: 2rem;
  height: 0.0625rem;
  margin: 0 0.5rem;
  background: #c8cbd0;
`;

export const StepNumber = styled.span<{ $state: StepState }>`
  width: 1.375rem;
  height: 1.375rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 0.75rem;
  font-weight: 700;
  border: 0.0625rem solid
    ${({ $state }) => ($state === "next" ? "#c8cbd0" : "transparent")};
  background: ${({ $state }) =>
    $state === "current" ? "#257ee8" : $state === "done" ? "#a9c9f5" : "#ffffff"};
  color: ${({ $state }) => ($state === "next" ? "#8a8f99" : "#ffffff")};
`;

export const Label = styled.span<{ $state: StepState }>`
  font-size: 0.9rem;
  font-weight: ${({ $state }) => ($state === "current" ? 700 : 500)};
  color: ${({ $state }) => ($state === "current" ? "#257ee8" : "#8a8f99")};
`;
