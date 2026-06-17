import { useEffect } from "react";

import DashBoardMain from "@/widgets/main-page/dash-board";
import MainPageFooter from "@/widgets/main-page/footer";
import * as S from "./style";

const MainPage = () => {
  useEffect(() => {
    console.log("MainPage loaded");
  }, []);

  return (
    <S.Page>
      <DashBoardMain />
      <MainPageFooter />
    </S.Page>
  );
};

export default MainPage;