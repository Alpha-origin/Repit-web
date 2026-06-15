import BackGroundPage from "@/widgets/main-page/background-page";
import Header from "@/shared/components/header/index";
import { Outlet, useLocation } from "react-router-dom";
import * as S from "./style";

const MainLayout = () => {
  const { pathname } = useLocation();
  const isInterviewRoute = pathname === "/main/interview";

  return (
    <S.Page>
      <BackGroundPage />
      <S.Content $isInterviewRoute={isInterviewRoute}>
        <Header />
        <S.OutletArea $isInterviewRoute={isInterviewRoute}>
          <Outlet />
        </S.OutletArea>
      </S.Content>
    </S.Page>
  );
};

export default MainLayout;
