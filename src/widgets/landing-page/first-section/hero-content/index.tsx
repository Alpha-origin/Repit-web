import * as S from "./style";
import { useNavigate } from "react-router-dom";
import BrowserImg from "@/shared/img/landing-page/Browser.svg?url";
const HeroContent = ({ startPath = "/login" }: { startPath?: string }) => {
  const navigate = useNavigate();
  
  return (
    <S.ContentContainer>
      {/* 왼쪽 영역 */}
      <S.LeftSection>
        <S.Badge>
          AI 기반 모의 면접 플랫폼, Repit
        </S.Badge>

        <S.Title>실전처럼 준비하는</S.Title>
        <S.MainTitle>AI 면접 코칭</S.MainTitle>

        <S.Subtitle>
          취업 성공을 위한 가장 스마트한 면접 연습
        </S.Subtitle>

        <S.StartButton onClick={() => navigate(startPath)}>
          면접 시작하기
        </S.StartButton>
      </S.LeftSection>

      {/* 오른쪽 영역 */}
      <S.RightSection>
        <S.BrowserImage src={BrowserImg} alt="Browser preview" />
      </S.RightSection>
    </S.ContentContainer>
  );
};

export default HeroContent;
