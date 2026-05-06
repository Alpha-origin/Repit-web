import styled from "styled-components";

export const Container = styled.section`
  width: 100%;
  min-height: 960px;
  padding: 108px 110px 120px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.surface.blueLight} 0%,
    ${({ theme }) => theme.colors.surface.muted} 45%,
    ${({ theme }) => theme.colors.surface.subtle} 100%
  );

  @media (max-width: 900px) {
    padding: 80px ${({ theme }) => theme.spacing.lg};
  }
`;
