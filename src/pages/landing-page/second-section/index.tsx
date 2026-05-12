import Footer from "@/widgets/landing-page/second-section/footer";
import MainService from "@/widgets/landing-page/second-section/main-service";
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
