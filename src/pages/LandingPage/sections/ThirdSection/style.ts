import styled, { css } from "styled-components";

interface ReviewWrapperProps {
  align: "left" | "right";
}

interface ChatBubbleProps {
  align: "left" | "right";
  color: "primary" | "secondary" | "light";
}

export const Container = styled.section`
  width: 100%;
  min-height: 100vh;

  background: #f3f5f9;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  overflow: hidden;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1200px;

  margin: 0 auto;
  padding: 80px 24px 120px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 80px;
`;

export const SubTitle = styled.span`
  font-size: 24px;
  font-weight: 600;

  color: #9dc1ff;

  margin-bottom: 8px;
`;

export const Title = styled.h2`
  font-size: 56px;
  font-weight: 700;

  color: #2f80ed;
`;

export const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  gap: 60px 80px;
`;

export const ReviewWrapper = styled.div<ReviewWrapperProps>`
  position: relative;

  display: flex;

  ${({ align }) =>
    align === "right" &&
    css`
      justify-content: flex-end;
    `}
`;

export const Emoji = styled.div`
  position: absolute;
  top: -40px;

  font-size: 72px;

  z-index: 10;
`;

export const ChatBubble = styled.div<ChatBubbleProps>`
  position: relative;

  width: 470px;

  padding: 36px 40px;

  border-radius: 28px;

  font-size: 22px;
  font-weight: 700;
  line-height: 1.5;

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
            bottom: -24px;
            left: 0;

            width: 0;
            height: 0;

            border-top: 24px solid currentColor;
            border-right: 34px solid transparent;

            color: inherit;
          }
        `
      : css`
          &::after {
            content: "";

            position: absolute;
            bottom: -24px;
            right: 0;

            width: 0;
            height: 0;

            border-top: 24px solid currentColor;
            border-left: 34px solid transparent;

            color: inherit;
          }
        `}
`;

export const Footer = styled.footer`
  width: 100%;
  height: 120px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    180deg,
    #d8e8ff 0%,
    #c5dcff 100%
  );

  font-size: 40px;
  font-weight: 700;

  color: black;
`;