import { motion } from "framer-motion";
import styled from "styled-components";
import type { ServiceCardProps, ServiceRowProps } from "./types";

export const ContentMotion = styled(motion.div)`
  width: 100%;
`;

export const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 6rem;
  font-weight: 300;
  font-family: 'Wave', sans-serif;
`;

export const SubTitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.brand.blueLight};
  font-size: 1.3rem;
  margin-bottom: 1.35rem;
  font-family: 'Wave', sans-serif;
  font-weight: 300;
`;

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 2.4rem;
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.05rem;

  @media (max-width: 56.25rem) {
    font-size: 1.8rem;
  }
`;

export const ServiceGrid = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: min(100%, 78rem);
  min-height: 52rem;
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
  font-size: 1.6rem;
  font-weight: 550;

  @media (max-width: 56.25rem) {
    font-size: 1.15rem;
  }
`;

export const CardHeading = styled.p`
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.8rem;
  font-weight: 200;
  line-height: 1.15;
  letter-spacing: -0.05rem;
  padding-top: 0.7rem;
  font-family: 'Wave', sans-serif;

  @media (max-width: 56.25rem) {
    font-size: 1.45rem;
  }
`;


export const CardDescription = styled.p`
  margin: 0.5rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.5;

  span {
    display: block;
  }

  span + span {
    margin-top: 0;
  }

  @media (max-width: 56.25rem) {
    margin-top: 0.4rem;
    font-size: 0.875rem;
    line-height: 1.6;
  }
`;
