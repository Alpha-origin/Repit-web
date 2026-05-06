import styled from "styled-components";

export const Header = styled.div`
  text-align: center;
  margin-bottom: 92px;
`;

export const SubTitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};

  color: ${({ theme }) => theme.colors.brand.blueLight};

  font-size: 15px;
  font-weight: 700;
`;

export const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.brand.blue};

  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.8px;
`;

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  row-gap: 84px;
  column-gap: 120px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    row-gap: 56px;
  }
`;

export const ServiceCard = styled.article<{
  $align: "left" | "right";
}>`
  display: flex;
  flex-direction: column;

  align-items: ${({ $align }) =>
    $align === "right" ? "flex-end" : "flex-start"};

  text-align: ${({ $align }) => $align};

  min-height: 140px;
`;

export const CardTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};

  color: ${({ theme }) => theme.colors.brand.blue};

  font-size: 19px;
  font-weight: 800;
`;

export const CardHeading = styled.p`
  margin: 0 0 12px;

  color: ${({ theme }) => theme.colors.text.strong};

  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.8px;
`;

export const CardDescription = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.text.muted};

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  line-height: 1.65;
`;
