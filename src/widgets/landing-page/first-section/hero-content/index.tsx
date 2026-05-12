import * as S from "./style";
import { useNavigate } from "react-router-dom";

const HeroContent = () => {
    const navigate = useNavigate();
  return (
    <S.Content>
      <S.Badge>
        <span>AI 기반 모의 면접 플랫폼,</span>
        <S.BadgeBrand>
          <span>Re:pit</span>
        </S.BadgeBrand>
      </S.Badge>

      <S.Title>
        실전처럼 준비하는
        <br />
      </S.Title>
      <S.MainTitle>
        AI 면접 코칭 플랫폼
      </S.MainTitle>

      <S.Subtitle>
        취업 준비를 위한 맞춤 기술 면접 연습과 피드백
      </S.Subtitle>

      <S.StartButton onClick={() => navigate('/login')}>
        면접 시작하기
      </S.StartButton>
    </S.Content>
  );
};

export default HeroContent;
