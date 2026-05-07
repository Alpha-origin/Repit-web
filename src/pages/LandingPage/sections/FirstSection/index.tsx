import HeroContent from "@/widgets/LandingPage/FirstSection/HeroContent";
import LandingPageHeader from "@/widgets/LandingPage/FirstSection/LandingPageHeader";
import * as S from "./style";


const FirstSection = () => {
  return (
    <S.Section>
      <S.BackgroundGlow />
      <LandingPageHeader />
      <HeroContent />
    </S.Section>
  );
};

export default FirstSection;
