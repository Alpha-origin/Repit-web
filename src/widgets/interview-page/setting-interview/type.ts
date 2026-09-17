import type { InterviewSettingStyleIcon } from '@/shared/constants/interview-page/setting-interview';

export interface SelectedProps {
  $selected: boolean;
}

export interface ActionButtonProps {
  $analyzing?: boolean;
  $disabled?: boolean;
}

export interface StyleIconProps {
  $variant: InterviewSettingStyleIcon;
}
