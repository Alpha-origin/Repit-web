import { INTERVIEW_ANSWER_MODE_OPTIONS } from "@/shared/constants/interview-page/setting-interview";

import {
  SETTING_DIFFICULTY_SECTION,
  SETTING_STYLE_SECTION,
} from '../data';
import * as S from '../style';
import type {
  DifficultyOptionsProps,
  SettingOptionsProps,
  StyleOptionsProps,
} from './type';

const SettingOptions = ({ onSelect, selection, answerMode, onAnswerModeChange, children }: SettingOptionsProps) => (
  <S.ControlColumn>
    <S.Section>
      <S.Title>답변 방식</S.Title>
      <S.AnswerModeGroup role="group" aria-label="답변 방식">
        {INTERVIEW_ANSWER_MODE_OPTIONS.map((option) => (
          <S.AnswerModeButton key={option.value} type="button"
            $selected={answerMode === option.value}
            aria-pressed={answerMode === option.value}
            onClick={() => onAnswerModeChange(option.value)}>
            <S.StyleTextGroup>
              <S.OptionLabel>{option.label}</S.OptionLabel>
              <S.OptionDescription>{option.description}</S.OptionDescription>
            </S.StyleTextGroup>
            <S.SelectionCircle $selected={answerMode === option.value} aria-hidden="true" />
          </S.AnswerModeButton>
        ))}
      </S.AnswerModeGroup>
    </S.Section>
    <StyleOptions
      onSelect={onSelect.style}
      selectedValue={selection.style}
    />
    <DifficultyOptions
      onSelect={onSelect.difficulty}
      selectedValue={selection.difficulty}
    />
    {children}
  </S.ControlColumn>
);

const StyleOptions = ({ onSelect, selectedValue }: StyleOptionsProps) => (
  <S.Section>
    <S.Title>{SETTING_STYLE_SECTION.title}</S.Title>

    <S.StyleOptionGroup
      role="radiogroup"
      aria-label={SETTING_STYLE_SECTION.title}
    >
      {SETTING_STYLE_SECTION.options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <S.StyleOptionButton
            key={option.value}
            $selected={isSelected}
            aria-checked={isSelected}
            onClick={() => onSelect(option.value)}
            role="radio"
            type="button"
          >
            <S.StyleIcon $variant={option.icon} aria-hidden="true">
              <span />
            </S.StyleIcon>
            <S.StyleTextGroup>
              <S.OptionLabel>{option.value}</S.OptionLabel>
              <S.OptionDescription>{option.description}</S.OptionDescription>
            </S.StyleTextGroup>
            <S.SelectionCircle $selected={isSelected} aria-hidden="true" />
          </S.StyleOptionButton>
        );
      })}
    </S.StyleOptionGroup>
    {selectedValue === null ? <S.OptionDescription>직접 설정 중이에요</S.OptionDescription> : null}
  </S.Section>
);

const DifficultyOptions = ({
  onSelect,
  selectedValue,
}: DifficultyOptionsProps) => (
  <S.Section>
    <S.Title>{SETTING_DIFFICULTY_SECTION.title}</S.Title>

    <S.DifficultyGroup
      role="radiogroup"
      aria-label={SETTING_DIFFICULTY_SECTION.title}
    >
      {SETTING_DIFFICULTY_SECTION.options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <S.DifficultyButton
            key={option.value}
            $selected={isSelected}
            aria-checked={isSelected}
            onClick={() => onSelect(option.value)}
            role="radio"
            type="button"
                >
                  <S.OptionLabel>{option.value}</S.OptionLabel>
                </S.DifficultyButton>
        );
      })}
    </S.DifficultyGroup>
  </S.Section>
);

export default SettingOptions;
