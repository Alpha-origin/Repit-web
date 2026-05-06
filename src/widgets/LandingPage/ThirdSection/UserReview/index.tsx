import { useReducedMotion } from "framer-motion";
import {
  THIRD_SECTION_REVIEW_ITEMS,
  THIRD_SECTION_SUBTITLE,
  THIRD_SECTION_TITLE,
} from "@/shared/constants/LandingPage/ThirdSection";
import {
  listVariants,
  revealVariants,
  userReviewViewport,
} from "./animation";
import * as S from "./style";

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
        {THIRD_SECTION_REVIEW_ITEMS.map((review) => (
          <S.ReviewWrapper
            key={review.id}
            align={review.align}
            variants={revealVariants}
          >
            <S.Emoji align={review.align}>{review.emoji}</S.Emoji>

            <S.ChatBubble
              align={review.align}
              color={review.color}
            >
              {review.message.split("\n").map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </S.ChatBubble>
          </S.ReviewWrapper>
        ))}
      </S.ReviewGrid>
    </S.ContentMotion>
  );
};

export default UserReview;
