import type {
  InterviewDifficultyOption,
  InterviewSettingSelectHandlers,
  InterviewSettingSelection,
  InterviewStyleOption,
} from '@/shared/constants/interview-page/setting-interview';

export interface SettingOptionsProps {
  answerMode: "voice" | "text";
  onAnswerModeChange: (mode: "voice" | "text") => void;
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
