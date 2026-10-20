import Logo from "@/shared/img/logo/Repit-logo.svg?url";
import { DASHBOARD_INTERVIEW_MODE_CARDS } from "@/widgets/main-page/dash-board/data";
import * as S from "./style";

const ServicePreview = () => (
  <S.Laptop aria-hidden="true">
    <S.Screen>
      <S.PreviewHeader>
        <img src={Logo} alt="" />
        <span>면접</span>
        <span>피드백</span>
        <span>마이페이지</span>
        <S.UserBadge>회원님</S.UserBadge>
      </S.PreviewHeader>
      <S.PreviewBody>
        {DASHBOARD_INTERVIEW_MODE_CARDS.map((card) => (
          <S.PreviewCard key={card.id}>
            <S.PreviewBanner $reversed={card.isReversed}>
              <img src={card.image} alt="" />
              <strong>{card.title}</strong>
            </S.PreviewBanner>
            <S.PreviewDetails>
              <S.PreviewBadge>AI</S.PreviewBadge>
              <S.PreviewFeatures>
                {card.features.map((feature) => (
                  <span key={feature.title}>{feature.title}</span>
                ))}
              </S.PreviewFeatures>
              <S.PreviewButton>{card.startButton}</S.PreviewButton>
            </S.PreviewDetails>
          </S.PreviewCard>
        ))}
      </S.PreviewBody>
    </S.Screen>
    <S.LaptopBase />
  </S.Laptop>
);

export default ServicePreview;
