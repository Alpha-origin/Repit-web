import * as S from './style';
import { useNavigate } from 'react-router-dom';
const INTERVIEW_STYLES = ['편함', '일반', '압박'];
const INTERVIEW_LEVELS = ['쉬움', '보통', '어려움'];

const INTERVIEWERS = [
  {
    id: 1,
    name: '면접관1',
    tags: ['성격', '말투', '전문분야'],
  },
  {
    id: 2,
    name: '면접관2',
    tags: ['성격', '말투', '전문분야'],
  },
  {
    id: 3,
    name: '면접관3',
    tags: ['성격', '말투', '전문분야'],
  },
  {
    id: 4,
    name: '면접관4',
    tags: ['성격', '말투', '전문분야'],
  },
];

const SettingInterview = () => {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.Card>
        <S.Section>
          <S.Title>면접 스타일</S.Title>

          <S.OptionGrid>
            {INTERVIEW_STYLES.map((style) => (
              <S.OptionButton key={style}>{style}</S.OptionButton>
            ))}
          </S.OptionGrid>
        </S.Section>

        <S.Section>
          <S.Title>면접 난이도</S.Title>

          <S.OptionGrid>
            {INTERVIEW_LEVELS.map((level) => (
              <S.OptionButton key={level}>{level}</S.OptionButton>
            ))}
          </S.OptionGrid>
        </S.Section>

        <S.Section>
          <S.Title>면접관</S.Title>

          <S.InterviewerList>
            {INTERVIEWERS.map((interviewer) => (
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
          <S.BackButton onClick={() => navigate(-1)}>돌아가기</S.BackButton>
          <S.SaveButton onClick={() => navigate('/main/interview')}>다음</S.SaveButton>
        </S.ButtonWrapper>
      </S.Card>
    </S.Container>
  );
};

export default SettingInterview;