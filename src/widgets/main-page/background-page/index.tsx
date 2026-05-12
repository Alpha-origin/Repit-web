import MainBackground from "@/shared/img/main-page/Main-background.svg?url";
import * as S from "./style";

const BackGroundPage = () => {
  return (
    <S.BackgroundPage>
      <S.BackgroundImage src={MainBackground} alt="" aria-hidden="true" />
    </S.BackgroundPage>
  );
};
export default BackGroundPage;
