import { INTERVIEW_ANSWER_MODE_OPTIONS } from '@/shared/constants/interview-page/setting-interview';
import * as S from '../style';

interface AnswerModeOptionsProps {
  answerMode: 'voice' | 'text';
  onAnswerModeChange: (mode: 'voice' | 'text') => void;
}

const AnswerModeOptions = ({
  answerMode,
  onAnswerModeChange,
}: AnswerModeOptionsProps) => (
  <S.Section>
    <S.Title>답변 방식</S.Title>
    <S.AnswerModeGroup role="group" aria-label="답변 방식">
      {INTERVIEW_ANSWER_MODE_OPTIONS.map((option) => (
        <S.AnswerModeButton
          key={option.value}
          type="button"
          $selected={answerMode === option.value}
          aria-pressed={answerMode === option.value}
          onClick={() => onAnswerModeChange(option.value)}
        >
          <S.StyleTextGroup>
            <S.OptionLabel>{option.label}</S.OptionLabel>
            <S.OptionDescription>{option.description}</S.OptionDescription>
          </S.StyleTextGroup>
          <S.SelectionCircle
            $selected={answerMode === option.value}
            aria-hidden="true"
          />
        </S.AnswerModeButton>
      ))}
    </S.AnswerModeGroup>
  </S.Section>
);

export default AnswerModeOptions;
