import { usePortfolioForm } from "@/features/my-page/portfolio/model/usePortfolioForm";
import PersonalInfo from "@/widgets/my-page/personal-info";
import Portfolio from "@/widgets/my-page/portfolio";
import * as S from "./style";

const MyPage = () => {
  const portfolioForm = usePortfolioForm();

  return (
    <S.Page>
      <PersonalInfo />
      <Portfolio {...portfolioForm} />
    </S.Page>
  );
};

export default MyPage;
