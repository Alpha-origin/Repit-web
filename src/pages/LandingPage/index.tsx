import * as S from "./style";
import type { LandingPageComponent } from "./type";
import FirstSection from "./sections/FirstSection";

const LandingPage: LandingPageComponent = () => {
  return (
    <S.Page>
      <FirstSection />
    </S.Page>
  );
};

export default LandingPage;
