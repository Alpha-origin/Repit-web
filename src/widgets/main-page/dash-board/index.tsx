import {
  MAIN_PAGE_DASHBOARD_CONTENT,
  MAIN_PAGE_DASHBOARD_FEATURE_ITEMS,
} from "@/shared/constants/main-page/dash-board";
import DashboardBottomImage from "@/shared/img/main-page/Main-DahBoard-Bottom.svg?url";
import DashboardCheckImage from "@/shared/img/main-page/Repit-check.svg?url";
import DashboardTopImage from "@/shared/img/main-page/Main-DashBoard-Top.svg?url";
import { useNavigate } from "react-router-dom";
import * as S from "./style";

const DashboardMain = () => {
  const navigate = useNavigate();
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
              <S.ChallengeBadge onClick={() => navigate("/main/setting/interview")}>
                {MAIN_PAGE_DASHBOARD_CONTENT.topChallengeBadge}
              </S.ChallengeBadge>
              <S.TopTitle>{MAIN_PAGE_DASHBOARD_CONTENT.topTitle}</S.TopTitle>
            </S.LeftCopy>
          </S.TopBanner>

          <S.RightCopy>
            <S.TopRow>
              <S.CheckIcon src={DashboardCheckImage} alt="" aria-hidden="true" />
              <S.Description>
                {MAIN_PAGE_DASHBOARD_CONTENT.description}
              </S.Description>
              <S.AiBadge>{MAIN_PAGE_DASHBOARD_CONTENT.aiBadge}</S.AiBadge>
            </S.TopRow>

            <S.FeatureGrid>
              {MAIN_PAGE_DASHBOARD_FEATURE_ITEMS.map((item) => (
                <S.FeatureItem key={item.title}>
                  <S.FeatureDescription>
                    {item.description}
                  </S.FeatureDescription>
                  <S.FeatureTitle>{item.title}</S.FeatureTitle>
                </S.FeatureItem>
              ))}
            </S.FeatureGrid>

            <S.StartButton type="button" onClick={() => navigate("/main/setting/interview")}>
              {MAIN_PAGE_DASHBOARD_CONTENT.startButton}
            </S.StartButton>
          </S.RightCopy>
        </S.TopCardInner>
      </S.TopCard>

      <S.BottomCard>
        <S.BottomCardInner>
          <S.BottomCardImage
            src={DashboardBottomImage}
            alt=""
            aria-hidden="true"
          />

          <S.BottomOverlay>
            <S.ReadyBadge>
              {MAIN_PAGE_DASHBOARD_CONTENT.readyBadge}
            </S.ReadyBadge>
            <S.BottomTitle>
              {MAIN_PAGE_DASHBOARD_CONTENT.bottomTitle}
            </S.BottomTitle>
          </S.BottomOverlay>
        </S.BottomCardInner>
      </S.BottomCard>
    </S.Section>
  );
};

export default DashboardMain;
