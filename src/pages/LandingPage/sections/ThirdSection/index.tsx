import { THIRD_SECTION_FOOTER_TEXT } from "@/shared/constants/LandingPage/ThirdSection";
import UserReview from "@/widgets/LandingPage/ThirdSection/UserReview";
import * as S from "./style";

const ThirdSection = () => {
  return (
    <S.Container>
      <S.Content>
        <UserReview />
      </S.Content>

      <S.Footer>
        <span>{THIRD_SECTION_FOOTER_TEXT}</span>
      </S.Footer>
    </S.Container>
  );
};

export default ThirdSection;
