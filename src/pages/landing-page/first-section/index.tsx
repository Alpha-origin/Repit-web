import HeroContent from "@/widgets/landing-page/first-section/hero-content";
import LandingPageHeader from "@/widgets/landing-page/first-section/landing-page-header";
import * as S from "./style";

const FirstSection = ({ isGuide = false }: { isGuide?: boolean }) => {
  return (
    <S.Section>
      <S.BackgroundGlow />
      <S.BackgroundGround />
      <LandingPageHeader isGuide={isGuide} />
      <HeroContent startPath={isGuide ? "/main" : "/login"} />
    </S.Section>
  );
};

export default FirstSection;
