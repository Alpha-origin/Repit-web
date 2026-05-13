import BackGroundPage from "@/widgets/main-page/background-page";
import DashBoardMain from "@/widgets/main-page/dash-board";
import MainPageFooter from "@/widgets/main-page/footer";
import Header from "@/widgets/main-page/header";
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
