import BackGroundPage from "@/widgets/main-page/background-page";
import DashBoardMain from "@/widgets/main-page/dash-board";
import MainPageFooter from "@/widgets/main-page/footer";
import Header from "@/shared/components/header/index";
import * as S from "./style";

const MainPage = () => {
  return (
    <S.Page>
      <BackGroundPage />
      <Header />
      <DashBoardMain />
      <MainPageFooter />
    </S.Page>
  );
};
export default MainPage;
