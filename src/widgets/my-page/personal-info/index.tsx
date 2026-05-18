import * as S from "./style";

const PersonalInfo = () => {
  return (
    <S.PersonalInfoWrapper>
      <S.Title>개인정보</S.Title>

      <S.InfoList>
        <S.InfoRow>
          <S.Label>이름</S.Label>
          <S.Value>@@@</S.Value>
        </S.InfoRow>

        <S.InfoRow>
          <S.Label>닉네임</S.Label>
          <S.Value>ㅇㅇㅇ</S.Value>
        </S.InfoRow>

        <S.InfoRow>
          <S.Label>이메일</S.Label>
          <S.Value>@dgsw.hs.kr</S.Value>
        </S.InfoRow>
      </S.InfoList>

      <S.EditButton type="button">회원정보 수정</S.EditButton>
    </S.PersonalInfoWrapper>
  );
};

export default PersonalInfo;