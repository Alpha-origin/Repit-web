import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FEEDBACK_LIST_SORT_KEY_LABELS,
  getFeedbackListSortLabel,
  readFeedbackListSort,
  sortFeedbackList,
  writeFeedbackListSort,
  type FeedbackListSort,
  type FeedbackListSortKey,
} from "@/features/feedback-page/feedback-list/model/sortFeedbackList";
import * as S from "./style";
import type { FeedbackListProps } from "./type";

const getNormalizedStatusLabel = (statusLabel: string) =>
  statusLabel.replace(/\s/g, "");

const getStatusDisplayLabel = (statusLabel: string) => {
  if (getNormalizedStatusLabel(statusLabel) === "분석완료") {
    return "분석 완료";
  }

  if (statusLabel === "진행중") {
    return "분석중";
  }

  return statusLabel;
};

type InternalProps = FeedbackListProps & {
  onItemClick?: (item: FeedbackListProps["items"][number]) => void;
};

const FeedbackList = ({
  emptyMessage = "아직 저장된 면접 결과가 없습니다.",
  errorMessage,
  isLoading = false,
  items,
  onRetry,
  title,
  onItemClick,
}: InternalProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = readFeedbackListSort(searchParams);
  const sortedItems = useMemo(
    () => sortFeedbackList(items, readFeedbackListSort(searchParams)),
    [items, searchParams],
  );
  const updateSort = (nextSort: FeedbackListSort) => {
    setSearchParams(
      (current) => writeFeedbackListSort(current, nextSort),
      { replace: true },
    );
  };

  return (
    <S.Page>
      <S.Panel>
        <S.Toolbar>
          <S.SectionTitle>{title}</S.SectionTitle>
          <S.SortControls>
            <S.SortSelectWrapper>
              <S.SortSelect
                aria-label="정렬 기준"
                value={sort.key}
                onChange={(event) =>
                  // 기준을 바꾸면 방향은 내림차순으로 되돌린다.
                  updateSort({
                    key: event.target.value as FeedbackListSortKey,
                    order: "desc",
                  })
                }
              >
                {(Object.keys(FEEDBACK_LIST_SORT_KEY_LABELS) as FeedbackListSortKey[]).map((key) => (
                  <option key={key} value={key}>
                    {FEEDBACK_LIST_SORT_KEY_LABELS[key]}
                  </option>
                ))}
              </S.SortSelect>
            </S.SortSelectWrapper>
            <S.SortDirectionButton
              type="button"
              aria-label={`정렬 방향: ${getFeedbackListSortLabel(sort)}`}
              onClick={() =>
                updateSort({
                  key: sort.key,
                  order: sort.order === "desc" ? "asc" : "desc",
                })
              }
            >
              {getFeedbackListSortLabel(sort)}
            </S.SortDirectionButton>
          </S.SortControls>
        </S.Toolbar>

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
            {sortedItems.map((item, index) => {
              const isComplete = getNormalizedStatusLabel(
                item.statusLabel,
              ).includes("완료");
              const itemKey = `${item.sessionId ?? item.id ?? "feedback"}-${index}`;

              return (
                <S.FeedbackCard
                  key={itemKey}
                  type="button"
                  onClick={() => {
                    if (onItemClick) {
                      onItemClick(item);
                      return;
                    }

                    navigate(`/main/feedback/overall/${item.id}`);
                  }}
                >
                  <S.CardImage
                    src={item.imageUrl}
                    alt={`${item.interviewerName} 이미지`}
                  />
                  <S.CardBody>
                    <S.CardTitle>{item.title}</S.CardTitle>
                    {item.companyName ? <S.Tag>{item.companyName} 연습 면접</S.Tag> : null}
                    {item.totalScore !== undefined ? (
                      <S.ScoreLine>
                        종합 점수 <S.ScoreValue>{item.totalScore}점</S.ScoreValue>
                      </S.ScoreLine>
                    ) : null}
                    <S.MetaGroup>
                      <S.MetaLabel>성향/난이도</S.MetaLabel>
                      <S.TagGroup>
                        <S.Tag key={`${item.id}-style`}>{item.styleLabel}</S.Tag>
                        <S.Tag key={`${item.id}-level`}>{item.levelLabel}</S.Tag>
                      </S.TagGroup>
                    </S.MetaGroup>
                    <S.MetaGroup>
                      <S.MetaLabel>면접관</S.MetaLabel>
                      <S.TagGroup>
                        <S.Tag key={`${item.id}-interviewer`}>
                          {item.interviewerName}
                        </S.Tag>
                      </S.TagGroup>
                    </S.MetaGroup>
                    {item.summary ? (
                      <S.CardSummary>{item.summary}</S.CardSummary>
                    ) : null}
                    {item.answeredCount !== undefined ||
                    item.questionCount !== undefined ? (
                      <S.AnswerCount>
                        답변 문항 {item.answeredCount ?? 0} /{" "}
                        {item.questionCount ?? 0}
                      </S.AnswerCount>
                    ) : null}
                    <S.CardDate>{item.date}</S.CardDate>
                  </S.CardBody>
                  <S.StatusBadge $complete={isComplete}>
                    {getStatusDisplayLabel(item.statusLabel)}
                  </S.StatusBadge>
                </S.FeedbackCard>
              );
            })}
          </S.List>
        )}
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackList;
