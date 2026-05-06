import * as S from "./style";
import FirstSection from "./sections/FirstSection";
import SecondSection from "./sections/SecondSection";

const LandingPage = () => {
  return (
    <S.Page>
      <FirstSection />
      <SecondSection />
    </S.Page>
  );
};

export default LandingPage;
