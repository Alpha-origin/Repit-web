import type { ChangeEvent, RefObject } from "react";
import MyPageFileImage from "@/shared/img/my-page/Repit-mypage.svg?url";
import * as S from "./style";

interface PortfolioProps {
  fileError: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  gitLink: string;
  jobRole: string;
  onGitLinkChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onJobRoleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onPortfolioFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPortfolioUploadClick: () => void;
  selectedPortfolioFile: File | null;
}

const Portfolio = ({
  fileError,
  fileInputRef,
  gitLink,
  jobRole,
  onGitLinkChange,
  onJobRoleChange,
  onPortfolioFileChange,
  onPortfolioUploadClick,
  selectedPortfolioFile,
}: PortfolioProps) => {
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
            자신의 포트폴리오를 첨부해주세요
            <span> PDF형식</span>
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

          {selectedPortfolioFile && (
            <S.SelectedFileName>{selectedPortfolioFile.name}</S.SelectedFileName>
          )}

          {fileError && <S.FileErrorText>{fileError}</S.FileErrorText>}
        </S.UploadContent>
      </S.UploadBox>

      <S.InputSection>
        <S.Label>git</S.Label>

        <S.Input
          type="text"
          value={gitLink}
          placeholder="깃허브 주소를 링크 또는 아이디로 입력해주세요."
          onChange={onGitLinkChange}
        />
      </S.InputSection>

      <S.InputSection>
        <S.Label>직무</S.Label>

        <S.SelectWrapper>
          <S.Select value={jobRole} onChange={onJobRoleChange}>
            <option value="" disabled>
              본인의 직무를 선택해주세요.
            </option>

            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="android">Android</option>
            <option value="ai">AI</option>
          </S.Select>

          <S.Arrow>▼</S.Arrow>
        </S.SelectWrapper>
      </S.InputSection>

      <S.ButtonWrapper>
        <S.BackButton type="button">
          돌아가기
        </S.BackButton>

        <S.SaveButton type="button">
          저장
        </S.SaveButton>
      </S.ButtonWrapper>
    </S.PortfolioWrapper>
  );
};

export default Portfolio;
