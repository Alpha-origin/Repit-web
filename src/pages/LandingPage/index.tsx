import * as S from "./style";
import FirstSection from "./sections/FirstSection";
import SecondSection from "./sections/SecondSection";
import ThirdSection from "./sections/ThirdSection";

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
