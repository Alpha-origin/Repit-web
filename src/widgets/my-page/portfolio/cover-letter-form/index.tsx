import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import type { CoverLetterRow } from "@/features/my-page/materials/model/useMaterialsForm";
import {
  MAX_COVER_LETTERS,
  MAX_COVER_LETTER_QUESTION,
  MAX_COVER_LETTER_ANSWER,
} from "@/features/my-page/materials/model/materialRules";
import { COVER_LETTER_EXAMPLES } from "@/shared/constants/job/coverLetterExamples";

import { TrashIcon } from "../icons";
import * as S from "./style";

interface CoverLetterFormProps {
  coverLetters: CoverLetterRow[];
  rowErrors: Record<string, string>;
  onAdd: () => void;
  onRemove: (rowId: string) => void;
  onChange: (rowId: string, field: "question" | "answer", value: string) => void;
  onExample: (rowId: string, text: string) => void;
}

interface CoverLetterCardProps extends Pick<CoverLetterFormProps, "onRemove" | "onChange" | "onExample"> {
  row: CoverLetterRow;
  index: number;
  error?: string;
}

const CoverLetterCard = ({ row, index, error, onRemove, onChange, onExample }: CoverLetterCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuAreaRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const isMenuVisible = isMenuOpen && !row.question.trim();
  const errorId = `${row.id}-error`;

  useEffect(() => {
    if (!isMenuVisible) return;
    menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuAreaRef.current?.contains(event.target)) setIsMenuOpen(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsMenuOpen(false);
      questionRef.current?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuVisible]);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
    const activeIndex = options.findIndex((option) => option === document.activeElement);
    let nextIndex: number;
    if (event.key === "ArrowDown") nextIndex = (activeIndex + 1) % options.length;
    else if (event.key === "ArrowUp") nextIndex = (activeIndex - 1 + options.length) % options.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = options.length - 1;
    else if (event.key === "Tab") {
      setIsMenuOpen(false);
      return;
    } else return;
    event.preventDefault();
    options[nextIndex]?.focus();
  };

  return (
    <S.Card aria-label={`자소서 문항 ${index + 1}`}>
      <S.CardHead>
        <b>문항 {index + 1}</b>
        <S.RemoveButton type="button" aria-label={`문항 ${index + 1} 삭제`} onClick={() => onRemove(row.id)}><TrashIcon /></S.RemoveButton>
      </S.CardHead>
      <S.Field>
        <S.FieldTop>
          <label htmlFor={`${row.id}-question`}>문항</label>
          <S.Count>{row.question.length}/{MAX_COVER_LETTER_QUESTION}</S.Count>
        </S.FieldTop>
        <S.QuestionArea ref={menuAreaRef}>
          <S.QuestionRow>
            <S.TextInput
              ref={questionRef}
              id={`${row.id}-question`}
              value={row.question}
              maxLength={MAX_COVER_LETTER_QUESTION}
              placeholder="지원하는 회사의 자소서 문항을 옮겨 적어 주세요"
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => {
                onChange(row.id, "question", event.target.value);
                if (event.target.value.trim()) setIsMenuOpen(false);
              }}
            />
            {!row.question.trim() && (
              <S.ExampleButton
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isMenuVisible}
                aria-controls={isMenuVisible ? `${row.id}-examples` : undefined}
                onClick={() => setIsMenuOpen((open) => !open)}
              >예시 문항</S.ExampleButton>
            )}
          </S.QuestionRow>
          {isMenuVisible && (
            <S.ExampleMenu ref={menuRef} id={`${row.id}-examples`} role="listbox" aria-label={`문항 ${index + 1} 예시 문항`} onKeyDown={handleMenuKeyDown}>
              {COVER_LETTER_EXAMPLES.map((example) => (
                <S.ExampleOption
                  key={example.label}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => {
                    onExample(row.id, example.question);
                    setIsMenuOpen(false);
                    answerRef.current?.focus();
                  }}
                ><strong>{example.label}</strong><span>{example.question}</span></S.ExampleOption>
              ))}
            </S.ExampleMenu>
          )}
        </S.QuestionArea>
      </S.Field>
      <S.Field>
        <S.FieldTop>
          <label htmlFor={`${row.id}-answer`}>답</label>
          <S.Count>{row.answer.length}/{MAX_COVER_LETTER_ANSWER.toLocaleString()}</S.Count>
        </S.FieldTop>
        <S.Answer
          ref={answerRef}
          id={`${row.id}-answer`}
          value={row.answer}
          maxLength={MAX_COVER_LETTER_ANSWER}
          placeholder="자소서 답을 붙여 넣거나 작성해 주세요"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(row.id, "answer", event.target.value)}
        />
      </S.Field>
      {error && <S.RowError id={errorId} role="alert">{error}</S.RowError>}
    </S.Card>
  );
};

const CoverLetterForm = ({ coverLetters, rowErrors, onAdd, ...handlers }: CoverLetterFormProps) => (
  <>
    <S.CardList aria-label="자소서 문항">
      {coverLetters.map((row, index) => (
        <CoverLetterCard key={row.id} row={row} index={index} error={rowErrors[row.id]} {...handlers} />
      ))}
    </S.CardList>
    <S.AddRow>
      <S.AddButton type="button" disabled={coverLetters.length >= MAX_COVER_LETTERS} onClick={onAdd}>+ 문항 추가</S.AddButton>
      <S.Count>{coverLetters.length}/{MAX_COVER_LETTERS}</S.Count>
    </S.AddRow>
  </>
);

export default CoverLetterForm;
