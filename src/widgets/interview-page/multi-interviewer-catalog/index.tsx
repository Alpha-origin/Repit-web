import type { InterviewerTemplate } from "@/shared/constants/interview-page/setting-multi-interview";
import * as S from "@/widgets/interview-page/setting-multi-interview/style";

interface CandidateState {
  disabled: boolean;
  disabledReason?: string;
  selected: boolean;
}

interface MultiInterviewerCatalogProps {
  candidates: readonly InterviewerTemplate[];
  getCandidateState: (candidate: InterviewerTemplate) => CandidateState;
  onSelect: (candidate: InterviewerTemplate) => void;
}

const MultiInterviewerCatalog = ({
  candidates,
  getCandidateState,
  onSelect,
}: MultiInterviewerCatalogProps) => (
  <S.Section aria-labelledby="multi-interviewer-catalog-title">
    <S.SectionTitle id="multi-interviewer-catalog-title">면접관 후보</S.SectionTitle>
    <S.CandidateScroller aria-label="면접관 후보 목록">
      {candidates.map((candidate) => {
        const state = getCandidateState(candidate);

        return (
          <S.CandidateCard
            key={candidate.key}
            $disabled={state.disabled}
            $selected={state.selected}
            aria-pressed={state.selected}
            disabled={state.disabled}
            title={state.disabledReason}
            type="button"
            onClick={() => onSelect(candidate)}
          >
            <S.CandidateImageFrame>
              <S.CandidateImage src={candidate.image} alt="" />
            </S.CandidateImageFrame>
            <S.CandidateBody>
              <S.CandidateName>{candidate.name}</S.CandidateName>
              <S.RoleBadge>{candidate.roleLabel}</S.RoleBadge>
              <S.CandidateDescription>{candidate.description}</S.CandidateDescription>
            </S.CandidateBody>
          </S.CandidateCard>
        );
      })}
    </S.CandidateScroller>
    <S.CatalogHint>
      이미 선택된 면접관과 동일한 평가 분야의 면접관은 선택할 수 없습니다.
    </S.CatalogHint>
  </S.Section>
);

export default MultiInterviewerCatalog;
