import { useInterviewSessionContext } from "@/features/interview-page/interview/model/useInterviewSessionContext";
import { readCompanyBadge } from "@/features/interview-page/company/model/type";
import { Badge } from "./style";

const CompanyBadge = () => {
  const { preparedInterview } = useInterviewSessionContext();
  const company = readCompanyBadge(preparedInterview?.company);
  return company ? <Badge>{company.displayName} 면접을 가정한 연습 면접</Badge> : null;
};
export default CompanyBadge;
