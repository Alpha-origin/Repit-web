import { useEffect, useRef } from "react";

import * as S from "../change-confirmation/style";

interface JobChangeConfirmationProps {
  onCancel: () => void;
  onConfirm: () => void;
}

// 개발 3직무 사이가 아닌 직무 변경은 등록된 자료를 비운다(06 §3.2). 문구는 시안 그대로.
const JobChangeConfirmation = ({ onCancel, onConfirm }: JobChangeConfirmationProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <S.Dialog ref={dialogRef} aria-labelledby="job-change-title" aria-describedby="job-change-message" onCancel={onCancel}>
      <S.Title id="job-change-title">직무를 바꿀까요?</S.Title>
      <S.Message id="job-change-message">
        직무를 바꾸면 지금 등록된 자료가 초기화됩니다. 새 직무에 맞는 자료를 다시 등록해 주세요.
      </S.Message>
      <S.Actions>
        <S.Cancel type="button" autoFocus onClick={onCancel}>취소</S.Cancel>
        <S.Confirm type="button" onClick={onConfirm}>바꾸기</S.Confirm>
      </S.Actions>
    </S.Dialog>
  );
};

export default JobChangeConfirmation;
