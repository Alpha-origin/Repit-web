import { SETTING_INTERVIEWER_CARDS } from '../data';
import {
  IdentityButton,
  IdentityImage,
  IdentityRow,
} from '@/widgets/interview-page/setting-multi-interview/style';
import * as S from '../style';
import type {
  InterviewerCardProps,
  InterviewerOptionsProps,
} from './type';

const InterviewerOptions = ({
  onSelect,
  selectedValue,
}: InterviewerOptionsProps) => (
  <S.Section>
    <S.Title>면접관 선택</S.Title>
    <IdentityRow role="radiogroup" aria-label="면접관 선택">
      {SETTING_INTERVIEWER_CARDS.map((interviewer) => (
        <InterviewerCard
          key={interviewer.key}
          interviewer={interviewer}
          isSelected={selectedValue === interviewer.key}
          onSelect={onSelect}
        />
      ))}
    </IdentityRow>
  </S.Section>
);

const InterviewerCard = ({
  interviewer,
  isSelected,
  onSelect,
}: InterviewerCardProps) => (
  <IdentityButton
    $selected={isSelected}
    aria-checked={isSelected}
    onClick={() => onSelect(interviewer.key)}
    role="radio"
    type="button"
  >
    <IdentityImage src={interviewer.image} alt="" />
    {interviewer.name}
  </IdentityButton>
);

export default InterviewerOptions;
