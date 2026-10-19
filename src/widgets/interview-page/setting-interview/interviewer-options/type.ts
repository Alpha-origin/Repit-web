import type {
  InterviewSettingSelectHandlers,
  InterviewSettingSelection,
} from '@/shared/constants/interview-page/setting-interview';
import type { SettingInterviewerCard } from '../data';

export interface InterviewerOptionsProps {
  onSelect: InterviewSettingSelectHandlers['interviewer'];
  selectedValue: InterviewSettingSelection['interviewerKey'];
}

export interface InterviewerCardProps {
  interviewer: SettingInterviewerCard;
  isSelected: boolean;
  onSelect: InterviewSettingSelectHandlers['interviewer'];
}
