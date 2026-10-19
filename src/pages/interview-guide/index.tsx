import FirstSection from "@/pages/landing-page/first-section";
import SecondSection from "@/pages/landing-page/second-section";
import ThirdSection from "@/pages/landing-page/third-section";
import * as S from "@/pages/landing-page/style";

const InterviewGuidePage = () => (
  <S.Page>
    <FirstSection isGuide />
    <SecondSection startPath="/main" />
    <ThirdSection />
  </S.Page>
);

export default InterviewGuidePage;
