import * as S from "../style";
import type { FeedbackOverallMiddleSectionProps } from "../type";
import InterviewerImage1 from "@/shared/img/interview-page/interviewer1.svg?url";
import InterviewerImage2 from "@/shared/img/interview-page/interviewer2.svg?url";
import InterviewerImage3 from "@/shared/img/interview-page/interviewer3.svg?url";
import InterviewerImage4 from "@/shared/img/interview-page/interviewer4.svg?url";

const PERSONA_IMAGES = [InterviewerImage2, InterviewerImage1, InterviewerImage4, InterviewerImage3] as const;

const FeedbackOverallMiddleSection = ({ content }: FeedbackOverallMiddleSectionProps) => {
  const { previousScore, currentScore } = content.comparison;
  const difference = previousScore !== null && currentScore !== null
    ? Math.round((currentScore - previousScore) * 10) / 10
    : null;

  return (
    <S.SectionBlock>
      <S.MiddleGrid>
        <S.InsightGroup>
          {content.cards.map((card) => (
            <S.InsightCard key={card.title} $tone={card.tone}>
              <S.InsightHeader>
                <S.InsightIcon viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 8.5v1M16 8.5v1" />
                  <path d={card.tone === "positive" ? "M7.5 14a4.7 4.7 0 0 0 9 0" : "M7.5 17a4.7 4.7 0 0 1 9 0"} />
                </S.InsightIcon>
                <S.InsightTitle>{card.title}</S.InsightTitle>
              </S.InsightHeader>
              <S.InsightList>
                {card.items.map((item, index) => (
                  <S.InsightItem key={`${index}-${item}`}>
                    <S.InsightNumber aria-hidden="true">{String(index + 1).padStart(2, "0")}</S.InsightNumber>
                    <S.TextCardBody>{item}</S.TextCardBody>
                  </S.InsightItem>
                ))}
              </S.InsightList>
            </S.InsightCard>
          ))}
        </S.InsightGroup>

        <S.ComparisonCard aria-label="지난 면접 점수 비교">
          <S.ComparisonTitle>
            지난 면접 대비
            <S.ComparisonDescription>
              {difference === null ? (
                <span>비교할 점수가 아직 없어요.</span>
              ) : difference === 0 ? (
                <span>지난 면접과 같은 점수예요.</span>
              ) : (
                <><S.ComparisonHighlight>{difference > 0 ? "+ " : "− "}{Math.abs(difference)}점</S.ComparisonHighlight>이 {difference > 0 ? "상승했어요!" : "하락했어요."}</>
              )}
            </S.ComparisonDescription>
          </S.ComparisonTitle>
          <S.BarChart>
            {[
              { label: "이전 면접 점수", score: previousScore, tone: "muted" as const },
              { label: "이번 면접 점수", score: currentScore, tone: "primary" as const },
            ].map((bar) => (
              <S.BarColumn key={bar.label}>
                <S.BarTrack>
                  <S.BarFill $score={bar.score ?? 0} $tone={bar.tone}>
                    <S.BarValue $tone={bar.tone}>{bar.score === null ? "—" : `${bar.score}점`}</S.BarValue>
                  </S.BarFill>
                </S.BarTrack>
                <S.BarLabel>{bar.label}</S.BarLabel>
              </S.BarColumn>
            ))}
          </S.BarChart>
        </S.ComparisonCard>
      </S.MiddleGrid>

      {content.showPersonaFeedback ? <S.PersonaFeedbackList aria-label="면접관별 피드백">
        {content.personaFeedbacks.length > 0 ? content.personaFeedbacks.map((persona, index) => (
          <S.PersonaFeedbackCard key={`${persona.title}-${index}`}>
            <S.PersonaImage
              src={persona.imageUrl ?? PERSONA_IMAGES[index % PERSONA_IMAGES.length]}
              alt={`${persona.title} 프로필`}
              onError={(event) => {
                const fallback = PERSONA_IMAGES[index % PERSONA_IMAGES.length];
                if (event.currentTarget.getAttribute("src") !== fallback) event.currentTarget.src = fallback;
              }}
            />
            <S.PersonaFeedbackBody>
              <S.PersonaFeedbackTitle>{persona.title}</S.PersonaFeedbackTitle>
              <S.PersonaFeedbackText>{persona.comment}</S.PersonaFeedbackText>
            </S.PersonaFeedbackBody>
            <S.PersonaScore>
              {persona.hasNoAnswer ? "담당 답변 없음" : persona.score === null ? "미제공" : `${persona.score}점`}
            </S.PersonaScore>
          </S.PersonaFeedbackCard>
        )) : (
          <S.PersonaEmpty>면접관별 코멘트가 제공되지 않았습니다.</S.PersonaEmpty>
        )}
      </S.PersonaFeedbackList> : null}
    </S.SectionBlock>
  );
};

export default FeedbackOverallMiddleSection;
