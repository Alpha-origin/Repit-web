import * as S from './style';
import { useNavigate } from 'react-router-dom';
import {
  INTERVIEW_SETTING_ACTION_LABELS,
  INTERVIEW_SETTING_INTERVIEWERS,
  INTERVIEW_SETTING_INTERVIEWER_SECTION_TITLE,
  INTERVIEW_SETTING_OPTION_SECTIONS,
} from '@/shared/constants/interview-page/setting-interview';

const SettingInterview = () => {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.Card>
        {INTERVIEW_SETTING_OPTION_SECTIONS.map((section) => (
          <S.Section key={section.title}>
            <S.Title>{section.title}</S.Title>

            <S.OptionGrid>
              {section.options.map((option) => (
                <S.OptionButton key={option}>{option}</S.OptionButton>
              ))}
            </S.OptionGrid>
          </S.Section>
        ))}

        <S.Section>
          <S.Title>{INTERVIEW_SETTING_INTERVIEWER_SECTION_TITLE}</S.Title>

          <S.InterviewerList>
            {INTERVIEW_SETTING_INTERVIEWERS.map((interviewer) => (
              <S.InterviewerCard key={interviewer.id}>
                <S.InterviewerName>{interviewer.name}</S.InterviewerName>

                {interviewer.tags.map((tag) => (
                  <S.InterviewerTag key={tag}>{tag}</S.InterviewerTag>
                ))}
              </S.InterviewerCard>
            ))}
          </S.InterviewerList>
        </S.Section>

        <S.ButtonWrapper>
          <S.BackButton onClick={() => navigate(-1)}>
            {INTERVIEW_SETTING_ACTION_LABELS.back}
          </S.BackButton>
          <S.SaveButton onClick={() => navigate('/main/interview')}>
            {INTERVIEW_SETTING_ACTION_LABELS.next}
          </S.SaveButton>
        </S.ButtonWrapper>
      </S.Card>
    </S.Container>
  );
};

export default SettingInterview;
