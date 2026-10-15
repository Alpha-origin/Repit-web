import { useInterviewSessionContext } from "@/features/interview-page/interview/model/useInterviewSessionContext";
import * as S from "../style";
import { Actions, LeaveAction } from "./style";

const InterviewQuitError = () => {
  const { quitError, isClosing, onRetryQuit, onLeaveAnyway } = useInterviewSessionContext();
  if (!quitError) return null;

  return (
    <div role="alert">
      <S.PreparationMessage>{quitError}</S.PreparationMessage>
      <Actions>
        <S.PrimaryAction type="button" disabled={isClosing} onClick={() => void onRetryQuit()}>
          다시 시도
        </S.PrimaryAction>
        <LeaveAction type="button" disabled={isClosing} onClick={onLeaveAnyway}>
          저장하지 않고 나가기
        </LeaveAction>
      </Actions>
    </div>
  );
};

export default InterviewQuitError;
