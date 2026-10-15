import type { ChangeEvent, FormEvent } from "react";
import type { PersonalInfoDraft } from "@/features/my-page/personal-info/model/useMyInfo";

import * as S from "./style";

interface PersonalInfoProps {
  draft: PersonalInfoDraft;
  email: string;
  errorMessage: string;
  isLoading: boolean;
  isSaving: boolean;
  onFieldChange: (field: keyof PersonalInfoDraft, value: string) => void;
  onSave: () => void;
  saveMessage: string;
}

const PersonalInfo = ({
  draft,
  email,
  errorMessage,
  isLoading,
  isSaving,
  onFieldChange,
  onSave,
  saveMessage,
}: PersonalInfoProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <S.PersonalInfoWrapper aria-labelledby="personal-info-title">
      <S.ProfileHeader>
        <S.Avatar aria-hidden="true">
          {(draft.nickname || draft.name || "R").slice(0, 1)}
        </S.Avatar>
        <S.ProfileName>{draft.nickname || draft.name || "회원"}님</S.ProfileName>
      </S.ProfileHeader>
      <S.Form onSubmit={handleSubmit}>

        {isLoading ? (
          <S.StatusText>유저 정보를 불러오는 중입니다.</S.StatusText>
        ) : (
          <S.InfoList>
            <S.InfoRow>
              <S.Label htmlFor="my-page-name">이름</S.Label>
              <S.EditInput
                id="my-page-name"
                type="text"
                autoComplete="name"
                value={draft.name}
                disabled={isSaving}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange("name", event.target.value)
                }
              />
            </S.InfoRow>

            <S.InfoRow>
              <S.Label htmlFor="my-page-nickname">닉네임</S.Label>
              <S.EditInput
                id="my-page-nickname"
                type="text"
                autoComplete="nickname"
                value={draft.nickname}
                disabled={isSaving}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange("nickname", event.target.value)
                }
              />
            </S.InfoRow>

            <S.InfoRow>
              <S.Label htmlFor="my-page-email">이메일</S.Label>
              <S.EditInput
                id="my-page-email"
                type="email"
                autoComplete="email"
                value={email}
                readOnly
                aria-describedby="my-page-email-hint"
              />
              <S.FieldHint id="my-page-email-hint">
                이메일은 변경할 수 없어요.
              </S.FieldHint>
            </S.InfoRow>
          </S.InfoList>
        )}

        {(errorMessage || saveMessage) && (
          <S.ResultMessage
            role={errorMessage ? "alert" : "status"}
            $isError={!!errorMessage}
          >
            {errorMessage || saveMessage}
          </S.ResultMessage>
        )}

        <S.SaveButton type="submit" disabled={isLoading || isSaving}>
          {isSaving ? "저장 중…" : "개인정보 저장"}
        </S.SaveButton>
      </S.Form>
    </S.PersonalInfoWrapper>
  );
};

export default PersonalInfo;
