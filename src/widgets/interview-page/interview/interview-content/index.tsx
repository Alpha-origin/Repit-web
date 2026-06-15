import InterviewVisualizerIcon from "@/shared/img/interview-page/Repit-Interview.svg?url";
import type { InterviewContentViewProps } from "../type";
import * as S from "../style";

const InterviewContentView = ({
  answerStatus,
  answerText,
  mode,
  onAnswerTextChange,
  onClearAnswer,
  onModeChange,
  onReset,
  question,
}: InterviewContentViewProps) => {
  const isVoiceMode = mode === "voice";
  const isTextMode = mode === "text";

  return (
    <S.InterviewBody $textMode={isTextMode} $voiceMode={isVoiceMode}>
      <S.QuestionCard $voiceMode={isVoiceMode}>
        <S.QuestionMeta>
          <S.QuestionLabel>{question.id}</S.QuestionLabel>
          <S.Timer>00:00</S.Timer>
        </S.QuestionMeta>

        <S.QuestionBody>
          <S.QuestionText>{question.text}</S.QuestionText>
        </S.QuestionBody>

        <S.QuestionFooter>
          <S.FooterSpacer />
          <S.AnswerStatus>{answerStatus}</S.AnswerStatus>

          <S.ModeControl>
            <S.ModeButton
              type="button"
              $active={mode === "text"}
              aria-pressed={mode === "text"}
              onClick={() => onModeChange("text")}
            >
              텍스트
            </S.ModeButton>
            <S.ModeButton
              type="button"
              $active={mode === "voice"}
              aria-pressed={mode === "voice"}
              onClick={() => onModeChange("voice")}
            >
              음성
            </S.ModeButton>
          </S.ModeControl>
        </S.QuestionFooter>
      </S.QuestionCard>

      {mode === "text" ? (
        <>
          <S.TextAnswerCard>
            <S.TextAnswerField
              value={answerText}
              placeholder="답변을 텍스트로 입력해주세요."
              onChange={onAnswerTextChange}
            />
          </S.TextAnswerCard>

          <S.TextActionRow>
            <S.SecondaryAction type="button" onClick={onClearAnswer}>
              모두삭제
            </S.SecondaryAction>

            <S.PrimaryAction type="button">완료</S.PrimaryAction>
          </S.TextActionRow>
        </>
      ) : (
        <S.ActionRow>
          <S.SecondaryAction type="button" onClick={onReset}>
            다시하기
          </S.SecondaryAction>

          <S.VisualizerButton
            type="button"
            aria-label="음성 인터뷰 상태"
            onClick={() => onModeChange("voice")}
          >
            <S.VisualizerIcon src={InterviewVisualizerIcon} alt="" aria-hidden="true" />
          </S.VisualizerButton>

          <S.PrimaryAction type="button">완료</S.PrimaryAction>
        </S.ActionRow>
      )}
    </S.InterviewBody>
  );
};

export default InterviewContentView;
