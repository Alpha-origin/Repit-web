import * as S from './style';

const interviewers = [
  {
    id: 1,
    title: '면접관1',
    personality: '차분함',
    tone: '부드러운 말투',
    field: '프론트엔드',
  },
  {
    id: 2,
    title: '면접관2',
    personality: '냉철함',
    tone: '직설적인 말투',
    field: '백엔드',
  },
  {
    id: 3,
    title: '면접관3',
    personality: '친근함',
    tone: '편안한 말투',
    field: 'CS',
  },
  {
    id: 4,
    title: '면접관4',
    personality: '압박형',
    tone: '날카로운 말투',
    field: '인성면접',
  },
];

const SettingInterview = () => {
  return (
    <S.Container>
      <S.ContentWrapper>
        <S.Sections>
          <S.Section>
            <S.Title>면접 스타일</S.Title>

            <S.ButtonGroup>
              <S.SelectButton type="button">편함</S.SelectButton>
              <S.SelectButton type="button">일반</S.SelectButton>
              <S.SelectButton type="button">압박</S.SelectButton>
            </S.ButtonGroup>
          </S.Section>

          <S.Section>
            <S.Title>면접 난이도</S.Title>

            <S.ButtonGroup>
              <S.SelectButton type="button">쉬움</S.SelectButton>
              <S.SelectButton type="button">보통</S.SelectButton>
              <S.SelectButton type="button">어려움</S.SelectButton>
            </S.ButtonGroup>
          </S.Section>

          <S.Section>
            <S.Title>면접관</S.Title>

            <S.InterviewerGrid>
              {interviewers.map((item) => (
                <S.InterviewerCard key={item.id}>
                  <S.InterviewerTitle>{item.title}</S.InterviewerTitle>

                  <S.CardText>{item.personality}</S.CardText>
                  <S.CardText>{item.tone}</S.CardText>
                  <S.CardText>{item.field}</S.CardText>
                </S.InterviewerCard>
              ))}
            </S.InterviewerGrid>
          </S.Section>
        </S.Sections>

        <S.BottomButtonWrapper>
          <S.BackButton type="button">돌아가기</S.BackButton>
          <S.NextButton type="button">다음</S.NextButton>
        </S.BottomButtonWrapper>
      </S.ContentWrapper>
    </S.Container>
  );
};

export default SettingInterview;
