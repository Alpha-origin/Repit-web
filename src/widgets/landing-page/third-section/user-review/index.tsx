import {
  THIRD_SECTION_REVIEW_ITEMS,
  THIRD_SECTION_SUBTITLE,
  THIRD_SECTION_TITLE,
} from "@/shared/constants/landing-page/third-section";
import type { ComponentType, SVGProps } from "react";
import { useReducedMotion } from "framer-motion";
import { listVariants, revealVariants, userReviewViewport } from "./animation";
import * as S from "./style";
import type { BubbleAssetKey } from "./types";

const bubbleGraphicMap: Record<
  BubbleAssetKey,
  ComponentType<SVGProps<SVGSVGElement>>
> = S.bubbleGraphics;

const UserReview = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <S.ContentMotion
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={shouldReduceMotion ? undefined : userReviewViewport}
    >
      <S.Header variants={revealVariants}>
        <S.SubTitle>{THIRD_SECTION_SUBTITLE}</S.SubTitle>
        <S.Title>{THIRD_SECTION_TITLE}</S.Title>
      </S.Header>

      <S.ReviewGrid variants={listVariants}>
        {THIRD_SECTION_REVIEW_ITEMS.map((review) => {
          const BubbleGraphic = bubbleGraphicMap[review.bubbleAsset];

          return (
            <S.ReviewWrapper
              key={review.id}
              $align={review.align}
              variants={revealVariants}
            >
              <S.BubbleCluster $align={review.align}>
                <S.Emoji $align={review.align} aria-hidden="true">
                  <S.EmojiShape />
                </S.Emoji>
                <S.ChatBubble>
                  <S.BubbleShapeFrame aria-hidden="true">
                    <BubbleGraphic />
                  </S.BubbleShapeFrame>
                  <S.MessageLayer $align={review.align}>
                    <S.Message>{review.message}</S.Message>
                  </S.MessageLayer>
                </S.ChatBubble>
              </S.BubbleCluster>
            </S.ReviewWrapper>
          );
        })}
      </S.ReviewGrid>
    </S.ContentMotion>
  );
};

export default UserReview;
