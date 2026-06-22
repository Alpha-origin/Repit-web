import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import InterviewVisualizerIcon from "@/shared/img/interview-page/Repit-Interview.svg?url";
import type { InterviewContentViewProps } from "../type";
import * as S from "../style";

const InterviewContentView = ({
  answerStatus,
  answerText,
  isVoiceStarted,
  mode,
  questionAudioStatus,
  onAnswerTextChange,
  onClearAnswer,
  onCompleteVoice,
  onModeChange,
  onStartVoice,
  onSubmitText,
  onToggleQuestionAudio,
  question,
  voiceLevel,
}: InterviewContentViewProps) => {
  const isVoiceMode = mode === "voice";
  const isTextMode = mode === "text";
  const questionCardRef = useRef<HTMLElement | null>(null);
  const [voiceQuestionCardHeight, setVoiceQuestionCardHeight] = useState<number | null>(
    null,
  );

  useLayoutEffect(() => {
    if (!isVoiceMode) {
      return;
    }

    const element = questionCardRef.current;

    if (!element) {
      return;
    }

    const updateHeight = () => {
      const nextHeight = Math.round(element.getBoundingClientRect().height);

      if (nextHeight > 0) {
        setVoiceQuestionCardHeight(nextHeight);
      }
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVoiceMode]);

  const questionAudioButtonLabel = questionAudioStatus === "loading"
    ? "질문 생성중"
    : questionAudioStatus === "playing"
      ? "질문 멈추기"
      : "질문 듣기";
  const handleTextAnswerKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    onSubmitText();
  };

  return (
    <S.InterviewBody $textMode={isTextMode} $voiceMode={isVoiceMode}>
      <S.QuestionCard
        ref={questionCardRef}
        $textMode={isTextMode}
        $voiceMode={isVoiceMode}
        style={
          isTextMode && voiceQuestionCardHeight
            ? {
                height: `${voiceQuestionCardHeight}px`,
                minHeight: `${voiceQuestionCardHeight}px`,
              }
            : undefined
        }
      >
        <S.QuestionMeta>
          <S.QuestionLabel>{question.id}</S.QuestionLabel>
          <S.Timer>00:00</S.Timer>
        </S.QuestionMeta>

        <S.QuestionBody>
          <S.QuestionContentStack>
            <S.QuestionText>{question.text}</S.QuestionText>

            {isVoiceMode && isVoiceStarted ? (
              <S.InlineVisualizerWrap aria-hidden="true" $voiceLevel={voiceLevel}>
                <S.InlineVisualizerIcon
                  src={InterviewVisualizerIcon}
                  alt=""
                  aria-hidden="true"
                  $voiceLevel={voiceLevel}
                />
              </S.InlineVisualizerWrap>
            ) : null}
          </S.QuestionContentStack>
        </S.QuestionBody>

        <S.QuestionFooter>
          {isVoiceMode && !isVoiceStarted ? (
            <S.QuestionAudioButton
              type="button"
              onClick={onToggleQuestionAudio}
              disabled={questionAudioStatus === "loading"}
            >
              {questionAudioButtonLabel}
            </S.QuestionAudioButton>
          ) : (
            <S.FooterSpacer />
          )}
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
              onKeyDown={handleTextAnswerKeyDown}
            />
          </S.TextAnswerCard>

          <S.TextActionRow>
            <S.SecondaryAction type="button" onClick={onClearAnswer}>
              모두삭제
            </S.SecondaryAction>

            <S.PrimaryAction type="button" onClick={onSubmitText}>
              완료
            </S.PrimaryAction>
          </S.TextActionRow>
        </>
      ) : (
        <S.ActionRow>
          {isVoiceStarted ? (
            <S.PrimaryAction type="button" onClick={onCompleteVoice}>
              완료하기
            </S.PrimaryAction>
          ) : (
            <S.PrimaryAction type="button" onClick={onStartVoice}>
              시작하기
            </S.PrimaryAction>
          )}
        </S.ActionRow>
      )}
    </S.InterviewBody>
  );
};

export default InterviewContentView;
