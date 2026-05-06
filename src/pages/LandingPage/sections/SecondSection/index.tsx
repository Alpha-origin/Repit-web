import Footer from "@/widgets/LandingPage/SecondSection/Footer";
import MainService from "@/widgets/LandingPage/SecondSection/MainService";
import * as S from "./style";

const SecondSection = () => {
  return (
    <S.Container>
      <S.Content>
        <MainService />
      </S.Content>
      <Footer />
    </S.Container>
  );
};

export default SecondSection;
