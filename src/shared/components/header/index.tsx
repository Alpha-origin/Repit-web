import * as S from "./style";
import Repit from "@/shared/img/logo/Repit-logo.svg?url";

const Header = () => {
  return (
      <S.Header>
        <S.LogoImage src={Repit} alt="Repit" />

        <S.TopButtons>
          <S.TopButton>면접</S.TopButton>
          <S.TopButton>피드백</S.TopButton>
          <S.TopButton>마이페이지</S.TopButton>
        </S.TopButtons>

         <S.StatusButtons>
          <S.LogoutButton>로그아웃</S.LogoutButton>
          <S.StatusButton>한석주님</S.StatusButton>
        </S.StatusButtons>
      </S.Header>

  );
};

export default Header;
