import PersonalInfo from "@/widgets/my-page/personal-info";
import Portfolio from "@/widgets/my-page/portfolio";
import * as S from "./style";

const MyPage = () => {
  return (
    <S.Page>
      <PersonalInfo />  
      <Portfolio />
    </S.Page>
  );
};
export default MyPage;