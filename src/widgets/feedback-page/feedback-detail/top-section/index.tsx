import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as S from "../style";
import type {
  FeedbackDetailQuestionItem,
  FeedbackDetailTopSectionProps,
} from "../type";

interface QuestionItemProps {
  isActive: boolean;
  item: FeedbackDetailQuestionItem;
  onSelect: (questionId: number) => void;
}

const QuestionItem = ({ isActive, item, onSelect }: QuestionItemProps) => {
  return (
    <S.QuestionItemButton
      $active={isActive}
      aria-pressed={isActive}
      type="button"
      onClick={() => onSelect(item.id)}
    >
      <S.QuestionNumber>{item.label}</S.QuestionNumber>
      <S.QuestionPreview>{item.preview}</S.QuestionPreview>
    </S.QuestionItemButton>
  );
};

const FeedbackDetailTopSection = ({
  content,
}: FeedbackDetailTopSectionProps) => {
  const firstQuestion = content.questions[0];
  const [selectedQuestionId, setSelectedQuestionId] = useState(
    firstQuestion?.id ?? 0
  );
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const feedbackId = id ?? "1";

  const selectedQuestion =
    content.questions.find((question) => question.id === selectedQuestionId) ??
    firstQuestion;

  if (!selectedQuestion) {
    return null;
  }

  const handleSelectQuestion = (questionId: number) => {
    setSelectedQuestionId(questionId);
    setIsAnswerVisible(false);
  };

  return (
    <S.SectionBlock>
      <S.TabGroup>
        <S.TabButton
          $active={content.tabs.activeTab === "overall"}
          type="button"
          onClick={() => navigate(`/main/feedback/overall/${feedbackId}`)}
        >
          {content.tabs.overallLabel}
        </S.TabButton>
        <S.TabButton
          $active={content.tabs.activeTab === "detail"}
          type="button"
          onClick={() => navigate(`/main/feedback/detail/${feedbackId}`)}
        >
          {content.tabs.detailLabel}
        </S.TabButton>
      </S.TabGroup>

      <S.SectionShell>
        <S.TopGrid>
          <S.QuestionListCard>
            <S.SideTitle>{content.questionListTitle}</S.SideTitle>
            <S.QuestionList>
              {content.questions.map((item) => (
                <QuestionItem
                  key={item.id}
                  isActive={item.id === selectedQuestion.id}
                  item={item}
                  onSelect={handleSelectQuestion}
                />
              ))}
            </S.QuestionList>
          </S.QuestionListCard>

          <S.DetailColumn>
            <S.DetailCard>
              <S.DetailCardTitle>{content.questionTitle}</S.DetailCardTitle>
              <S.QuestionContent>
                <S.DetailCardText>{selectedQuestion.question}</S.DetailCardText>
              </S.QuestionContent>
              <S.IntentSection>
                <S.IntentBadge>{content.intentionTitle}</S.IntentBadge>
                <S.DetailCardText>{selectedQuestion.intention}</S.DetailCardText>
              </S.IntentSection>
            </S.DetailCard>

            <S.AnswerCard>
              <S.AnswerHeader>
                <S.DetailCardTitle>{content.myAnswerTitle}</S.DetailCardTitle>
                <S.AnswerToggleButton
                  type="button"
                  onClick={() => setIsAnswerVisible((current) => !current)}
                >
                  {isAnswerVisible
                    ? content.hideMyAnswerLabel
                    : content.showMyAnswerLabel}
                </S.AnswerToggleButton>
              </S.AnswerHeader>
              {isAnswerVisible && (
                <S.DetailCardText>{selectedQuestion.myAnswer}</S.DetailCardText>
              )}
            </S.AnswerCard>

            <S.DetailCard>
              <S.DetailCardTitle>{content.modelAnswerTitle}</S.DetailCardTitle>
              <S.QuestionContent>
                <S.DetailCardText>{selectedQuestion.modelAnswer}</S.DetailCardText>
              </S.QuestionContent>
            </S.DetailCard>

            <S.DetailCard>
              <S.DetailCardTitle>{content.followUpTitle}</S.DetailCardTitle>
              <S.QuestionContent>
                <S.DetailCardText>
                  {selectedQuestion.followUpQuestion}
                </S.DetailCardText>
              </S.QuestionContent>
            </S.DetailCard>
          </S.DetailColumn>
        </S.TopGrid>
      </S.SectionShell>
    </S.SectionBlock>
  );
};

export default FeedbackDetailTopSection;
