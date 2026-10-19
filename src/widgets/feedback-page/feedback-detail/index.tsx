import { useSearchParams } from "react-router-dom";
import { forwardRef, useEffect, useRef, useState } from "react";
import FeedbackTabs from "@/widgets/feedback-page/feedback-tabs";
import FeedbackDetailTopSection from "./top-section";
import FeedbackDetailMiddleSection from "./middle-section";
import FeedbackDetailBottomSection from "./bottom-section";
import type { FeedbackDetailProps } from "./type";
import * as S from "./style";

const FeedbackDetail = forwardRef<HTMLElement, FeedbackDetailProps>(function FeedbackDetail(
  { content, isDownloadingPdf, onDownloadPdf, companySection },
  ref,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const linkedQuestionId = searchParams.get("questionId");
  const [selectedQuestionId, setSelectedQuestionId] = useState(content.topSection.questions[0]?.id);
  const selectedQuestion = content.topSection.questions.find((item) => linkedQuestionId !== null && item.questionId === linkedQuestionId)
    ?? content.topSection.questions.find((item) => item.id === selectedQuestionId)
    ?? content.topSection.questions[0];

  // 기업 코멘트의 문항 링크로 들어왔을 때만 한 번 스크롤한다. 탭 클릭으로 바뀐 주소에는 반응하지 않는다.
  const initialLinkedQuestionId = useRef(linkedQuestionId);
  useEffect(() => {
    if (initialLinkedQuestionId.current) document.getElementById("feedback-question-content")?.scrollIntoView({ block: "start" });
  }, []);

  if (!selectedQuestion) return null;

  return (
    <S.DetailLayout>
      <S.Sidebar aria-label="질문별 피드백">
        <S.SideTitle>{content.topSection.questionListTitle}</S.SideTitle>
        <S.QuestionList>
          {content.topSection.questions.map((item) => (
            <S.QuestionItemButton
              key={item.id}
              type="button"
              $active={item.id === selectedQuestion.id}
              aria-pressed={item.id === selectedQuestion.id}
              aria-controls="feedback-question-content"
              onClick={() => {
                setSelectedQuestionId(item.id);
                setSearchParams((previous) => {
                  const next = new URLSearchParams(previous);
                  if (item.questionId) next.set("questionId", item.questionId);
                  else next.delete("questionId");
                  return next;
                }, { replace: true });
              }}
            >
              <S.QuestionItemHeading>
                <S.QuestionNumber>{item.label}</S.QuestionNumber>
                {item.personaLabel && <S.QuestionPersona>{item.personaLabel}</S.QuestionPersona>}
              </S.QuestionItemHeading>
              <S.QuestionPreview>{item.preview}</S.QuestionPreview>
            </S.QuestionItemButton>
          ))}
        </S.QuestionList>
        <S.SideActions data-html2canvas-ignore>
          <S.ReplayButton type="button" disabled title="면접 다시보기는 준비 중입니다.">
            {content.bottomSection.primaryActionLabel}
          </S.ReplayButton>
          <S.PdfButton type="button" disabled={isDownloadingPdf} onClick={onDownloadPdf}>
            {isDownloadingPdf ? "PDF 저장 중..." : content.bottomSection.secondaryActionLabel}
          </S.PdfButton>
        </S.SideActions>
      </S.Sidebar>

      <S.DetailScrollArea>
        <S.DetailContent ref={ref} id="feedback-question-content">
          <S.HeadingRow>
            <S.Breadcrumb>
              상세 피드백 &gt; <span>{selectedQuestion.label} {selectedQuestion.question}</span>
            </S.Breadcrumb>
            <FeedbackTabs />
          </S.HeadingRow>
          <FeedbackDetailTopSection content={content.topSection} question={selectedQuestion} />
          <FeedbackDetailMiddleSection content={content.middleSection} question={selectedQuestion} />
          {companySection}
          <FeedbackDetailBottomSection
            content={{ ...content.bottomSection, coachComment: selectedQuestion.comment }}
          />
        </S.DetailContent>
      </S.DetailScrollArea>
    </S.DetailLayout>
  );
});

export default FeedbackDetail;
