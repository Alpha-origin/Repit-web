import { FEEDBACK_DETAIL_CONTENT } from "@/shared/constants/feedback-page/feedback-detail";
import { exportElementToPdf } from "@/shared/utils/exportElementToPdf";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FeedbackDetailBottomSection from "@/widgets/feedback-page/feedback-detail/bottom-section";
import FeedbackDetailMiddleSection from "@/widgets/feedback-page/feedback-detail/middle-section";
import FeedbackDetailTopSection from "@/widgets/feedback-page/feedback-detail/top-section";
import * as S from "./style";

const FeedbackDetailPage = () => {
  const { bottomSection, middleSection, topSection } = FEEDBACK_DETAIL_CONTENT;
  const { id } = useParams();
  const panelRef = useRef<HTMLElement | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (!panelRef.current || isDownloadingPdf) {
      return;
    }

    setIsDownloadingPdf(true);

    try {
      await exportElementToPdf(panelRef.current, {
        fileName: `repit-feedback-detail-${id ?? "1"}.pdf`,
      });
    } catch (error) {
      console.error(error);
      window.alert("PDF 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <S.Page>
      <S.Panel ref={panelRef}>
        <FeedbackDetailTopSection content={topSection} />
        <FeedbackDetailMiddleSection content={middleSection} />
        <FeedbackDetailBottomSection
          content={bottomSection}
          isDownloadingPdf={isDownloadingPdf}
          onDownloadPdf={handleDownloadPdf}
        />
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackDetailPage;
