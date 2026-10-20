import { Link } from "react-router-dom";
import { useInterviewPreparation } from "@/features/interview-page/setting-company/model/useInterviewPreparation";
import { useUserStore } from "@/shared/store/userStore";
import Loading from "@/shared/components/loading";
import ProfileGuidance from "@/widgets/interview-page/profile-guidance";
import PreparationStatus from "@/widgets/interview-page/preparation-status";
import * as S from "@/pages/interview-page/setting-company/style";

const InterviewPreparingPage = () => {
  const setup = useInterviewPreparation();
  const created = !!setup.draft?.submission?.interviewId;
  const unknown = !!setup.draft?.submission && !created;
  const failed = !setup.draft || !!setup.errorMessage;

  return (
    <PreparationStatus creating={!created} failed={failed}>
      {!setup.draft ? (
        <>
          <S.Notice role="alert">설정이 만료되었거나 복구할 수 없습니다. 사전설정부터 다시 시작해주세요.</S.Notice>
          <Link to="/main/setting/interview">1:1 사전설정</Link>
          <Link to="/main/setting/interview/multi">N:1 사전설정</Link>
        </>
      ) : setup.errorMessage ? (
        <>
          <S.Notice role="alert">{setup.errorMessage}</S.Notice>
          {setup.showMyPageLink ? <ProfileGuidance message="" showMyPageLink /> : null}
          <S.StartButton type="button" disabled={setup.isSubmitting}
            onClick={() => void (created ? setup.onRetryPreparation() : setup.onStart())}>
            {setup.isSubmitting ? "다시 확인하고 있어요…" : created ? setup.canRetryPreparation ? "면접 준비 다시 시도" : "준비 상태 다시 확인" : unknown ? "같은 요청으로 결과 확인" : "면접 생성 다시 시도"}
          </S.StartButton>
          {!setup.draft.submission ? <S.Button type="button" disabled={setup.isSubmitting} onClick={setup.onBack}>기업 선택으로 돌아가기</S.Button> : null}
          {created ? <Link to={`/main/setting/interview${setup.draft.mode === "MULTI" ? "/multi" : ""}`}>새 면접 만들기</Link> : null}
        </>
      ) : null}
    </PreparationStatus>
  );
};

const AuthenticatedPreparation = () => {
  const { isLoaded, id } = useUserStore();
  return isLoaded ? <InterviewPreparingPage key={id} /> : <Loading message="로그인 정보를 확인하고 있어요" />;
};

export default AuthenticatedPreparation;
