import DashboardBottomImage from "@/shared/img/main-page/Main-DahBoard-Bottom.svg?url";
import DashboardTopImage from "@/shared/img/main-page/Main-DashBoard-Top.svg?url";
import * as S from "./style";

const featureItems = [
  {
    description: "다양한",
    title: "꼬리질문",
  },
  {
    description: "분석 Ai를 통한",
    title: "피드백",
  },
  {
    description: "면접데이터를 이용한",
    title: "성장 추적",
  },
];

const DashboardMain = () => {
  return (
    <S.Section>
      <S.TopCard>
        <S.TopCardInner>
          <S.TopBanner>
            <S.TopBannerImage
              src={DashboardTopImage}
              alt=""
              aria-hidden="true"
            />

            <S.LeftCopy>
              <S.ChallengeBadge>도전하기</S.ChallengeBadge>
              <S.TopTitle>실전 체험하기</S.TopTitle>
            </S.LeftCopy>
          </S.TopBanner>

          <S.RightCopy>
            <S.TopRow>
              <S.CheckIcon>✓</S.CheckIcon>
              <S.Description>
                돌발 상황에도 유연하게 대응하고 싶은 취업 준비생
              </S.Description>
              <S.AiBadge>Ai</S.AiBadge>
            </S.TopRow>

            <S.FeatureGrid>
              {featureItems.map((item) => (
                <S.FeatureItem key={item.title}>
                  <S.FeatureDescription>{item.description}</S.FeatureDescription>
                  <S.FeatureTitle>{item.title}</S.FeatureTitle>
                </S.FeatureItem>
              ))}
            </S.FeatureGrid>

            <S.StartButton type="button">면접 시작하기</S.StartButton>
          </S.RightCopy>
        </S.TopCardInner>
      </S.TopCard>

      <S.BottomCard>
        <S.CardImage src={DashboardBottomImage} alt="" aria-hidden="true" />

        <S.BottomOverlay>
          <S.ReadyBadge>준비중...</S.ReadyBadge>
          <S.BottomTitle>아직 공개되지 않은 서비스입니다.</S.BottomTitle>
        </S.BottomOverlay>
      </S.BottomCard>
    </S.Section>
  );
};

export default DashboardMain;
