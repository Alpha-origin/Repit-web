import type {
  InterviewDifficultyOption,
  InterviewSettingSelectHandlers,
  InterviewSettingSelection,
  InterviewStyleOption,
} from '@/shared/constants/interview-page/setting-interview';

export interface SettingOptionsProps {
  onSelect: Pick<InterviewSettingSelectHandlers, 'difficulty' | 'style'>;
  selection: Pick<InterviewSettingSelection, 'difficulty' | 'style'>;
}

export interface StyleOptionsProps {
  onSelect: (value: InterviewStyleOption) => void;
  selectedValue: InterviewStyleOption;
}

export interface DifficultyOptionsProps {
  onSelect: (value: InterviewDifficultyOption) => void;
  selectedValue: InterviewDifficultyOption;
}
