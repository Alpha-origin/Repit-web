import type { ChangeEvent, KeyboardEvent, RefObject } from "react";

import MyPageFileImage from "@/shared/img/my-page/Repit-mypage.svg?url";

import * as S from "./style";

interface PortfolioProps {
  fileError: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  gitInput: string;
  gitUrls: string[];
  isSaving: boolean;
  onBack: () => void;
  onGitAdd: () => void;
  onGitInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onGitInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onGitRemove: (gitUrl: string) => void;
  onPortfolioFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPortfolioSave: () => void;
  onPortfolioUploadClick: () => void;
  saveError: string;
  saveMessage: string;
  selectedPortfolioFile: File | null;
}

const TrashIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    width="17"
    height="17"
  >
    <path
      d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6v9h2V9h-2Zm4 0v9h2V9h-2ZM7 9h2v9c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V9h2v9c0 2.21-1.79 4-4 4h-2c-2.21 0-4-1.79-4-4V9Z"
      fill="currentColor"
    />
  </svg>
);

const Portfolio = ({
  fileError,
  fileInputRef,
  gitInput,
  gitUrls,
  isSaving,
  onBack,
  onGitAdd,
  onGitInputChange,
  onGitInputKeyDown,
  onGitRemove,
  onPortfolioFileChange,
  onPortfolioSave,
  onPortfolioUploadClick,
  saveError,
  saveMessage,
  selectedPortfolioFile,
}: PortfolioProps) => {
  const isGitAddDisabled = !gitInput.trim();

  return (
    <S.PortfolioWrapper>
      <S.Title>포트폴리오</S.Title>

      <S.UploadBox>
        <S.GuideBadge>
          내용이 정밀할수록 가이드 정밀도 <span>UP</span>
        </S.GuideBadge>

        <S.UploadContent>
          <S.FileIcon src={MyPageFileImage} alt="" aria-hidden="true" />

          <S.UploadText>
            자신의 포트폴리오를 첨부해주세요. <span>PDF 형식</span>
          </S.UploadText>

          <S.UploadButton type="button" onClick={onPortfolioUploadClick}>
            + 파일첨부
          </S.UploadButton>

          <S.HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={onPortfolioFileChange}
          />
        </S.UploadContent>
      </S.UploadBox>

      {selectedPortfolioFile && (
        <S.SelectedFileRow>
          <S.SelectedFileName>{selectedPortfolioFile.name}</S.SelectedFileName>
          <S.ReplaceFileButton
            type="button"
            aria-label="포트폴리오 PDF 교체"
            onClick={onPortfolioUploadClick}
          >
            +
          </S.ReplaceFileButton>
        </S.SelectedFileRow>
      )}

      {fileError && <S.FieldError role="alert">{fileError}</S.FieldError>}

      <S.InputSection>
        <S.Label htmlFor="my-page-git">git</S.Label>

        <S.GitInputWrapper>
          <S.Input
            id="my-page-git"
            type="text"
            value={gitInput}
            placeholder="깃허브 주소를 링크 또는 아이디로 입력해주세요."
            onChange={onGitInputChange}
            onKeyDown={onGitInputKeyDown}
          />
          <S.GitAddButton
            type="button"
            aria-label="Git 주소 추가"
            disabled={isGitAddDisabled}
            onClick={onGitAdd}
          >
            +
          </S.GitAddButton>
        </S.GitInputWrapper>

        {gitUrls.length > 0 && (
          <S.GitUrlList>
            {gitUrls.map((gitUrl) => (
              <S.GitUrlRow key={gitUrl}>
                <S.GitUrlText>{gitUrl}</S.GitUrlText>
                <S.GitRemoveButton
                  type="button"
                  aria-label={`${gitUrl} 삭제`}
                  onClick={() => onGitRemove(gitUrl)}
                >
                  <TrashIcon />
                </S.GitRemoveButton>
              </S.GitUrlRow>
            ))}
          </S.GitUrlList>
        )}
      </S.InputSection>

      {(saveMessage || saveError) && (
        <S.SaveStatus role={saveError ? "alert" : "status"} $isError={!!saveError}>
          {saveError || saveMessage}
        </S.SaveStatus>
      )}

      <S.ButtonWrapper>
        <S.BackButton type="button" onClick={onBack}>
          돌아가기
        </S.BackButton>

        <S.SaveButton
          type="button"
          disabled={isSaving}
          onClick={onPortfolioSave}
        >
          {isSaving ? "저장 중..." : "저장"}
        </S.SaveButton>
      </S.ButtonWrapper>
    </S.PortfolioWrapper>
  );
};

export default Portfolio;
