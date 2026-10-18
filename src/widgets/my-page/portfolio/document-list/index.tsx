import type { DocumentRow } from "@/features/my-page/materials/model/useMaterialsForm";
import { MAX_DOCUMENTS } from "@/features/my-page/materials/model/materialRules";
import { getDocumentTypeLabel } from "@/shared/constants/job/documentTypes";
import type { JobRole } from "@/shared/constants/job/jobRoles";

import * as S from "./style";

const COMMON_DOCUMENT_TYPES = ["RESUME", "CAREER_DESCRIPTION"];

interface DocumentListProps {
  jobRole: JobRole;
  documents: DocumentRow[];
  rowErrors: Record<string, string>;
  onAdd: () => void;
  onRemove: (rowId: string) => void;
  onTypeChange: (rowId: string, type: string) => void;
  onAttachClick: (rowId: string) => void;
}

const TrashIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6" />
  </svg>
);

const formatFileSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

// 옛 업로드로 저장한 문서는 파일명이 없다(06 §0.1).
const getFileName = (row: DocumentRow) =>
  row.fileName ?? `이전에 올린 ${getDocumentTypeLabel(row.type)}`;

const getFileMeta = (row: DocumentRow) => {
  if (row.file) return formatFileSize(row.file.size);
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
  const requiredTypes: readonly string[] = jobRole.requiredDocuments;
  const optionalTypes = [...jobRole.optionalDocuments, ...COMMON_DOCUMENT_TYPES]
    .filter((type, index, types) => !requiredTypes.includes(type) && types.indexOf(type) === index);

  return (
    <>
      <S.DocumentList aria-label="등록할 문서">
        {documents.map((row, index) => {
          const error = rowErrors[row.id];
          const hasFile = Boolean(row.file || row.fileUrl);

          return (
            <S.DocumentRow key={row.id} $hasError={!!error}>
              <S.TypeCell>
                <S.SelectWrapper>
                  <S.Select
                    aria-label={`${index + 1}번 문서 종류`}
                    value={row.type}
                    $isPlaceholder={!row.type}
                    onChange={(event) => onTypeChange(row.id, event.target.value)}
                  >
                    <option value="" disabled>문서 종류 선택</option>
                    <optgroup label="필수 (1개 이상)">
                      {requiredTypes.map((type) => (
                        <option key={type} value={type}>{getDocumentTypeLabel(type)}</option>
                      ))}
                    </optgroup>
                    <optgroup label="선택">
                      {optionalTypes.map((type) => (
                        <option key={type} value={type}>{getDocumentTypeLabel(type)}</option>
                      ))}
                    </optgroup>
                  </S.Select>
                  <S.Chevron aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </S.Chevron>
                </S.SelectWrapper>
                {requiredTypes.includes(row.type) && <S.Badge>필수</S.Badge>}
              </S.TypeCell>
              <S.AttachCell>
                <S.AttachButton
                  type="button"
                  disabled={!row.type}
                  onClick={() => onAttachClick(row.id)}
                >
                  {hasFile ? "파일 변경" : "PDF 첨부"}
                </S.AttachButton>
              </S.AttachCell>
              <S.InfoCell>
                {hasFile ? (
                  <>
                    <S.FileName title={getFileName(row)}>{getFileName(row)}</S.FileName>
                    {getFileMeta(row) && <S.FileMeta>{getFileMeta(row)}</S.FileMeta>}
                  </>
                ) : (
                  <S.EmptyText>{row.type ? "PDF를 첨부해 주세요" : "종류를 먼저 골라 주세요"}</S.EmptyText>
                )}
              </S.InfoCell>
              <S.RemoveCell>
                <S.RemoveButton type="button" aria-label={`${index + 1}번 문서 삭제`} onClick={() => onRemove(row.id)}>
                  <TrashIcon />
                </S.RemoveButton>
              </S.RemoveCell>
              {error && <S.RowError role="alert">{error}</S.RowError>}
            </S.DocumentRow>
          );
        })}
      </S.DocumentList>
      <S.AddRow>
        <S.AddButton type="button" disabled={documents.length >= MAX_DOCUMENTS} onClick={onAdd}>
          + 문서 추가
        </S.AddButton>
        <S.Count>{documents.length}/{MAX_DOCUMENTS}</S.Count>
      </S.AddRow>
    </>
  );
};

export default DocumentList;
