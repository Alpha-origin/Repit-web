import { useInterviewSessionContext } from "@/features/interview-page/interview/model/useInterviewSessionContext";
import * as S from "../style";

const InterviewCameraView = () => {
  const { cameraState, isCameraEnabled, videoRef } = useInterviewSessionContext();
  const isCameraOff = cameraState === "ready" && !isCameraEnabled;

  return (
    <S.PreviewSection>
      <S.PreviewFrame>
        <S.CameraVideo
          ref={videoRef}
          autoPlay
          muted
          playsInline
          $visible={cameraState === "ready" && isCameraEnabled}
        />
        <S.PreviewOverlay />

        {(cameraState !== "ready" || isCameraOff) && (
          <S.CameraFallback>
            <S.CameraFallbackTitle>
              {isCameraOff ? "카메라가 꺼져 있어요" : cameraState === "loading" ? "카메라 준비 중" : "카메라 연결 필요"}
            </S.CameraFallbackTitle>
            <S.CameraFallbackText>
              {isCameraOff ? "카메라 버튼을 누르면 다시 켤 수 있어요."
                : cameraState === "loading"
                ? "잠시만 기다리면 웹캠 화면이 나타납니다."
                : "브라우저 권한을 허용하면 실제 사용자 웹캠이 이 영역에 표시됩니다."}
            </S.CameraFallbackText>
          </S.CameraFallback>
        )}
      </S.PreviewFrame>
    </S.PreviewSection>
  );
};

export default InterviewCameraView;
