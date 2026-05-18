import type { InterviewCameraViewProps } from "../type";
import * as S from "../style";

const InterviewCameraView = ({
  cameraState,
  videoRef,
}: InterviewCameraViewProps) => {
  return (
    <S.PreviewSection>
      <S.PreviewFrame>
        <S.CameraVideo
          ref={videoRef}
          autoPlay
          muted
          playsInline
          $visible={cameraState === "ready"}
        />
        <S.PreviewOverlay />

        {cameraState !== "ready" && (
          <S.CameraFallback>
            <S.CameraFallbackTitle>
              {cameraState === "loading" ? "카메라 준비 중" : "카메라 연결 필요"}
            </S.CameraFallbackTitle>
            <S.CameraFallbackText>
              {cameraState === "loading"
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
