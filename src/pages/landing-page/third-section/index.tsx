import { THIRD_SECTION_FOOTER_TEXT } from "@/shared/constants/landing-page/third-section";
import ThirdSectionWidget from "@/widgets/landing-page/third-section";
import * as S from "./style";

const ThirdSection = () => {
  return (
    <S.Container>
      <S.Content>
        <ThirdSectionWidget />
      </S.Content>

      <S.Footer>
        <span>{THIRD_SECTION_FOOTER_TEXT}</span>
      </S.Footer>
    </S.Container>
  );
};

export default ThirdSection;
