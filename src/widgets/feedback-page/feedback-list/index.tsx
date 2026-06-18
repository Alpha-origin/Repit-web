import * as S from "./style";
import type { FeedbackListProps } from "./type";
import { useNavigate } from "react-router-dom";

const FeedbackList = ({
  emptyMessage = "아직 저장된 면접 결과가 없습니다.",
  errorMessage,
  isLoading = false,
  items,
  onRetry,
  title,
}: FeedbackListProps) => {
  const navigate = useNavigate();

  return (
    <S.Page>
      <S.Panel>
        <S.SectionTitle>{title}</S.SectionTitle>

        {isLoading ? (
          <S.StateCard aria-live="polite">
            <S.StateText>지난 면접 목록을 불러오는 중입니다.</S.StateText>
          </S.StateCard>
        ) : errorMessage ? (
          <S.StateCard aria-live="polite">
            <S.StateText>{errorMessage}</S.StateText>
            {onRetry ? (
              <S.RetryButton type="button" onClick={onRetry}>
                다시 시도
              </S.RetryButton>
            ) : null}
          </S.StateCard>
        ) : items.length === 0 ? (
          <S.StateCard aria-live="polite">
            <S.StateText>{emptyMessage}</S.StateText>
          </S.StateCard>
        ) : (
          <S.List>
            {items.map((item) => (
              <S.FeedbackCard
                key={item.id}
                onClick={() => navigate(`/main/feedback/overall/${item.id}`)}
              >
                <S.CardDate>{item.date}</S.CardDate>

                <S.CardBody>
                  <S.CardTitle>{item.title}</S.CardTitle>
                  <S.CardMeta>
                    {item.styleLabel}/{item.levelLabel}/{item.interviewerName}
                  </S.CardMeta>
                </S.CardBody>

                <S.StatusButton type="button">{item.statusLabel}</S.StatusButton>
              </S.FeedbackCard>
            ))}
          </S.List>
        )}
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackList;
