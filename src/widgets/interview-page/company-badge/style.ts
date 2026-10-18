import styled from "styled-components";
export const Badge = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.brand.blue};
  background: ${({ theme }) => theme.colors.surface.blueLight};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.5;
  overflow-wrap: anywhere;
`;
