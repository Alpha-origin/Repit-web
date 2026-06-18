import * as S from "./style";
import FirstSection from "./first-section";
import SecondSection from "./second-section";
import ThirdSection from "./third-section";

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
