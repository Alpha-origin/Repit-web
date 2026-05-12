import * as S from "./style";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  return (
    <S.Container>
      <S.Inner>
        <S.LeftSection>
          <S.Title>
            지금 바로 모의 면접을 경험하고
            <br />
            전문적인 피드백을 받아보자!
          </S.Title>

          <S.StartButton onClick={() => navigate("/login")}>
            면접 시작하기
          </S.StartButton>
        </S.LeftSection>

        <S.GraphicImage aria-hidden="true" />
      </S.Inner>
    </S.Container>
  );
};

export default Footer;
