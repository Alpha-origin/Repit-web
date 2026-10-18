import { Navigate } from "react-router-dom";

import { COMPANY_DISCLAIMER } from "@/features/interview-page/company/model/companyLabels";
import { useCompanySetup } from "@/features/interview-page/setting-company/model/useCompanySetup";
import CompanyPicker from "@/widgets/interview-page/company-picker";
import ProfileGuidance from "@/widgets/interview-page/profile-guidance";
import SettingActions from "@/widgets/interview-page/setting-interview/setting-actions";
import * as Setting from "@/widgets/interview-page/setting-interview/style";
import SettingStepper from "@/widgets/interview-page/setting-stepper";
import * as S from "./style";

const SettingCompanyPage = () => {
  const setup = useCompanySetup();

  if (!setup.hasDraft) {
    return <Navigate to="/main" replace />;
  }

  return (
    <Setting.Container>
      <Setting.ContentWrapper>
        <SettingStepper current={1} />
        <S.Heading>
          <Setting.Title>기업 선택 (선택)</Setting.Title>
          <S.Description>
            기업을 고르면 해당 기업의 공개 자료를 바탕으로 질문과 피드백을 맞춰 드려요.
            고르지 않아도 면접을 진행할 수 있어요.
          </S.Description>
        </S.Heading>

        <CompanyPicker
          query={setup.query}
          onQueryChange={setup.onQueryChange}
          category={setup.category}
          onCategoryChange={setup.onCategoryChange}
          companies={setup.companies}
          selectedCompanyId={setup.selectedCompanyId}
          onSelect={setup.selectCompany}
          disabled={setup.isSubmitting}
        />

        <S.Disclaimer>
          <S.InfoIcon aria-hidden="true">i</S.InfoIcon>
          {COMPANY_DISCLAIMER}
        </S.Disclaimer>

        {setup.showMyPageLink ? (
          <ProfileGuidance message="" showMyPageLink />
        ) : null}
        {setup.errorMessage ? (
          <Setting.ErrorMessage role="alert">{setup.errorMessage}</Setting.ErrorMessage>
        ) : null}

        <S.Footer>
          <S.Summary>
            선택한 기업
            <strong>{setup.selectedCompany?.displayName ?? "없음"}</strong>
          </S.Summary>
          <S.Actions>
            <SettingActions
              isBusy={setup.isSubmitting}
              isNextDisabled={setup.isSubmitting}
              isPortfolioAnalyzing={false}
              nextLabel="면접 시작"
              onBack={setup.onBack}
              onNext={setup.onStart}
            />
          </S.Actions>
        </S.Footer>
      </Setting.ContentWrapper>

      {setup.isSubmitting ? (
        <Setting.LoadingOverlay role="status" aria-live="polite">
          <Setting.LoadingSpinner aria-hidden="true" />
          <Setting.LoadingMessage>면접을 준비하고 있어요</Setting.LoadingMessage>
        </Setting.LoadingOverlay>
      ) : null}
    </Setting.Container>
  );
};

export default SettingCompanyPage;
