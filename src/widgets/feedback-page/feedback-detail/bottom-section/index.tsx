import RobotImageAsset from "@/shared/img/feedback-page/Repit-feedback.svg?url";
import { useNavigate } from "react-router-dom";
import * as S from "../style";
import type { FeedbackDetailBottomSectionProps } from "../type";

const FeedbackDetailBottomSection = ({
  content,
}: FeedbackDetailBottomSectionProps) => {
  const navigate = useNavigate();

  return (
    <S.BottomBlock>
      <S.CoachCard>
        <S.CoachIllustration>
          <S.RobotImage src={RobotImageAsset} alt="Repit 피드백 로봇" />
        </S.CoachIllustration>

        <S.CoachBubble>
          <S.CoachText>{content.coachComment}</S.CoachText>
        </S.CoachBubble>
      </S.CoachCard>

      <S.ActionRow>
        <S.SecondaryActionButton type="button" onClick={() => window.print()}>
          {content.secondaryActionLabel}
        </S.SecondaryActionButton>
        <S.PrimaryActionButton
          type="button"
          onClick={() => navigate("/main/interview")}
        >
          {content.primaryActionLabel}
        </S.PrimaryActionButton>
      </S.ActionRow>
    </S.BottomBlock>
  );
};

export default FeedbackDetailBottomSection;
