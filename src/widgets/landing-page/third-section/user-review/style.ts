import EmojiGraphic from "@/shared/img/landing-page/Repit-emoji.svg?react";
import TalkBoxGraphic1 from "@/shared/img/landing-page/Repit-talk-box-1.svg?react";
import TalkBoxGraphic2 from "@/shared/img/landing-page/Repit-talk-box-2.svg?react";
import TalkBoxGraphic3 from "@/shared/img/landing-page/Repit-talk-box-3.svg?react";
import TalkBoxGraphic4 from "@/shared/img/landing-page/Repit-talk-box-4.svg?react";
import { motion } from "framer-motion";
import styled, { css } from "styled-components";
import type { EmojiProps, ReviewWrapperProps } from "./types";

export const ContentMotion = styled(motion.div)`
  width: 100%;
`;

export const Header = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4.75rem;
  text-align: center;

  @media (max-width: 56.25rem) {
    margin-bottom: 3.5rem;
  }
`;

export const SubTitle = styled.span`
  margin-bottom: 0.7rem;
  color: #9dc1ff;
  font-size: 1rem;
  font-weight: 700;
`;

export const Title = styled.h2`
  margin: 0;
  color: #2f80ed;
  font-size: 2.85rem;
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.05rem;

  @media (max-width: 56.25rem) {
    font-size: 2rem;
  }
`;

export const ReviewGrid = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2.85rem;
  width: min(100%, 74rem);
  margin: 0 auto;

  @media (max-width: 56.25rem) {
    width: 100%;
    gap: 2rem;
  }
`;

export const ReviewWrapper = styled(motion.div)<ReviewWrapperProps>`
  display: flex;
  width: 100%;
  justify-content: ${({ $align }) =>
    $align === "right" ? "flex-end" : "flex-start"};

  @media (max-width: 56.25rem) {
    justify-content: flex-start;
  }
`;

export const BubbleCluster = styled.div<ReviewWrapperProps>`
  position: relative;
  width: min(100%, 26.75rem);
  padding-top: 0.4rem;
  overflow: visible;

  @media (min-width: 56.2501rem) {
    ${({ $align }) =>
      $align === "right" &&
      css`
        width: min(100%, 27.25rem);
      `}
  }

  @media (max-width: 56.25rem) {
    width: min(100%, 21.75rem);
  }
`;

export const Emoji = styled.div<EmojiProps>`
  position: absolute;
  top: -2.45rem;
  z-index: 2;
  width: 4.75rem;
  height: 4.75rem;
  pointer-events: none;

  ${({ $align }) =>
    $align === "right"
      ? css`
          right: -0.65rem;
        `
      : css`
          left: -0.65rem;
        `}

  @media (max-width: 56.25rem) {
    top: -2.1rem;
    width: 4.1rem;
    height: 4.1rem;

    ${({ $align }) =>
      $align === "right"
        ? css`
            right: -0.45rem;
            left: auto;
          `
        : css`
            left: -0.45rem;
            right: auto;
          `}
  }
`;

export const ChatBubble = styled.div`
  position: relative;
  z-index: 0;
  width: 100%;
  aspect-ratio: 1851 / 473;
  color: ${({ theme }) => theme.colors.white};
  isolation: isolate;
`;

const bubbleShapeStyles = css`
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  filter: drop-shadow(0 0.875rem 1.5rem rgba(24, 119, 242, 0.14));
  
  & > svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

export const EmojiShape = styled(EmojiGraphic)`
  width: 100%;
  height: 100%;
  display: block;
`;

export const BubbleShapeFrame = styled.div`
  ${bubbleShapeStyles}
`;

export const bubbleGraphics = {
  1: TalkBoxGraphic1,
  2: TalkBoxGraphic2,
  3: TalkBoxGraphic3,
  4: TalkBoxGraphic4,
} as const;

export const MessageLayer = styled.div<ReviewWrapperProps>`
  position: absolute;
  top: 0.35rem;
  bottom: 0.8rem;
  left: ${({ $align }) => ($align === "right" ? "1.35rem" : "3.4rem")};
  right: ${({ $align }) => ($align === "right" ? "3.4rem" : "1.35rem")};
  display: grid;
  place-items: center;
  box-sizing: border-box;

  @media (max-width: 56.25rem) {
    top: 0.3rem;
    bottom: 0.7rem;
    left: ${({ $align }) => ($align === "right" ? "1.05rem" : "2.7rem")};
    right: ${({ $align }) => ($align === "right" ? "2.7rem" : "1.05rem")};
  }
`;

export const Message = styled.p`
  margin: 0;
  width: 100%;
  font-size: 1.18rem;
  font-weight: 800;
  line-height: 1.38;
  letter-spacing: -0.04rem;
  text-align: center;
  white-space: pre-line;

  @media (max-width: 56.25rem) {
    font-size: 1.02rem;
  }
`;
