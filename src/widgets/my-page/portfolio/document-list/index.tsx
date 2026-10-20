import type { DocumentRow } from "@/features/my-page/materials/model/useMaterialsForm";
import { MAX_DOCUMENTS } from "@/features/my-page/materials/model/materialRules";
import { getDocumentTypeLabel } from "@/shared/constants/job/documentTypes";
import type { JobRole } from "@/shared/constants/job/jobRoles";

import { CloseIcon } from "../icons";
import * as S from "./style";

const COMMON_DOCUMENT_TYPES = ["RESUME", "CAREER_DESCRIPTION"];

interface DocumentListProps {
  jobRole?: JobRole;
  documents: DocumentRow[];
  rowErrors: Record<string, string>;
  onAdd: () => void;
  onRemove: (rowId: string) => void;
  onTypeChange: (rowId: string, type: string) => void;
  onAttachClick: (rowId: string) => void;
}

const getFileName = (row: DocumentRow) =>
  row.fileName ?? `이전에 올린 ${getDocumentTypeLabel(row.type)}`;

const getFileMeta = (row: DocumentRow) => {
  if (row.file) return `${(row.file.size / (1024 * 1024)).toFixed(1)}MB`;
  return row.pageCount !== null ? `${row.pageCount}쪽` : "";
};

const DocumentList = ({
  jobRole,
  documents,
  rowErrors,
  onAdd,
  onRemove,
  onTypeChange,
  onAttachClick,
}: DocumentListProps) => {
  const requiredTypes: readonly string[] = jobRole?.requiredDocuments ?? ["PORTFOLIO"];
  const optionalTypes = [...(jobRole?.optionalDocuments ?? []), ...COMMON_DOCUMENT_TYPES]
    .filter((type, index, types) => !requiredTypes.includes(type) && types.indexOf(type) === index);

  return (
    <>
      <S.DocumentList aria-label="등록할 문서">
        {documents.map((row, index) => {
          const error = rowErrors[row.id];
          const hasFile = Boolean(row.file || row.fileUrl);
          const canRemove = documents.length > 1 || hasFile || Boolean(row.type);

          return (
            <S.DocumentRow key={row.id} $hasError={!!error}>
              <S.SelectWrapper>
                <S.Select
                  aria-label={`${index + 1}번 문서 종류`}
                  title={!jobRole ? "직무를 먼저 선택해주세요." : undefined}
                  value={row.type}
                  disabled={!jobRole}
                  $isPlaceholder={!row.type}
                  onChange={(event) => onTypeChange(row.id, event.target.value)}
                >
                  <option value="" disabled>선택</option>
                  {requiredTypes.length > 0 && <optgroup label="필수 (1개 이상)">
                    {requiredTypes.map((type) => <option key={type} value={type}>{getDocumentTypeLabel(type)}</option>)}
                  </optgroup>}
                  {jobRole?.category === "GENERAL" ? optionalTypes.map((type) => <option key={type} value={type}>{getDocumentTypeLabel(type)}</option>) : <optgroup label="선택">
                    {optionalTypes.map((type) => <option key={type} value={type}>{getDocumentTypeLabel(type)}</option>)}
                  </optgroup>}
                </S.Select>
                <S.Chevron aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </S.Chevron>
              </S.SelectWrapper>
              <S.FileCell>
                <S.AttachButton
                  type="button"
                  aria-label={`${index + 1}번 문서 ${hasFile ? "파일 변경" : "PDF 첨부"}`}
                  title={hasFile ? getFileName(row) : "직무와 자료 종류를 선택한 뒤 PDF를 첨부해주세요."}
                  disabled={!jobRole || !row.type}
                  onClick={() => onAttachClick(row.id)}
                >
                  <S.FileName $hasFile={hasFile}>{hasFile ? getFileName(row) : "파일을 선택해주세요."}</S.FileName>
                  {hasFile && getFileMeta(row) && <S.FileMeta>· {getFileMeta(row)}</S.FileMeta>}
                  {!hasFile && <S.Plus aria-hidden="true">+</S.Plus>}
                </S.AttachButton>
                {canRemove && (
                  <S.RemoveButton type="button" aria-label={`${index + 1}번 문서 삭제`} onClick={() => onRemove(row.id)}>
                    <CloseIcon />
                  </S.RemoveButton>
                )}
              </S.FileCell>
              {error && <S.RowError role="alert">{error}</S.RowError>}
            </S.DocumentRow>
          );
        })}
      </S.DocumentList>
      <S.AddRow>
        <S.AddButton type="button" disabled={!jobRole || documents.length >= MAX_DOCUMENTS} onClick={onAdd}>
          자료 추가 <span aria-hidden="true">+</span>
        </S.AddButton>
      </S.AddRow>
    </>
  );
};

export default DocumentList;
