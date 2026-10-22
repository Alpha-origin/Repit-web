import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import type { DocumentRow } from "@/features/my-page/materials/model/useMaterialsForm";
import { MAX_DOCUMENTS } from "@/features/my-page/materials/model/materialRules";
import { getDocumentTypeLabel } from "@/shared/constants/job/documentTypes";
import type { JobRole } from "@/shared/constants/job/jobRoles";

import { CloseIcon } from "../icons";
import * as S from "./style";

const COMMON_DOCUMENT_TYPES = ["RESUME", "SELF_INTRODUCTION", "CAREER_DESCRIPTION"];

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

interface DocumentTypeSelectProps {
  index: number;
  value: string;
  requiredTypes: readonly string[];
  optionalTypes: readonly string[];
  disabled: boolean;
  onChange: (type: string) => void;
}

const DocumentTypeSelect = ({ index, value, requiredTypes, optionalTypes, disabled, onChange }: DocumentTypeSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const selected = menuRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    (selected ?? menuRef.current?.querySelector<HTMLButtonElement>("button"))?.focus();

    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [isOpen]);

  const selectType = (type: string) => {
    onChange(type);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("button[role='option']") ?? []);
    const activeIndex = options.findIndex((option) => option === document.activeElement);
    let nextIndex: number | undefined;
    if (event.key === "ArrowDown") nextIndex = (activeIndex + 1) % options.length;
    else if (event.key === "ArrowUp") nextIndex = (activeIndex - 1 + options.length) % options.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = options.length - 1;
    else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    } else if (event.key === "Tab") {
      setIsOpen(false);
      return;
    } else return;

    event.preventDefault();
    if (nextIndex !== undefined) options[nextIndex]?.focus();
  };

  const renderOptions = (types: readonly string[]) => types.map((type) => (
    <S.TypeOption
      key={type}
      type="button"
      role="option"
      aria-selected={value === type}
      onClick={() => selectType(type)}
    >
      <span>{getDocumentTypeLabel(type)}</span>
      {value === type && <S.SelectedMark aria-hidden="true">✓</S.SelectedMark>}
    </S.TypeOption>
  ));

  return (
    <S.SelectWrapper ref={wrapperRef}>
      <S.TypeTrigger
        ref={triggerRef}
        type="button"
        className="document-type-trigger"
        aria-label={`${index}번 문서 종류`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? `document-types-${index}` : undefined}
        title={disabled ? "직무를 먼저 선택해주세요." : undefined}
        disabled={disabled}
        $isPlaceholder={!value}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !isOpen) {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <span>{value ? getDocumentTypeLabel(value) : "종류 선택"}</span>
        <S.Chevron aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </S.Chevron>
      </S.TypeTrigger>
      {isOpen && (
        <S.TypeMenu ref={menuRef} id={`document-types-${index}`} role="listbox" aria-label={`${index}번 문서 종류 선택`} onKeyDown={handleOptionKeyDown}>
          {requiredTypes.length > 0 && <>
            <S.TypeGroupLabel>필수 자료</S.TypeGroupLabel>
            {renderOptions(requiredTypes)}
          </>}
          {optionalTypes.length > 0 && <>
            {requiredTypes.length > 0 && <S.TypeGroupLabel>선택 자료</S.TypeGroupLabel>}
            {renderOptions(optionalTypes)}
          </>}
        </S.TypeMenu>
      )}
    </S.SelectWrapper>
  );
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
              <DocumentTypeSelect
                index={index + 1}
                value={row.type}
                requiredTypes={requiredTypes}
                optionalTypes={optionalTypes}
                disabled={!jobRole}
                onChange={(type) => onTypeChange(row.id, type)}
              />
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
