import Footer from './footer';
import MainService from './main-service';
import * as S from './style';

const SecondSectionWidget = () => {
  return (
    <>
      <S.Content>
        <MainService />
      </S.Content>
      <Footer />
    </>
  );
};

export default SecondSectionWidget;
