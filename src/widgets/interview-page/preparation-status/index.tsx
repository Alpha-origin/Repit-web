import preparationIcon from "@/shared/img/interview-page/end.svg?url";
import { LoadingSpinner } from "@/shared/components/loading";
import SettingStepper from "@/widgets/interview-page/setting-stepper";
import * as S from "./style";

interface PreparationStatusProps {
  creating: boolean;
  failed: boolean;
  children?: React.ReactNode;
}

const PreparationStatus = ({ creating, failed, children }: PreparationStatusProps) => {
  return (
    <S.Container>
      <S.Content>
        <SettingStepper current={2} />
        <S.Stage aria-busy={!failed}>
          <S.Eyebrow>{failed ? "면접 준비 안내" : "잠시만 기다려주세요"}</S.Eyebrow>
          {failed ? (
            <S.PreparationIcon src={preparationIcon} alt="" aria-hidden="true" />
          ) : (
            <S.SpinnerSlot><LoadingSpinner /></S.SpinnerSlot>
          )}
          <S.Title>{failed ? "면접 준비를 확인해주세요" : "면접을 준비중입니다"}</S.Title>
          <S.Description>
            {failed ? "아래 안내를 확인하고 다시 진행해주세요." : "선택한 설정에 맞춰 면접 질문을 준비하고 있습니다."}
            {!failed ? <><br />준비가 끝나면 면접 화면으로 자동으로 이동해요.</> : null}
          </S.Description>
          {!failed ? (
            <S.Status role="status" aria-live="polite">
              <S.Dot />{creating ? "면접 정보를 생성하고 있어요" : "면접 질문과 대화 연결을 준비하고 있어요"}
            </S.Status>
          ) : null}
          <S.Actions>{children}</S.Actions>
          {!failed ? <S.Hint>준비하는 동안 잠시 이 화면에서 기다려주세요.</S.Hint> : null}
        </S.Stage>
      </S.Content>
    </S.Container>
  );
};

export default PreparationStatus;
