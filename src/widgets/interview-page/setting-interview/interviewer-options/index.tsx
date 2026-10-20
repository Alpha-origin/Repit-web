import { SETTING_INTERVIEWER_CARDS } from '../data';
import {
  InterviewerCard as InterviewerCardButton,
  InterviewerImage,
  InterviewerInfo,
  InterviewerName,
  InterviewerDescription,
  InterviewerList,
} from '@/widgets/interview-page/setting-multi-interview/style';
import { CardArea, InterviewerSection } from './style';
import * as S from '../style';
import type {
  InterviewerCardProps,
  InterviewerOptionsProps,
} from './type';

const InterviewerOptions = ({
  onSelect,
  selectedValue,
}: InterviewerOptionsProps) => (
  <InterviewerSection>
    <S.Title>면접관 선택</S.Title>
    <CardArea>
      <InterviewerList role="radiogroup" aria-label="면접관 선택">
        {SETTING_INTERVIEWER_CARDS.map((interviewer) => (
          <InterviewerCard
            key={interviewer.key}
            interviewer={interviewer}
            isSelected={selectedValue === interviewer.key}
            onSelect={onSelect}
          />
        ))}
      </InterviewerList>
    </CardArea>
  </InterviewerSection>
);

const InterviewerCard = ({
  interviewer,
  isSelected,
  onSelect,
}: InterviewerCardProps) => (
  <InterviewerCardButton
    $selected={isSelected}
    aria-checked={isSelected}
    onClick={() => onSelect(interviewer.key)}
    role="radio"
    type="button"
  >
    <InterviewerImage src={interviewer.image} alt="" />
    <InterviewerInfo>
      <InterviewerName>{interviewer.name}</InterviewerName>
      <InterviewerDescription>{interviewer.description}</InterviewerDescription>
    </InterviewerInfo>
  </InterviewerCardButton>
);

export default InterviewerOptions;
