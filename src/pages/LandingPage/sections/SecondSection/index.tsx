import MainService from "@/widgets/LandingPage/SecondSection/MainService";
import * as S from "./style";
import type { SecondSectionProps } from "./type";

const SecondSection = ({}: SecondSectionProps) => {
  return (
    <S.Container>
      <MainService />
    </S.Container>
  );
};

export default SecondSection;
