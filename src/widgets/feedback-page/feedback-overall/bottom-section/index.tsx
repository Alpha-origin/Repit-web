import * as S from "../style";
import type {
  FeedbackOverallBottomSectionProps,
  FeedbackOverallKeywordItem,
} from "../type";

interface KeywordCloudProps {
  items: readonly FeedbackOverallKeywordItem[];
}

const KeywordCloud = ({ items }: KeywordCloudProps) => {
  return (
    <S.KeywordCard>
      <S.KeywordCanvas>
        {items.map((item) => (
          <S.KeywordWord
            key={`${item.text}-${item.top}-${item.left}`}
            $size={item.size}
          >
            {item.text}
          </S.KeywordWord>
        ))}
      </S.KeywordCanvas>
    </S.KeywordCard>
  );
};

const FeedbackOverallBottomSection = ({
  content,
  isDownloadingPdf = false,
  onDownloadPdf,
}: FeedbackOverallBottomSectionProps) => {
  const { keywords, questionFit, reliability } = content;

  return (
    <S.BottomSectionShell>
      <S.BottomGrid>
        <KeywordCloud items={keywords.items} />

        <S.BottomLeftColumn>
          <S.ReliabilityCard>
            <S.TextCardTitle>{reliability.title}</S.TextCardTitle>
            <S.ReliabilityBadges>
              <S.ReliabilityBadge>{reliability.scoreLabel}</S.ReliabilityBadge>
              <S.ReliabilityBadge>{reliability.levelLabel}</S.ReliabilityBadge>
            </S.ReliabilityBadges>
          </S.ReliabilityCard>

          <S.QuestionCard>
            <S.TextCardTitle>{questionFit.title}</S.TextCardTitle>
            <S.TextCardBody>{questionFit.content}</S.TextCardBody>
          </S.QuestionCard>

          {onDownloadPdf ? (
            <S.PdfButton
              type="button"
              disabled={isDownloadingPdf}
              onClick={onDownloadPdf}
            >
              {isDownloadingPdf ? "PDF 저장 중..." : content.pdfActionLabel}
            </S.PdfButton>
          ) : null}
        </S.BottomLeftColumn>
      </S.BottomGrid>
    </S.BottomSectionShell>
  );
};

export default FeedbackOverallBottomSection;
