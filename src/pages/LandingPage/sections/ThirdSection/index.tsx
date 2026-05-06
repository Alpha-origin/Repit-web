import * as S from "./style";

const reviews = [
  {
    id: 1,
    align: "left",
    color: "primary",
  },
  {
    id: 2,
    align: "right",
    color: "primary",
  },
  {
    id: 3,
    align: "left",
    color: "secondary",
  },
  {
    id: 4,
    align: "right",
    color: "light",
  },
];

const ThirdSection = () => {
  return (
    <S.Container>
      <S.Inner>
        <S.Header>
          <S.SubTitle>User Review</S.SubTitle>
          <S.Title>사람들이 말하는 레핏</S.Title>
        </S.Header>

        <S.ReviewGrid>
          {reviews.map((review) => (
            <S.ReviewWrapper key={review.id} align={review.align}>
              <S.Emoji align={review.align}>🥰</S.Emoji>

              <S.ChatBubble
                align={review.align}
                color={review.color}
              >
                혼자 집에서도 간편하게 면접을 보고
                <br />
                구체적인 피드백을 받을 수 있어 좋아요
              </S.ChatBubble>
            </S.ReviewWrapper>
          ))}
        </S.ReviewGrid>
      </S.Inner>

      <S.Footer>
        <span>사이트 정보 여기</span>
      </S.Footer>
    </S.Container>
  );
};

export default ThirdSection;
