import FirstSectionWidget from "@/widgets/landing-page/first-section";
import * as S from "./style";

const FirstSection = () => {
  return (
    <S.Section>
      <S.BackgroundGlow />
      <FirstSectionWidget />
    </S.Section>
  );
};

export default FirstSection;
