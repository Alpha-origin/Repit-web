import * as WidgetS from "@/widgets/landing-page/second-section/style";
import Footer from "@/widgets/landing-page/second-section/footer";
import MainService from "@/widgets/landing-page/second-section/main-service";
import * as S from "./style";

const SecondSection = () => {
  return (
    <S.Container>
      <WidgetS.Content>
        <MainService />
      </WidgetS.Content>
      <Footer />
    </S.Container>
  );
};

export default SecondSection;
