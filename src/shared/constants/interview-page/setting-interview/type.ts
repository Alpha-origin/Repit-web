import type {
  InterviewerPersonality,
  InterviewerTemplate,
  InterviewerTone,
} from '@/shared/constants/interview-page/setting-multi-interview';

export type InterviewStyleOption = '편함' | '일반' | '압박';

export type InterviewDifficultyOption = '쉬움' | '보통' | '어려움';

export type InterviewSettingStyleIcon = 'smile' | 'neutral' | 'pressure';

export type InterviewSettingOptionSection =
  | {
      key: 'style';
      title: string;
      options: readonly InterviewStyleOption[];
    }
  | {
      key: 'difficulty';
      title: string;
      options: readonly InterviewDifficultyOption[];
    };

export interface InterviewSettingStyleMeta {
  description: string;
  icon: InterviewSettingStyleIcon;
}

export interface InterviewStylePreset {
  difficulty: InterviewDifficultyOption;
  personality: InterviewerPersonality;
  tone: InterviewerTone;
}

export interface InterviewSettingSelection extends InterviewStylePreset {
  interviewerKey: InterviewerTemplate['key'];
}

export interface InterviewSettingSelectHandlers {
  difficulty: (value: InterviewDifficultyOption) => void;
  interviewer: (key: InterviewerTemplate['key']) => void;
  personality: (value: InterviewerPersonality) => void;
  style: (value: InterviewStyleOption) => void;
  tone: (value: InterviewerTone) => void;
}
