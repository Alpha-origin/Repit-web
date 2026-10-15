import type {
  InterviewerPersonality,
  InterviewerTone,
} from '@/shared/constants/interview-page/setting-multi-interview';

export interface PersonaOptionsProps {
  personality: InterviewerPersonality;
  tone: InterviewerTone;
  onPersonalityChange: (value: InterviewerPersonality) => void;
  onToneChange: (value: InterviewerTone) => void;
}
