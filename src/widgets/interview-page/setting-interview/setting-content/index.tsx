import {
  INTERVIEW_SETTING_INTERVIEWERS,
  INTERVIEW_SETTING_INTERVIEWER_SECTION_TITLE,
  INTERVIEW_SETTING_OPTION_SECTIONS,
} from '@/shared/constants/interview-page/setting-interview';
import * as S from '../style';

type InterviewStyleOption =
  (typeof INTERVIEW_SETTING_OPTION_SECTIONS)[0]['options'][number];
type InterviewDifficultyOption =
  (typeof INTERVIEW_SETTING_OPTION_SECTIONS)[1]['options'][number];
type InterviewerId =
  (typeof INTERVIEW_SETTING_INTERVIEWERS)[number]['id'];

interface SettingContentProps {
  onDifficultySelect: (value: InterviewDifficultyOption) => void;
  onInterviewerSelect: (value: InterviewerId) => void;
  onStyleSelect: (value: InterviewStyleOption) => void;
  selectedDifficulty: InterviewDifficultyOption | null;
  selectedInterviewerId: InterviewerId | null;
  selectedStyle: InterviewStyleOption | null;
}

const SettingContent = ({
  onDifficultySelect,
  onInterviewerSelect,
  onStyleSelect,
  selectedDifficulty,
  selectedInterviewerId,
  selectedStyle,
}: SettingContentProps) => {
  return (
    <S.Sections>
      {INTERVIEW_SETTING_OPTION_SECTIONS.map((section) => (
        <S.Section key={section.title}>
          <S.Title>{section.title}</S.Title>

          <S.ButtonGroup>
            {section.options.map((option) => (
              <S.SelectButton
                key={option}
                $selected={
                  section.key === 'style'
                    ? selectedStyle === option
                    : selectedDifficulty === option
                }
                aria-pressed={
                  section.key === 'style'
                    ? selectedStyle === option
                    : selectedDifficulty === option
                }
                onClick={() =>
                  section.key === 'style'
                    ? onStyleSelect(option as InterviewStyleOption)
                    : onDifficultySelect(option as InterviewDifficultyOption)
                }
                type="button"
              >
                {option}
              </S.SelectButton>
            ))}
          </S.ButtonGroup>
        </S.Section>
      ))}

      <S.Section>
        <S.Title>{INTERVIEW_SETTING_INTERVIEWER_SECTION_TITLE}</S.Title>

        <S.InterviewerGrid>
          {INTERVIEW_SETTING_INTERVIEWERS.map((item) => (
            <S.InterviewerCard
              key={item.id}
              $selected={selectedInterviewerId === item.id}
              aria-pressed={selectedInterviewerId === item.id}
              onClick={() => onInterviewerSelect(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onInterviewerSelect(item.id);
                }
              }}
            >
              <S.InterviewerTitle>{item.name}</S.InterviewerTitle>

              {item.tags.map((tag) => (
                <S.CardText key={tag}>{tag}</S.CardText>
              ))}
            </S.InterviewerCard>
          ))}
        </S.InterviewerGrid>
      </S.Section>
    </S.Sections>
  );
};

export default SettingContent;
