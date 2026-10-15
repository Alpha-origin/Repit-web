import { MAIN_PAGE_GUIDE_ROUTE } from "@/shared/constants/main-page/dash-board";
import ServicePreview from "./service-preview";
import * as S from "./style";

const MainPageFooter = () => {
  return (
    <S.Section aria-label="AI 모의 면접 안내">
      <S.BannerCard>
        <S.Title>AI 모의 면접이 궁금해요!</S.Title>
        <S.ActionLink to={MAIN_PAGE_GUIDE_ROUTE}>AI 모의면접 알아보기</S.ActionLink>
      </S.BannerCard>
      <S.PromotionCard>
        <S.PromotionContent>
          <S.PromotionTitle>준비된 면접이 합격을 만든다</S.PromotionTitle>
          <S.PromotionDescription>
            <span>AI 기술로 정교하게 분석하고 성장하는 스마트한</span>
            <span>면접 준비 파트너 Repit과 함께</span>
            <span>당신의 커리어를 시작하세요.</span>
          </S.PromotionDescription>
          <S.GuideCallout>
            <span>AI 모의 면접이 궁금하다면?</span>
            <S.GuideLink to={MAIN_PAGE_GUIDE_ROUTE}>AI모의 면접 알아보기</S.GuideLink>
          </S.GuideCallout>
        </S.PromotionContent>
        <ServicePreview />
      </S.PromotionCard>
    </S.Section>
  );
};

export default MainPageFooter;
