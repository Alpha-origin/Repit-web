import { Link } from "react-router-dom";
import { COMPANY_DISCLAIMER } from "@/features/interview-page/company/model/companyLabels";
import { MULTI_INTERVIEWER_TEMPLATES } from "@/shared/constants/interview-page/setting-multi-interview";
import { findStylePreset } from "@/shared/constants/interview-page/setting-interview";
import { useCompanySetup } from "@/features/interview-page/setting-company/model/useCompanySetup";
import { useUserStore } from "@/shared/store/userStore";
import Loading from "@/shared/components/loading";
import CompanyPicker from "@/widgets/interview-page/company-picker";
import SettingStepper from "@/widgets/interview-page/setting-stepper";
import * as Setting from "@/widgets/interview-page/setting-interview/style";
import * as S from "./style";

const SettingCompanyPage = () => {
  const setup = useCompanySetup();
  const settings = setup.draft?.settings;
  const companyName = setup.selectedCompany?.displayName ?? "선택한 기업";
  const interviewerNames = settings?.mode === "SOLO"
    ? MULTI_INTERVIEWER_TEMPLATES.find((item) => item.key === settings.interviewerKey)?.name
    : settings?.slots.map((slot) => slot.interviewer?.name).join(", ");
  const interviewStyle = settings?.mode === "SOLO"
    ? findStylePreset(settings)
    : settings?.style;

  if (setup.hasDraft && setup.isDecidingSkip && !setup.locked) {
    return (
      <Setting.Container>
        <Setting.ContentWrapper>
          <S.Notice role="status">면접 설정을 확인하고 있어요.</S.Notice>
          <S.Footer>
            <S.Button type="button" onClick={setup.onBack}>설정 수정</S.Button>
          </S.Footer>
        </Setting.ContentWrapper>
      </Setting.Container>
    );
  }

  if (setup.hasDraft && (setup.skipStep || setup.locked)) {
    return <Loading message="면접 설정을 확인하고 있어요" />;
  }

  return (
    <Setting.Container>
      <Setting.ContentWrapper>
        <SettingStepper current={1} />
        {!setup.hasDraft ? (
          <S.Notice role="alert">
            <p>설정이 만료되었거나 복구할 수 없습니다. 사전 설정부터 다시 시작해주세요.</p>
            <Link to="/main/setting/interview">1:1 사전 설정</Link>{" · "}
            <Link to="/main/setting/interview/multi">N:1 사전 설정</Link>
          </S.Notice>
        ) : (
          <>
            <S.Heading>
              <Setting.Title>기업 선택 (선택)</Setting.Title>
              <S.Description>기업의 공개 자료를 바탕으로 질문과 피드백을 맞춰 드려요. 고르지 않아도 면접을 진행할 수 있어요.</S.Description>
            </S.Heading>
            <S.Notice aria-label="면접 설정 요약">
              <strong>{settings?.mode === "SOLO" ? "1:1 면접" : "N:1 면접"}</strong>
              <p>
                {settings?.answerMode === "voice" ? "음성 답변" : "텍스트 답변"} · 난이도 {settings?.difficulty} · 면접 스타일 {interviewStyle ?? "직접 설정"} · {interviewerNames}
              </p>
              <S.Button type="button" disabled={setup.locked} onClick={setup.onBack}>설정 수정</S.Button>
            </S.Notice>
            <S.Summary aria-live="polite">
              선택한 기업 <strong>{setup.selectedCompanyId === null ? "없음" : companyName}</strong>
              {setup.selectedCompanyId !== null ? <S.Button type="button" disabled={setup.locked} onClick={() => setup.selectCompany(null)}>선택 안 함</S.Button> : null}
            </S.Summary>
            <CompanyPicker
              query={setup.query} onQueryChange={setup.onQueryChange}
              category={setup.category} onCategoryChange={setup.onCategoryChange}
              companies={setup.companies} selectedCompanyId={setup.selectedCompanyId}
              onSelect={setup.selectCompany} disabled={setup.locked}
              listState={setup.listState} emptyMessage={setup.emptyMessage}
            />
            {setup.listState === "error" ? (
              <S.Notice role="alert">
                <p>{setup.listError} 선택한 기업은 유지됩니다. 기업 없이 시작하려면 ‘선택 안 함’을 눌러주세요.</p>
                <S.Button type="button" onClick={setup.onRetryList}>기업 목록 다시 불러오기</S.Button>
              </S.Notice>
            ) : null}
            <S.Disclaimer><S.InfoIcon aria-hidden="true">i</S.InfoIcon>{COMPANY_DISCLAIMER}</S.Disclaimer>
            <S.Description>기준일은 자료를 수집한 시점이며, 모든 사실의 작성일이나 현재 유효성을 뜻하지 않습니다.</S.Description>
            {setup.errorMessage ? <Setting.ErrorMessage role="alert">{setup.errorMessage}</Setting.ErrorMessage> : null}
            <S.Footer>
              <S.Button type="button" disabled={setup.locked} onClick={setup.onBack}>돌아가기</S.Button>
              <S.StartButton type="button" onClick={setup.onStart}>
                {setup.selectedCompanyId === null ? "기업 없이 면접 시작" : `${companyName} 관점으로 면접 시작`}
              </S.StartButton>
            </S.Footer>
          </>
        )}
      </Setting.ContentWrapper>
    </Setting.Container>
  );
};

const AuthenticatedCompany = () => {
  const { isLoaded, id } = useUserStore();
  return isLoaded ? <SettingCompanyPage key={id} /> : <Loading message="로그인 정보를 확인하고 있어요" />;
};

export default AuthenticatedCompany;
