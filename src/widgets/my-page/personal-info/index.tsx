import type { FormEvent } from "react";

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
    <S.PersonalInfoWrapper>
      <S.Form onSubmit={handleSubmit}>
        <S.Title>개인정보</S.Title>

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
                onChange={(event) => onFieldChange("name", event.target.value)}
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
                onChange={(event) =>
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
              />
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
          {isSaving ? "저장 중" : "저장"}
        </S.SaveButton>
      </S.Form>
    </S.PersonalInfoWrapper>
  );
};

export default PersonalInfo;
