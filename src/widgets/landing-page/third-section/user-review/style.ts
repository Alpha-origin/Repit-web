import { motion } from "framer-motion";
import styled, { css } from "styled-components";
import type {
  ChatBubbleProps,
  EmojiProps,
  ReviewWrapperProps,
} from "./types";

export const ContentMotion = styled(motion.div)`
  width: 100%;
`;

export const Header = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6.5rem;
`;

export const SubTitle = styled.span`
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #9dc1ff;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.05rem;
  color: #2f80ed;

  @media (max-width: 56.25rem) {
    font-size: 1.7rem;
  }
`;

export const ReviewGrid = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: min(100%, 80rem);
  min-height: 34rem;
  margin: 0 auto;

  @media (max-width: 56.25rem) {
    width: 100%;
    min-height: auto;
    gap: 4rem;
  }
`;

export const ReviewWrapper = styled(motion.div)<ReviewWrapperProps>`
  position: relative;
  display: flex;
  width: 100%;
  justify-content: ${({ align }) =>
    align === "right" ? "flex-end" : "flex-start"};

  @media (max-width: 56.25rem) {
    justify-content: flex-start;
  }
`;

export const Emoji = styled.div<EmojiProps>`
  position: absolute;
  top: -1.875rem;
  ${({ align }) =>
    align === "right"
      ? css`
          right: -0.5rem;
        `
      : css`
          left: -0.5rem;
        `}
  font-size: 3rem;
  z-index: 10;
`;

export const ChatBubble = styled.div<ChatBubbleProps>`
  position: relative;
  width: min(100%, 28rem);
  padding: 1.75rem 2.25rem;
  border-radius: 1.75rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: -0.04rem;
  color: white;

  span {
    display: block;
  }

  ${({ color }) =>
    color === "primary" &&
    css`
      background: #1565f5;
    `}

  ${({ color }) =>
    color === "secondary" &&
    css`
      background: #5d9cf8;
    `}

  ${({ color }) =>
    color === "light" &&
    css`
      background: #a9c8f4;
    `}

  @media (max-width: 56.25rem) {
    width: 100%;
    padding: 1.5rem 1.75rem;
    font-size: 0.9375rem;
  }
`;
