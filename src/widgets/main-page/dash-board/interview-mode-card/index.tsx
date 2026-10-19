import { MAIN_PAGE_COMING_SOON_LABEL } from "@/shared/constants/main-page/dash-board";
import DashboardCheckImage from "@/shared/img/main-page/Repit-check.svg?url";
import * as S from "./style";
import type { InterviewModeCardProps } from "./type";

const InterviewModeCard = ({
  aiBadge,
  badge,
  description,
  features,
  image,
  isComingSoon = false,
  isReversed = false,
  onStart,
  startButton,
  title,
  variant,
}: InterviewModeCardProps) => {
  const isStartEnabled = !isComingSoon && Boolean(onStart);

  return (
    <S.Card aria-label={title}>
      <S.CardInner>
        <S.Banner $isReversed={isReversed}>
          <S.BannerImage src={image} alt="" aria-hidden="true" />

          <S.BannerCopy>
            <S.BannerBadge
              type="button"
              $variant={variant}
              disabled={!isStartEnabled}
              title={isComingSoon ? MAIN_PAGE_COMING_SOON_LABEL : undefined}
              onClick={onStart}
            >
              {badge}
            </S.BannerBadge>
            <S.BannerTitle $variant={variant}>{title}</S.BannerTitle>
          </S.BannerCopy>
        </S.Banner>

        <S.Content $isReversed={isReversed}>
          <S.DescriptionRow>
            <S.CheckIcon
              src={DashboardCheckImage}
              alt=""
              aria-hidden="true"
              $isReversed={isReversed}
            />
            <S.Description $isReversed={isReversed}>{description}</S.Description>
            <S.AiBadge $isReversed={isReversed}>{aiBadge}</S.AiBadge>
          </S.DescriptionRow>

          <S.FeatureGrid>
            {features.map((feature) => (
              <S.FeatureItem key={feature.title}>
                <S.FeatureDescription>
                  {feature.description}
                </S.FeatureDescription>
                <S.FeatureTitle $variant={variant}>
                  {feature.title}
                </S.FeatureTitle>
              </S.FeatureItem>
            ))}
          </S.FeatureGrid>

          <S.StartButton
            type="button"
            aria-label={`${title} 시작하기`}
            $variant={variant}
            disabled={!isStartEnabled}
            title={isComingSoon ? MAIN_PAGE_COMING_SOON_LABEL : undefined}
            onClick={onStart}
          >
            {startButton}
          </S.StartButton>
        </S.Content>
      </S.CardInner>
    </S.Card>
  );
};

export default InterviewModeCard;
