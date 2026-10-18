import type { ChangeEvent, KeyboardEvent, RefObject, ReactNode } from "react";

import type { MaterialDocument } from "@/features/my-page/api/materials";
import { getDocumentTypeLabel } from "@/shared/constants/job/documentTypes";
import type { GithubRule } from "@/shared/constants/job/jobRoles";

import * as S from "./style";

interface PortfolioProps {
  children?: ReactNode;
  jobSelection: ReactNode;
  gitInputRef: RefObject<HTMLInputElement | null>;
  githubRule: GithubRule;
  isSaveDisabled: boolean;
  isAnalyzing: boolean;
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
  savedDocuments: MaterialDocument[];
  selectedPortfolioFile: File | null;
}

// 옛 업로드로 저장한 문서는 파일명이 없어 종류 이름으로 보여 준다.
const getSavedDocumentsTitle = (documents: MaterialDocument[]) => {
  const [first] = documents;
  if (!first) return "";
  const name = first.fileName ?? getDocumentTypeLabel(first.type);
  return documents.length > 1 ? `${name} 외 ${documents.length - 1}개` : name;
};

const getSavedDocumentsText = (documents: MaterialDocument[]) => {
  const pageCounts = documents.map((document) => document.pageCount);
  const totalPages = pageCounts.every((count) => count !== null)
    ? pageCounts.reduce<number>((sum, count) => sum + (count ?? 0), 0)
    : null;
  return totalPages ? `저장된 자료 · 총 ${totalPages}쪽` : "저장된 자료";
};

const DocumentIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <path d="M14 3v6h6M8 13h8M8 17h5" />
  </svg>
);

const GithubIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-4.3 1.3-4.3-2-6-2.5M15 22v-3.4c0-1 .1-1.5-.5-2.1 3.1-.4 6.5-1.5 6.5-7A5.4 5.4 0 0 0 19.5 6c.2-1 .2-2-.1-3 0 0-1.2-.4-3.8 1a13 13 0 0 0-7.2 0C5.8 2.6 4.6 3 4.6 3c-.3 1-.3 2-.1 3A5.4 5.4 0 0 0 3 9.5c0 5.5 3.4 6.6 6.5 7-.6.6-.6 1.2-.5 2.1V22" />
  </svg>
);

const TrashIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6" />
  </svg>
);

const Portfolio = ({
  children,
  jobSelection,
  gitInputRef,
  githubRule,
  isSaveDisabled,
  isAnalyzing,
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
  savedDocuments,
  selectedPortfolioFile,
}: PortfolioProps) => {
  const isGitAddDisabled = !gitInput.trim();
  const hasSavedDocuments = !selectedPortfolioFile && savedDocuments.length > 0;
  const hasFile = !!selectedPortfolioFile || hasSavedDocuments;

  return (
    <S.PortfolioWrapper aria-labelledby="portfolio-title">
      <S.Header>
        <S.Title id="portfolio-title">나의 면접 자료</S.Title>
        <S.Description>
          포트폴리오와 GitHub를 바탕으로 나에게 맞는 면접 질문을 준비해요.
        </S.Description>
      </S.Header>

      {jobSelection}

      <S.Section aria-labelledby="portfolio-file-title">
        <S.SectionHeading>
          <S.SectionNumber aria-hidden="true">02</S.SectionNumber>
          <S.SectionTitle id="portfolio-file-title">포트폴리오</S.SectionTitle>
          <S.RequiredBadge>필수</S.RequiredBadge>
        </S.SectionHeading>
        <S.Description id="portfolio-file-hint">
          프로젝트와 경험이 담긴 PDF 파일을 첨부해 주세요.
        </S.Description>

        <S.UploadBox $hasFile={hasFile} $hasError={!!fileError}>
          <S.FileIcon><DocumentIcon /></S.FileIcon>
          <S.UploadContent>
            {selectedPortfolioFile ? (
              <>
                <S.UploadTitle title={selectedPortfolioFile.name}>{selectedPortfolioFile.name}</S.UploadTitle>
                <S.UploadText>PDF · 저장하면 자료 분석이 시작돼요</S.UploadText>
              </>
            ) : hasSavedDocuments ? (
              <>
                <S.UploadTitle title={getSavedDocumentsTitle(savedDocuments)}>
                  {getSavedDocumentsTitle(savedDocuments)}
                </S.UploadTitle>
                <S.UploadText>{getSavedDocumentsText(savedDocuments)}</S.UploadText>
              </>
            ) : (
              <>
                <S.UploadTitle>포트폴리오 파일 선택</S.UploadTitle>
                <S.UploadText>PDF 형식의 파일 1개를 등록할 수 있어요</S.UploadText>
              </>
            )}
          </S.UploadContent>
          <S.UploadButton
            type="button"
            onClick={onPortfolioUploadClick}
            aria-label={hasFile ? "포트폴리오 PDF 교체" : "포트폴리오 PDF 첨부"}
            aria-describedby={fileError ? "portfolio-file-error" : "portfolio-file-hint"}
          >
            {hasFile ? "파일 변경" : "+ 파일 첨부"}
          </S.UploadButton>
        </S.UploadBox>
        <S.HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          aria-label="포트폴리오 PDF 파일"
          onChange={onPortfolioFileChange}
        />
        {fileError && <S.FieldError id="portfolio-file-error" role="alert">{fileError}</S.FieldError>}
        <S.FieldHint>경험을 구체적으로 담을수록 더 알맞은 질문을 받을 수 있어요.</S.FieldHint>
      </S.Section>

      {githubRule !== "HIDDEN" && (
      <S.Section aria-labelledby="github-section-title">
        <S.SectionHeading>
          <S.SectionNumber aria-hidden="true">03</S.SectionNumber>
          <S.SectionTitle id="github-section-title">
            <S.Label htmlFor="my-page-git">GitHub</S.Label>
          </S.SectionTitle>
          {githubRule === "REQUIRED" && <S.RequiredBadge>필수</S.RequiredBadge>}
        </S.SectionHeading>
        <S.Description id="my-page-git-hint">
          {githubRule === "REQUIRED"
            ? "나의 개발 경험을 보여줄 GitHub 주소를 추가해 주세요."
            : "(선택) 데이터·코드 저장소가 있으면 추가해 주세요."}
        </S.Description>

        <S.GitInputWrapper>
          <S.InputIcon><GithubIcon /></S.InputIcon>
          <S.Input
            ref={gitInputRef}
            id="my-page-git"
            type="text"
            value={gitInput}
            placeholder="GitHub 주소 또는 아이디 입력"
            aria-describedby="my-page-git-hint"
            autoCapitalize="none"
            spellCheck={false}
            onChange={onGitInputChange}
            onKeyDown={onGitInputKeyDown}
          />
          <S.GitAddButton
            type="button"
            aria-label="Git 주소 추가"
            disabled={isGitAddDisabled}
            onClick={onGitAdd}
          >
            추가
          </S.GitAddButton>
        </S.GitInputWrapper>

        {gitUrls.length > 0 && (
          <S.GitUrlList aria-label="등록할 GitHub 주소">
            {gitUrls.map((gitUrl) => (
              <S.GitUrlRow key={gitUrl}>
                <S.LinkIndicator aria-hidden="true">↗</S.LinkIndicator>
                <S.GitUrlText title={gitUrl}>{gitUrl}</S.GitUrlText>
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
      </S.Section>
      )}

      {children && <S.AnalysisStatus>{children}</S.AnalysisStatus>}

      {(saveMessage || saveError) && (
        <S.SaveStatus role={saveError ? "alert" : "status"} $isError={!!saveError}>
          {saveError || saveMessage}
        </S.SaveStatus>
      )}

      <S.Footer>
        <S.FooterHint>자료를 저장하면 AI가 분석을 시작해요.</S.FooterHint>
        <S.ButtonWrapper>
          <S.BackButton type="button" onClick={onBack}>돌아가기</S.BackButton>
          <S.SaveButton type="button" disabled={isSaveDisabled} onClick={onPortfolioSave}>
            {isSaving ? "저장 중..." : isAnalyzing ? "분석 중…" : "저장"}
          </S.SaveButton>
        </S.ButtonWrapper>
      </S.Footer>
    </S.PortfolioWrapper>
  );
};

export default Portfolio;
