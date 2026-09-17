export type InterviewStyleOption = '편함' | '일반' | '압박';

export type InterviewDifficultyOption = '쉬움' | '보통' | '어려움';

export type InterviewerId = 1 | 2 | 3 | 4;

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

export interface InterviewSettingInterviewer {
  description: string;
  id: InterviewerId;
  name: string;
  personaName: string;
  tags: readonly string[];
}

export interface InterviewSettingSelection {
  difficulty: InterviewDifficultyOption;
  interviewerId: InterviewerId;
  style: InterviewStyleOption;
}

export interface InterviewSettingSelectHandlers {
  difficulty: (value: InterviewDifficultyOption) => void;
  interviewer: (value: InterviewerId) => void;
  style: (value: InterviewStyleOption) => void;
}
