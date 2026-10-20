import type { FormEvent } from "react";

import type { PersonalInfoDraft } from "@/features/my-page/personal-info/model/useMyInfo";

import * as S from "./style";

interface PersonalInfoProps {
  draft: PersonalInfoDraft;
  email: string;
  errorMessage: string;
  isEditing: boolean;
  isLoading: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onFieldChange: (field: keyof PersonalInfoDraft, value: string) => void;
  onSave: () => void;
  saveMessage: string;
}

const PersonalInfo = ({
  draft,
  email,
  errorMessage,
  isEditing,
  isLoading,
  isSaving,
  onEdit,
  onFieldChange,
  onSave,
  saveMessage,
}: PersonalInfoProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEditing) {
      onSave();
    } else {
      onEdit();
    }
  };

  return (
    <S.PersonalInfoWrapper aria-labelledby="personal-info-title">
      <S.Form onSubmit={handleSubmit}>
        <S.Title id="personal-info-title">개인정보</S.Title>

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
                readOnly={!isEditing}
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
                readOnly={!isEditing}
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
                title="이메일은 변경할 수 없어요."
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

        <S.SaveButton
          type="submit"
          aria-label={isEditing ? "개인정보 저장" : "개인정보 수정"}
          disabled={isLoading || isSaving}
        >
          {isSaving ? "저장 중…" : isEditing ? "저장" : "수정"}
        </S.SaveButton>
      </S.Form>
    </S.PersonalInfoWrapper>
  );
};

export default PersonalInfo;
