import * as S from "./style";

interface FeedbackListItem {
  id: number;
  date: string;
  title: string;
  styleLabel: string;
  levelLabel: string;
  interviewerName: string;
  statusLabel: string;
}

interface FeedbackListProps {
  items: readonly FeedbackListItem[];
  title: string;
}

const FeedbackList = ({ items, title }: FeedbackListProps) => {
  return (
    <S.Page>
      <S.Panel>
        <S.SectionTitle>{title}</S.SectionTitle>

        <S.List>
          {items.map((item) => (
            <S.FeedbackCard key={item.id}>
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
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackList;
