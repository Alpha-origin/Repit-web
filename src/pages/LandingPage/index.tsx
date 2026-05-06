import * as S from "./style";
import FirstSection from "./Sections/FirstSection";
import SecondSection from "./Sections/SecondSection";
import ThirdSection from "./Sections/ThirdSection";

const LandingPage = () => {
  return (
    <S.Page>
      <FirstSection />
      <SecondSection />
      <ThirdSection />
    </S.Page>
  );
};

export default LandingPage;
