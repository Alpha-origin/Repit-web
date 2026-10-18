import type {
  DocumentRow,
  SupplementField,
  SupplementRow,
} from "@/features/my-page/materials/model/useMaterialsForm";
import {
  MAX_SUPPLEMENTS,
  MAX_SUPPLEMENT_ITEM,
  MAX_SUPPLEMENT_TITLE,
} from "@/features/my-page/materials/model/materialRules";
import { getDocumentTypeLabel } from "@/shared/constants/job/documentTypes";

import * as S from "./style";

// 상세 기획 §5 안내 문구.
const SUPPLEMENT_FIELDS: { key: Exclude<SupplementField, "title">; label: string; placeholder: string }[] = [
  { key: "goal", label: "프로젝트 목표", placeholder: "어떤 문제를 해결하려 했나요?" },
  { key: "role", label: "본인 역할", placeholder: "팀 전체 업무 중 직접 맡은 일은 무엇인가요?" },
  { key: "decision", label: "핵심 결정", placeholder: "무엇을 선택했고, 어떤 대안을 검토했나요?" },
  { key: "outcome", label: "성과와 확인 방법", placeholder: "무엇이 달라졌고 어떻게 확인했나요? 수치가 없어도 설명할 수 있어요" },
];

interface SupplementFormProps {
  supplements: SupplementRow[];
  documents: DocumentRow[];
  rowErrors: Record<string, string>;
  onAdd: () => void;
  onRemove: (rowId: string) => void;
  onChange: (rowId: string, field: SupplementField | "documentId", value: string) => void;
}

const TrashIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6" />
  </svg>
);

const SupplementForm = ({
  supplements,
  documents,
  rowErrors,
  onAdd,
  onRemove,
  onChange,
}: SupplementFormProps) => {
  const linkableDocuments = documents.filter((row) => row.file || row.fileUrl);

  return (
    <>
      {supplements.map((row, index) => (
        <S.Project key={row.id} aria-label={`프로젝트 ${index + 1}`}>
          <S.ProjectHead>
            <b>프로젝트 {index + 1}</b>
            <S.RemoveButton type="button" aria-label={`프로젝트 ${index + 1} 삭제`} onClick={() => onRemove(row.id)}>
              <TrashIcon />
            </S.RemoveButton>
          </S.ProjectHead>
          <S.Grid>
            <S.Field>
              <S.FieldTop>
                <label htmlFor={`${row.id}-title`}>프로젝트 제목</label>
                <S.CharCount>{row.title.length}/{MAX_SUPPLEMENT_TITLE}</S.CharCount>
              </S.FieldTop>
              <S.TextInput
                id={`${row.id}-title`}
                value={row.title}
                maxLength={MAX_SUPPLEMENT_TITLE}
                onChange={(event) => onChange(row.id, "title", event.target.value)}
              />
            </S.Field>
            <S.Field>
              <S.FieldTop>
                <label htmlFor={`${row.id}-document`}>관련 문서</label>
              </S.FieldTop>
              <S.DocumentSelect
                id={`${row.id}-document`}
                value={row.documentId}
                onChange={(event) => onChange(row.id, "documentId", event.target.value)}
              >
                <option value="">없음</option>
                {linkableDocuments.map((document, documentIndex) => (
                  <option key={document.id} value={document.id}>
                    {documentIndex + 1}. {getDocumentTypeLabel(document.type)}
                    {document.fileName ? ` · ${document.fileName}` : ""}
                  </option>
                ))}
              </S.DocumentSelect>
            </S.Field>
            {SUPPLEMENT_FIELDS.map((field) => (
              <S.Field key={field.key} $isFull>
                <S.FieldTop>
                  <label htmlFor={`${row.id}-${field.key}`}>{field.label}</label>
                  <S.CharCount>{row[field.key].length}/{MAX_SUPPLEMENT_ITEM}</S.CharCount>
                </S.FieldTop>
                <S.TextArea
                  id={`${row.id}-${field.key}`}
                  value={row[field.key]}
                  maxLength={MAX_SUPPLEMENT_ITEM}
                  placeholder={field.placeholder}
                  onChange={(event) => onChange(row.id, field.key, event.target.value)}
                />
              </S.Field>
            ))}
          </S.Grid>
          {rowErrors[row.id] && <S.RowError role="alert">{rowErrors[row.id]}</S.RowError>}
        </S.Project>
      ))}
      <S.AddRow>
        <S.AddButton type="button" disabled={supplements.length >= MAX_SUPPLEMENTS} onClick={onAdd}>
          + 프로젝트 추가
        </S.AddButton>
        <S.Count>{supplements.length}/{MAX_SUPPLEMENTS}</S.Count>
      </S.AddRow>
    </>
  );
};

export default SupplementForm;
