import styled, { css } from "styled-components";

type ReviewWrapperProps = {
  align: "left" | "right";
};

type ChatBubbleProps = {
  align: "left" | "right";
  color: "primary" | "secondary" | "light";
};

type EmojiProps = {
  align: "left" | "right";
};

export const Container = styled.section`
  position: relative;
  left: 50%;

  width: 100%;
  width: 100vw;
  min-height: 100vh;
  margin-left: -50vw;

  background: #f2f3f5;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  overflow: hidden;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 5.5rem 6.5rem 6.5rem;

  @media (max-width: 56.25rem) {
    padding: 4.5rem 1.5rem 5rem;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 6.5rem;
`;

export const SubTitle = styled.span`
  margin-bottom: 0.5rem;

  font-size: 1.25rem;
  font-weight: 600;

  color: #9dc1ff;
`;

export const Title = styled.h2`
  margin: 0;

  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.05rem;

  color: #2f80ed;

  @media (max-width: 56.25rem) {
    font-size: 1.875rem;
  }
`;

export const ReviewGrid = styled.div`
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

export const ReviewWrapper = styled.div<ReviewWrapperProps>`
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

  font-size: 3.5rem;

  z-index: 10;
`;

export const ChatBubble = styled.div<ChatBubbleProps>`
  position: relative;

  width: min(100%, 28rem);

  padding: 1.75rem 2.25rem;

  border-radius: 1.75rem;

  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: -0.04rem;

  color: white;

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

  ${({ align }) =>
    align === "left"
      ? css`
          &::after {
            content: "";

            position: absolute;
            bottom: -1.5rem;
            left: 0;

            width: 0;
            height: 0;

            border-top: 1.5rem solid currentColor;
            border-right: 2.125rem solid transparent;

            color: inherit;
          }
        `
      : css`
          &::after {
            content: "";

            position: absolute;
            bottom: -1.5rem;
            right: 0;

            width: 0;
            height: 0;

            border-top: 1.5rem solid currentColor;
            border-left: 2.125rem solid transparent;

            color: inherit;
          }
        `}

  @media (max-width: 56.25rem) {
    width: 100%;
    padding: 1.5rem 1.75rem;
    font-size: 1rem;
  }
`;

export const Footer = styled.footer`
  width: 100%;
  height: 7.5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    180deg,
    #d8e8ff 0%,
    #c5dcff 100%
  );

  font-size: 2.5rem;
  font-weight: 700;

  color: black;
`;
