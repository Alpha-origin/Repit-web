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

const SettingOptions = ({ onSelect, selection }: SettingOptionsProps) => (
  <S.ControlColumn>
    <StyleOptions
      onSelect={onSelect.style}
      selectedValue={selection.style}
    />
    <DifficultyOptions
      onSelect={onSelect.difficulty}
      selectedValue={selection.difficulty}
    />
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
