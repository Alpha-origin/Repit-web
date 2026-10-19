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
import { CloseIcon } from "./icons";
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
  isSaving: boolean;
  isSaveDisabled: boolean;
  loadError: string;
  onRetryLoad: () => void;
  onSave: () => void;
  onBack: () => void;
  onReanalyze: () => void;
}

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
  isSaving,
  isSaveDisabled,
  loadError,
  onRetryLoad,
  onSave,
  onBack,
  onReanalyze,
}: PortfolioProps) => {
  const jobRole = getJobRole(job);
  const isGitAddDisabled = !gitInput.trim();
  const requiredDocuments = jobRole?.requiredDocuments ?? ["PORTFOLIO"];
  const requiredLabel = requiredDocuments.length === 1
    ? `${getDocumentTypeLabel(requiredDocuments[0])} 필수`
    : `${requiredDocuments.map(getDocumentTypeLabel).join(" / ")} 중 1개 이상 필수`;

  return (
    <S.PortfolioWrapper aria-label="나의 면접 자료" $hasSupplements={hasSupplements}>
      {loadError && (
        <S.SaveStatus role="alert" $tone="error">
          <span>{loadError}</span>
          <S.InlineButton type="button" onClick={onRetryLoad}>다시 불러오기</S.InlineButton>
        </S.SaveStatus>
      )}

      {jobSelection}
      {errors.job && <S.FieldError role="alert">{errors.job}</S.FieldError>}

      <S.Section ref={documentSectionRef} aria-labelledby="portfolio-document-title">
        <S.SectionHeading>
          <S.SectionTitle id="portfolio-document-title">자료</S.SectionTitle>
          <S.RequiredBadge>{requiredLabel}</S.RequiredBadge>
          <S.GuideDetails>
            <S.GuideSummary>내용이 정밀할수록 가이드 정밀도 <strong>UP</strong></S.GuideSummary>
            <S.Guide>
              {getUploadGuides(job).map((guide) => <p key={guide}>{guide}</p>)}
              <p>필수 자료: {requiredDocuments.map(getDocumentTypeLabel).join(" · ")} 중 1개 이상</p>
              {!jobRole && <p>직무를 선택하면 해당 직무의 자료를 첨부할 수 있어요.</p>}
            </S.Guide>
          </S.GuideDetails>
        </S.SectionHeading>
        <DocumentList
          jobRole={jobRole}
          documents={documents}
          rowErrors={errors.documentRows}
          onAdd={onDocumentAdd}
          onRemove={onDocumentRemove}
          onTypeChange={onDocumentTypeChange}
          onAttachClick={onDocumentAttachClick}
        />
        <S.FieldHint>가능한 파일 형식 - PDF, 최대 5개, 합계 50쪽</S.FieldHint>
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
            <S.SectionTitle id="github-section-title">
              <S.Label htmlFor="my-page-git">GitHub</S.Label>
            </S.SectionTitle>
            <S.RequiredBadge>{githubRule === "REQUIRED" ? "필수" : "선택"}</S.RequiredBadge>
          </S.SectionHeading>
          <S.GitInputWrapper>
            <S.Input
              ref={gitInputRef}
              id="my-page-git"
              type="text"
              value={gitInput}
              placeholder="깃허브 주소를 링크 또는 아이디로 입력해주세요."
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
              저장
            </S.GitAddButton>
          </S.GitInputWrapper>

          {gitUrls.length > 0 && (
            <S.GitUrlList aria-label="등록할 GitHub 주소">
              {gitUrls.map((gitUrl) => (
                <S.GitUrlItem key={gitUrl}>
                  <S.GitUrlRow>
                    <S.GitUrlText title={gitUrl}>{gitUrl}</S.GitUrlText>
                    <S.GitRemoveButton
                      type="button"
                      aria-label={`${gitUrl} 삭제`}
                      onClick={() => onGitRemove(gitUrl)}
                    >
                      <CloseIcon />
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
        <S.SupplementSection aria-labelledby="supplement-section-title">
          <S.SectionHeading>
            <S.SectionTitle id="supplement-section-title">보완 입력</S.SectionTitle>
            <S.RequiredBadge>선택</S.RequiredBadge>
          </S.SectionHeading>
          <SupplementForm
            disabled={!jobRole}
            supplements={supplements}
            documents={documents}
            rowErrors={errors.supplementRows}
            onAdd={onSupplementAdd}
            onRemove={onSupplementRemove}
            onChange={onSupplementChange}
          />
          <S.FieldHint>문서에 담기 어려운 내용을 적어 주시면 면접 질문에 반영됩니다.</S.FieldHint>
          {errors.supplements && <S.FieldError role="alert">{errors.supplements}</S.FieldError>}
        </S.SupplementSection>
      )}

      {children && <S.AnalysisStatus>{children}</S.AnalysisStatus>}

      {saveStatus && saveStatus.tone !== "success" && (
        <S.SaveStatus role={saveStatus.tone === "error" ? "alert" : "status"} $tone={saveStatus.tone}>
          <span>{saveStatus.text}</span>
          {saveStatus.canReanalyze && (
            <S.InlineButton type="button" onClick={onReanalyze}>다시 분석</S.InlineButton>
          )}
        </S.SaveStatus>
      )}

      <S.Footer>
        <S.ButtonWrapper>
          <S.BackButton type="button" disabled={isSaving} onClick={onBack}>돌아가기</S.BackButton>
          <S.SaveButton
            type="button"
            disabled={isSaveDisabled}
            aria-describedby={isAnalyzing ? "materials-analysis-hint" : undefined}
            onClick={onSave}
          >
            {isSaving ? "저장 중..." : "저장"}
          </S.SaveButton>
        </S.ButtonWrapper>
        {isAnalyzing && (
          <S.AnalysisHint id="materials-analysis-hint" role="status">
            분석이 끝난 뒤에 자료 변경이 가능합니다.
          </S.AnalysisHint>
        )}
      </S.Footer>
    </S.PortfolioWrapper>
  );
};

export default Portfolio;
