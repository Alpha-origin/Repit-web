import RepitLogo from "@/shared/img/Repit.svg?react";
import * as S from "./style";
import type { FirstSectionComponent } from "./type";

const FirstSection: FirstSectionComponent = () => {
  return (
    <S.Section>
      <S.BackgroundGlow />

      <S.Header>
        <S.Logo>
          <span aria-hidden="true">
            <RepitLogo />
          </span>
          <span>e:pit</span>
        </S.Logo>

        <S.Nav>
          <S.SignUp>Sign Up</S.SignUp>
          <S.Login>Login</S.Login>
        </S.Nav>
      </S.Header>

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
          AI 면접 코칭
        </S.Title>

        <S.Subtitle>
          취업 준비를 위한 맞춤 기술 면접 연습과 피드백
        </S.Subtitle>

        <S.StartButton>면접 시작하기</S.StartButton>
      </S.Content>
    </S.Section>
  );
};

export default FirstSection;
