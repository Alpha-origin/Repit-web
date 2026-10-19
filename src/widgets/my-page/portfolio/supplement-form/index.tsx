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

import { TrashIcon } from "../icons";
import * as S from "./style";

const SUPPLEMENT_FIELDS: { key: Exclude<SupplementField, "title">; label: string; placeholder: string }[] = [
  { key: "goal", label: "프로젝트 목표", placeholder: "ex) 예약 이탈률을 줄이기 위해 예약 단계를 줄이는 것이 목표였어요." },
  { key: "role", label: "본인 역할", placeholder: "ex) 요구사항 정의와 정책 설계를 맡았어요." },
  { key: "decision", label: "핵심 결정", placeholder: "ex) 결제 단계를 분리한 이유와 버린 대안" },
  { key: "outcome", label: "성과 지표", placeholder: "ex) 어떤 지표로 성과를 확인했는지" },
];

interface SupplementFormProps {
  disabled: boolean;
  supplements: SupplementRow[];
  documents: DocumentRow[];
  rowErrors: Record<string, string>;
  onAdd: () => void;
  onRemove: (rowId: string) => void;
  onChange: (rowId: string, field: SupplementField | "documentId", value: string) => void;
}

const SupplementForm = ({
  disabled,
  supplements,
  documents,
  rowErrors,
  onAdd,
  onRemove,
  onChange,
}: SupplementFormProps) => {
  const linkableDocuments = documents.filter((row) => row.file || row.fileUrl);
  const hasContent = supplements.some((row) =>
    row.title || row.documentId || SUPPLEMENT_FIELDS.some((field) => row[field.key]),
  );

  return (
    <S.FormFields disabled={disabled} title={disabled ? "직무를 먼저 선택해주세요." : undefined}>
      {supplements.map((row, index) => (
        <S.Project key={row.id} aria-label={`프로젝트 ${index + 1}`}>
          {supplements.length > 1 && (
            <S.ProjectHead>
              <b>프로젝트 {index + 1}</b>
              <S.RemoveButton type="button" aria-label={`프로젝트 ${index + 1} 삭제`} onClick={() => onRemove(row.id)}>
                <TrashIcon />
              </S.RemoveButton>
            </S.ProjectHead>
          )}
          <S.Grid>
            {(row.title || row.documentId) && (
              <>
                <S.Field>
                  <S.FieldTop>
                    <label htmlFor={`${row.id}-title`}>프로젝트 제목</label>
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
              </>
            )}
            {SUPPLEMENT_FIELDS.map((field) => (
              <S.Field key={field.key}>
                <S.FieldTop>
                  <label htmlFor={`${row.id}-${field.key}`}>{field.label}</label>
                </S.FieldTop>
                <S.TextArea
                  id={`${row.id}-${field.key}`}
                  rows={1}
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
      {(hasContent || supplements.length > 1) && (
        <S.AddRow>
          <S.AddButton type="button" disabled={supplements.length >= MAX_SUPPLEMENTS} onClick={onAdd}>
            + 프로젝트 추가
          </S.AddButton>
          <S.Count>{supplements.length}/{MAX_SUPPLEMENTS}</S.Count>
        </S.AddRow>
      )}
    </S.FormFields>
  );
};

export default SupplementForm;
