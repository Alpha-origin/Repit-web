import { useEffect, useRef } from "react";
import * as S from "./style";

interface ChangeConfirmationProps {
  disabled: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ChangeConfirmation = ({ disabled, onCancel, onConfirm }: ChangeConfirmationProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <S.Dialog ref={dialogRef} aria-labelledby="portfolio-change-title" aria-describedby="portfolio-change-message" onCancel={onCancel}>
      <S.Title id="portfolio-change-title">자료를 변경할까요?</S.Title>
      <S.Message id="portfolio-change-message">
        자료를 바꾸면 준비된 면접 질문이 사라지고 새로 분석해요(1~3분)
      </S.Message>
      <S.Actions>
        <S.Cancel type="button" autoFocus onClick={onCancel}>취소</S.Cancel>
        <S.Confirm type="button" disabled={disabled} onClick={onConfirm}>변경하고 분석하기</S.Confirm>
      </S.Actions>
    </S.Dialog>
  );
};

export default ChangeConfirmation;
