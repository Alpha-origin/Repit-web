import type { ChangeEvent, KeyboardEvent, ReactNode, RefObject } from "react";

import type {
  DocumentRow,
  MaterialFormErrors,
  SaveStatus,
  SupplementField,
  SupplementRow,
} from "@/features/my-page/materials/model/useMaterialsForm";
import { getDocumentTypeLabel } from "@/shared/constants/job/documentTypes";
import { getJobRole, type GithubRule } from "@/shared/constants/job/jobRoles";
import { getUploadGuides } from "@/shared/constants/job/uploadGuides";

import DocumentList from "./document-list";
import SupplementForm from "./supplement-form";
import * as S from "./style";

interface PortfolioProps {
  children?: ReactNode;
  jobSelection: ReactNode;
  job: string | null;
  githubRule: GithubRule;
  hasSupplements: boolean;
  documents: DocumentRow[];
  documentSectionRef: RefObject<HTMLElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDocumentAdd: () => void;
  onDocumentRemove: (rowId: string) => void;
  onDocumentTypeChange: (rowId: string, type: string) => void;
  onDocumentAttachClick: (rowId: string) => void;
  onDocumentFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  gitInput: string;
  gitInputRef: RefObject<HTMLInputElement | null>;
  gitUrls: string[];
  onGitAdd: () => void;
  onGitInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onGitInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onGitRemove: (gitUrl: string) => void;
  supplements: SupplementRow[];
  onSupplementAdd: () => void;
  onSupplementRemove: (rowId: string) => void;
  onSupplementChange: (rowId: string, field: SupplementField | "documentId", value: string) => void;
  errors: MaterialFormErrors;
  saveStatus: SaveStatus | null;
  isAnalyzing: boolean;
  isEdited: boolean;
  isSaving: boolean;
  isSaveDisabled: boolean;
  onSave: () => void;
  onCancelEdit: () => void;
  onReanalyze: () => void;
}

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

const formatSectionNumber = (value: number) => String(value).padStart(2, "0");

const Portfolio = ({
  children,
  jobSelection,
  job,
  githubRule,
  hasSupplements,
  documents,
  documentSectionRef,
  fileInputRef,
  onDocumentAdd,
  onDocumentRemove,
  onDocumentTypeChange,
  onDocumentAttachClick,
  onDocumentFileChange,
  gitInput,
  gitInputRef,
  gitUrls,
  onGitAdd,
  onGitInputChange,
  onGitInputKeyDown,
  onGitRemove,
  supplements,
  onSupplementAdd,
  onSupplementRemove,
  onSupplementChange,
  errors,
  saveStatus,
  isAnalyzing,
  isEdited,
  isSaving,
  isSaveDisabled,
  onSave,
  onCancelEdit,
  onReanalyze,
}: PortfolioProps) => {
  const jobRole = getJobRole(job);
  const isGitAddDisabled = !gitInput.trim();
  // 직무 칸이 01. 이후 영역은 보이는 것만 차례로 번호를 붙인다.
  let sectionNumber = 1;

  return (
    <S.PortfolioWrapper aria-labelledby="portfolio-title">
      <S.Header>
        <S.Title id="portfolio-title">나의 면접 자료</S.Title>
        <S.Description>
          직무에 맞는 자료를 바탕으로 나에게 맞는 면접 질문을 준비해요.
        </S.Description>
      </S.Header>

      {jobSelection}
      {errors.job && <S.FieldError role="alert">{errors.job}</S.FieldError>}

      {!jobRole ? (
        <S.Notice>직무를 먼저 선택해 주세요</S.Notice>
      ) : (
        <>
          <S.Section ref={documentSectionRef} aria-labelledby="portfolio-document-title">
            <S.SectionHeading>
              <S.SectionNumber aria-hidden="true">{formatSectionNumber(++sectionNumber)}</S.SectionNumber>
              <S.SectionTitle id="portfolio-document-title">문서</S.SectionTitle>
              <S.RequiredBadge>필수</S.RequiredBadge>
            </S.SectionHeading>
            <S.Guide>
              {getUploadGuides(jobRole.code).map((guide) => <p key={guide}>{guide}</p>)}
              <S.RequiredLine>
                필수 종류
                {jobRole.requiredDocuments.map((type) => (
                  <S.RequiredBadge key={type}>{getDocumentTypeLabel(type)}</S.RequiredBadge>
                ))}
              </S.RequiredLine>
              <p>필수 종류 중 1개 이상, 최대 5개, 합계 50쪽, PDF만</p>
            </S.Guide>
            <DocumentList
              jobRole={jobRole}
              documents={documents}
              rowErrors={errors.documentRows}
              onAdd={onDocumentAdd}
              onRemove={onDocumentRemove}
              onTypeChange={onDocumentTypeChange}
              onAttachClick={onDocumentAttachClick}
            />
            <S.HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              aria-label="문서 PDF 파일"
              onChange={onDocumentFileChange}
            />
            {errors.documents && <S.FieldError role="alert">{errors.documents}</S.FieldError>}
          </S.Section>

          {githubRule !== "HIDDEN" && (
            <S.Section aria-labelledby="github-section-title">
              <S.SectionHeading>
                <S.SectionNumber aria-hidden="true">{formatSectionNumber(++sectionNumber)}</S.SectionNumber>
                <S.SectionTitle id="github-section-title">
                  <S.Label htmlFor="my-page-git">GitHub</S.Label>
                </S.SectionTitle>
                <S.RequiredBadge>{githubRule === "REQUIRED" ? "필수" : "선택"}</S.RequiredBadge>
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
                  placeholder="GitHub 주소 입력 (예: github.com/아이디/저장소)"
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
                    <S.GitUrlItem key={gitUrl}>
                      <S.GitUrlRow>
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
                      {errors.githubRows[gitUrl] && (
                        <S.FieldError role="alert">{errors.githubRows[gitUrl]}</S.FieldError>
                      )}
                    </S.GitUrlItem>
                  ))}
                </S.GitUrlList>
              )}
              {errors.github && <S.FieldError role="alert">{errors.github}</S.FieldError>}
            </S.Section>
          )}

          {hasSupplements && (
            <S.Section aria-labelledby="supplement-section-title">
              <S.SectionHeading>
                <S.SectionNumber aria-hidden="true">{formatSectionNumber(++sectionNumber)}</S.SectionNumber>
                <S.SectionTitle id="supplement-section-title">보완 입력</S.SectionTitle>
                <S.RequiredBadge>선택</S.RequiredBadge>
              </S.SectionHeading>
              <S.Description>
                문서에 담긴 프로젝트에서 본인이 한 일을 설명해 주세요. 필수 문서를 대신하지는 않아요.
              </S.Description>
              <SupplementForm
                supplements={supplements}
                documents={documents}
                rowErrors={errors.supplementRows}
                onAdd={onSupplementAdd}
                onRemove={onSupplementRemove}
                onChange={onSupplementChange}
              />
              {errors.supplements && <S.FieldError role="alert">{errors.supplements}</S.FieldError>}
            </S.Section>
          )}
        </>
      )}

      {children && <S.AnalysisStatus>{children}</S.AnalysisStatus>}

      {saveStatus && (
        <S.SaveStatus role={saveStatus.tone === "error" ? "alert" : "status"} $tone={saveStatus.tone}>
          <span>{saveStatus.text}</span>
          {saveStatus.canReanalyze && (
            <S.InlineButton type="button" onClick={onReanalyze}>다시 분석</S.InlineButton>
          )}
        </S.SaveStatus>
      )}

      <S.Footer>
        <S.FooterHint>자료를 저장하면 AI가 분석을 시작해요.</S.FooterHint>
        <S.ButtonWrapper>
          <S.BackButton type="button" disabled={!isEdited || isSaving} onClick={onCancelEdit}>취소</S.BackButton>
          <S.SaveButton type="button" disabled={isSaveDisabled} onClick={onSave}>
            {isSaving ? "저장 중..." : isAnalyzing ? "분석 중…" : "저장하고 분석하기"}
          </S.SaveButton>
        </S.ButtonWrapper>
      </S.Footer>
    </S.PortfolioWrapper>
  );
};

export default Portfolio;
