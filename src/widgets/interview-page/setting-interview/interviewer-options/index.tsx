import { SETTING_INTERVIEWER_CARDS } from '../data';
import * as S from '../style';
import type {
  InterviewerCardProps,
  InterviewerOptionsProps,
} from './type';

const InterviewerOptions = ({
  onSelect,
  selectedValue,
}: InterviewerOptionsProps) => (
  <S.InterviewerGrid role="radiogroup" aria-label="면접관 선택">
    {SETTING_INTERVIEWER_CARDS.map((interviewer) => (
      <InterviewerCard
        key={interviewer.id}
        interviewer={interviewer}
        isSelected={selectedValue === interviewer.id}
        onSelect={onSelect}
      />
    ))}
  </S.InterviewerGrid>
);

const InterviewerCard = ({
  interviewer,
  isSelected,
  onSelect,
}: InterviewerCardProps) => (
  <S.InterviewerCard
    $selected={isSelected}
    aria-checked={isSelected}
    onClick={() => onSelect(interviewer.id)}
    role="radio"
    type="button"
  >
    <S.InterviewerImage src={interviewer.image} alt="" />
    <S.InterviewerBody $selected={isSelected}>
      {isSelected ? <S.InterviewerSelectedBadge aria-hidden="true" /> : null}
      <S.InterviewerTitle>{interviewer.name}</S.InterviewerTitle>
      <S.TagList>
        {interviewer.tags.map((tag) => (
          <S.Tag key={tag}>{tag}</S.Tag>
        ))}
      </S.TagList>
      <S.InterviewerDescription>
        {interviewer.description}
      </S.InterviewerDescription>
    </S.InterviewerBody>
  </S.InterviewerCard>
);

export default InterviewerOptions;
