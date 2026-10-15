import RobotImageAsset from "@/shared/img/feedback-page/Repit-feedback.svg?url";
import * as S from "../style";
import type { FeedbackDetailBottomSectionProps } from "../type";

const FeedbackDetailBottomSection = ({ content }: FeedbackDetailBottomSectionProps) => (
  <S.CoachCard>
    <S.CoachIllustration>
      <S.RobotImage src={RobotImageAsset} alt="Repit 피드백 로봇" />
    </S.CoachIllustration>
    <S.CoachText>{content.coachComment}</S.CoachText>
  </S.CoachCard>
);

export default FeedbackDetailBottomSection;
