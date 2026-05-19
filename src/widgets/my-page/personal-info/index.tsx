import { MY_PAGE_PERSONAL_INFO_FIELDS } from "@/shared/constants/my-page";

import * as S from "./style";

const PersonalInfo = () => {
  return (
    <S.PersonalInfoWrapper>
      <S.Title>개인정보</S.Title>

      <S.InfoList>
        {MY_PAGE_PERSONAL_INFO_FIELDS.map((field) => (
          <S.InfoRow key={field.label}>
            <S.Label>{field.label}</S.Label>
            <S.Value>{field.value}</S.Value>
          </S.InfoRow>
        ))}
      </S.InfoList>

      <S.EditButton type="button">회원정보 수정</S.EditButton>
    </S.PersonalInfoWrapper>
  );
};

export default PersonalInfo;
