import { motion } from "framer-motion";
import styled from "styled-components";
import type { ServiceCardProps, ServiceRowProps } from "./types";

export const ContentMotion = styled(motion.div)`
  width: 100%;
`;

export const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 6rem;
`;

export const SubTitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.brand.blueLight};
  font-size: 1.125rem;
  font-weight: 700;
`;

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 2.625rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.05rem;

  @media (max-width: 56.25rem) {
    font-size: 2rem;
  }
`;

export const ServiceGrid = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: min(100%, 80rem);
  min-height: 50rem;
  margin: 0 auto;

  @media (max-width: 56.25rem) {
    justify-content: flex-start;
    width: 100%;
    min-height: auto;
    gap: 4rem;
  }
`;

export const ServiceRow = styled(motion.div)<ServiceRowProps>`
  display: flex;
  justify-content: ${({ $align }) =>
    $align === "right" ? "flex-end" : "flex-start"};
  width: 100%;

  @media (max-width: 56.25rem) {
    justify-content: flex-start;
  }
`;

export const ServiceCard = styled.article<ServiceCardProps>`
  display: flex;
  flex-direction: column;
  width: min(100%, 42rem);
  align-items: ${({ $align }) =>
    $align === "right" ? "flex-end" : "flex-start"};
  text-align: ${({ $align }) => $align};
  min-height: 8.5rem;

  @media (max-width: 56.25rem) {
    width: 100%;
    align-items: flex-start;
    text-align: left;
  }
`;

export const CardTitle = styled.h3`
  margin: 0 0 0.125rem;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 1.5rem;
  font-weight: 800;

  @media (max-width: 56.25rem) {
    font-size: 1.25rem;
  }
`;

export const CardHeading = styled.p`
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.05rem;

  @media (max-width: 56.25rem) {
    font-size: 1.625rem;
  }
`;

export const CardDescription = styled.p`
  margin: 0.5rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.65;

  span {
    display: block;
  }

  span + span {
    margin-top: 0;
  }

  @media (max-width: 56.25rem) {
    margin-top: 0.4rem;
    font-size: 0.9375rem;
    line-height: 1.6;
  }
`;
