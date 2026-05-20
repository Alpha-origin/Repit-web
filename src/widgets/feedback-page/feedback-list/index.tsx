import * as S from "./style";
import type { FeedbackListProps } from "./type";
import { useNavigate } from "react-router-dom";
const FeedbackList = ({ items, title }: FeedbackListProps) => {
  const navigate = useNavigate();
  return (
    <S.Page>
      <S.Panel>
        <S.SectionTitle>{title}</S.SectionTitle>

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
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackList;
