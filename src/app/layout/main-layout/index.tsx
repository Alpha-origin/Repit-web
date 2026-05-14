import BackGroundPage from "@/widgets/main-page/background-page";
import Header from "@/shared/components/header/index";
import { Outlet } from "react-router-dom";
import * as S from "./style";

const MainLayout = () => {
  return (
    <S.Page>
      <BackGroundPage />
      <S.Content>
        <Header />
        <S.OutletArea>
          <Outlet />
        </S.OutletArea>
      </S.Content>
    </S.Page>
  );
};

export default MainLayout;
