import { PERSONALITY_OPTIONS, TONE_OPTIONS } from '@/shared/constants/interview-page/setting-multi-interview';
// import { SOLO_MAJOR_GUIDANCE } from '@/shared/constants/interview-page/setting-interview';
import * as S from '../style';
import type { PersonaOptionsProps } from './type';

const PersonaOptions = ({ personality, tone, onPersonalityChange, onToneChange }: PersonaOptionsProps) => (
  <>
    <S.Section>
      <S.Title>면접관 성격/분위기</S.Title>
      <S.DifficultyGroup role="group" aria-label="성격">
        {PERSONALITY_OPTIONS.map((option) => (
          <S.DifficultyButton key={option.value} type="button"
            $selected={personality === option.value} aria-pressed={personality === option.value}
            onClick={() => onPersonalityChange(option.value)}>
            <S.OptionLabel>{option.label}</S.OptionLabel>
          </S.DifficultyButton>
        ))}
      </S.DifficultyGroup>
      <S.DifficultyGroup role="group" aria-label="분위기">
        {TONE_OPTIONS.map((option) => (
          <S.DifficultyButton key={option.value} type="button"
            $selected={tone === option.value} aria-pressed={tone === option.value}
            onClick={() => onToneChange(option.value)}>
            <S.OptionLabel>{option.label}</S.OptionLabel>
          </S.DifficultyButton>
        ))}
      </S.DifficultyGroup>
    </S.Section>
    {/* <S.Section>
      <S.Title>전문 분야</S.Title>
      <S.OptionDescription>{SOLO_MAJOR_GUIDANCE}</S.OptionDescription>
    </S.Section> */}
  </>
);

export default PersonaOptions;
