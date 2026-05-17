import {
  INTERVIEW_SETTING_INTERVIEWERS,
  INTERVIEW_SETTING_INTERVIEWER_SECTION_TITLE,
  INTERVIEW_SETTING_OPTION_SECTIONS,
} from '@/shared/constants/interview-page/setting-interview';
import * as S from './style';

const SettingContent = () => {
  return (
    <S.Sections>
      {INTERVIEW_SETTING_OPTION_SECTIONS.map((section) => (
        <S.Section key={section.title}>
          <S.Title>{section.title}</S.Title>

          <S.ButtonGroup>
            {section.options.map((option) => (
              <S.SelectButton key={option} type="button">
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
            <S.InterviewerCard key={item.id}>
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
