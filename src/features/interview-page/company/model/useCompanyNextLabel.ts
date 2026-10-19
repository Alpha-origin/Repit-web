import { useEffect, useState } from "react";
import { getCompanies } from "@/features/interview-page/company/api";

export const COMPANY_STEP_NEXT_LABEL = "다음: 기업 선택";
// 공개 기업이 없으면 기업 선택 단계를 건너뛴다(05-web §3-3 C0-6). 이동 대상은 같고 문구만 바꾼다.
export const COMPANY_SKIPPED_NEXT_LABEL = "면접 시작";

export const useCompanyNextLabel = () => {
  const [isEmpty, setIsEmpty] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    getCompanies("", "ALL", controller.signal)
      .then((companies) => { if (!controller.signal.aborted) setIsEmpty(companies.length === 0); })
      // 실패하면 기업 선택 화면이 오류와 "기업 없이 면접 시작"을 보여 준다(C0-4). 문구는 그대로 둔다.
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  return isEmpty ? COMPANY_SKIPPED_NEXT_LABEL : COMPANY_STEP_NEXT_LABEL;
};
