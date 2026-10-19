import { Link } from "react-router-dom";
import { COMPANY_DISCLAIMER } from "@/features/interview-page/company/model/companyLabels";
import { MULTI_INTERVIEWER_TEMPLATES } from "@/shared/constants/interview-page/setting-multi-interview";
import { useCompanySetup } from "@/features/interview-page/setting-company/model/useCompanySetup";
import { useUserStore } from "@/shared/store/userStore";
import Loading from "@/shared/components/loading";
import ProfileGuidance from "@/widgets/interview-page/profile-guidance";
import CompanyPicker from "@/widgets/interview-page/company-picker";
import SettingStepper from "@/widgets/interview-page/setting-stepper";
import * as Setting from "@/widgets/interview-page/setting-interview/style";
import * as S from "./style";

const SettingCompanyPage = () => {
  const setup = useCompanySetup();
  const settings = setup.draft?.settings;
  const companyName = setup.selectedCompany?.displayName ?? "선택한 기업";
  const isPreparing = setup.preparationState === "PREPARING";
  const isCreated = !!setup.draft?.submission?.interviewId;
  const isUnknown = !!setup.draft?.submission && !isCreated;
  const interviewerNames = settings?.mode === "SOLO"
    ? MULTI_INTERVIEWER_TEMPLATES.find((item) => item.key === settings.interviewerKey)?.name
    : settings?.slots.map((slot) => slot.interviewer?.name).join(", ");

  // 준비 상태·오류·복구 버튼은 선택 화면과 건너뛰기 화면이 같이 쓴다.
  const preparationStatus = (
    <>
      {setup.showMyPageLink ? <ProfileGuidance message="" showMyPageLink /> : null}
      {setup.errorMessage ? <Setting.ErrorMessage role="alert">{setup.errorMessage}</Setting.ErrorMessage> : null}
      {isPreparing ? <S.Notice role="status">면접을 준비하고 있어요. 준비가 끝나면 면접 화면으로 이동합니다.</S.Notice> : null}
      {isUnknown && !setup.isSubmitting ? <S.Notice role="status">생성 결과를 확인 중인 요청이 있습니다. 설정을 유지한 채 같은 요청으로 복구합니다.</S.Notice> : null}
    </>
  );
  const recoveryButton = isCreated ? (
    <S.Button type="button" disabled={setup.isSubmitting || isPreparing} onClick={() => void setup.onRetryPreparation()}>
      {setup.canRetryPreparation ? "면접 준비 다시 시도" : "준비 상태 다시 확인"}
    </S.Button>
  ) : null;

  if (setup.hasDraft && setup.isDecidingSkip) {
    return (
      <Setting.Container>
        <Setting.ContentWrapper>
          <S.Notice role="status">면접 설정을 확인하고 있어요.</S.Notice>
        </Setting.ContentWrapper>
      </Setting.Container>
    );
  }

  if (setup.hasDraft && setup.skipStep) {
    // 공개 기업이 없으면 기업 선택 단계를 보여 주지 않고 바로 면접을 준비한다(05-web §3-3 C0-3).
    return (
      <Setting.Container>
        <Setting.ContentWrapper>
          <Setting.Title>면접 준비</Setting.Title>
          {setup.isSubmitting && !isUnknown ? <S.Notice role="status">면접을 만들고 있어요.</S.Notice> : null}
          {preparationStatus}
          <S.Footer>
            <S.Button type="button" disabled={setup.locked} onClick={setup.onBack}>설정 수정</S.Button>
            {recoveryButton ?? (isUnknown || (!setup.isSubmitting && setup.errorMessage) ? (
              <S.StartButton type="button" disabled={setup.isSubmitting} onClick={() => void setup.onStart()}>
                {setup.isSubmitting ? "생성 결과 확인 중…" : isUnknown ? "같은 요청으로 결과 확인" : "면접 시작"}
              </S.StartButton>
            ) : null)}
            {isCreated ? <Link to={`/main/setting/interview${settings?.mode === "MULTI" ? "/multi" : ""}`}>새 면접 만들기</Link> : null}
          </S.Footer>
        </Setting.ContentWrapper>
      </Setting.Container>
    );
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
              <p>{interviewerNames} · 난이도 {settings?.difficulty} · {settings?.answerMode === "voice" ? "음성 답변" : "텍스트 답변"}</p>
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
            {preparationStatus}
            <S.Footer>
              <S.Button type="button" disabled={setup.locked} onClick={setup.onBack}>돌아가기</S.Button>
              {recoveryButton ?? (
                <S.StartButton type="button"
                  disabled={setup.isSubmitting} onClick={() => void setup.onStart()}>
                  {setup.isSubmitting ? "생성 결과 확인 중…" : isUnknown ? "같은 요청으로 결과 확인" : setup.selectedCompanyId === null ? "기업 없이 면접 시작" : `${companyName} 관점으로 면접 시작`}
                </S.StartButton>
              )}
              {isCreated ? <Link to={`/main/setting/interview${settings?.mode === "MULTI" ? "/multi" : ""}`}>새 면접 만들기</Link> : null}
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
