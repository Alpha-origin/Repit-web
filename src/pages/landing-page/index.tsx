import * as S from "./style";
import FirstSection from "./sections/first-section";
import SecondSection from "./sections/second-section";
import ThirdSection from "./sections/third-section";

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
