import HeroContent from "@/widgets/LandingPage/HeroContent";
import LandingPageHeader from "@/widgets/LandingPage/LandingPageHeader";
import * as S from "./style";
import type { FirstSectionComponent } from "./type";

const FirstSection: FirstSectionComponent = () => {
  return (
    <S.Section>
      <S.BackgroundGlow />
      <LandingPageHeader />
      <HeroContent />
    </S.Section>
  );
};

export default FirstSection;
