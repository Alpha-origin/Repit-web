import type { ReactNode } from 'react';
import type {
  InterviewDifficultyOption,
  InterviewSettingSelectHandlers,
  InterviewSettingSelection,
  InterviewStyleOption,
} from '@/shared/constants/interview-page/setting-interview';

export interface SettingOptionsProps {
  answerMode: "voice" | "text";
  onAnswerModeChange: (mode: "voice" | "text") => void;
  children?: ReactNode;
  onSelect: Pick<InterviewSettingSelectHandlers, 'difficulty' | 'style'>;
  selection: Pick<InterviewSettingSelection, 'difficulty'> & { style: InterviewStyleOption | null };
}

export interface StyleOptionsProps {
  onSelect: (value: InterviewStyleOption) => void;
  selectedValue: InterviewStyleOption | null;
}

export interface DifficultyOptionsProps {
  onSelect: (value: InterviewDifficultyOption) => void;
  selectedValue: InterviewDifficultyOption;
}
