import { uploadInterviewRecording } from "../api";

interface UploadRecordingParams {
  interviewId: number | null;
  questionId?: number;
  file: File | null;
}

export const uploadRecordingInBackground = ({
  interviewId,
  questionId,
  file,
}: UploadRecordingParams) => {
  if (!file || interviewId == null) {
    return;
  }

  // 업로드를 기다리면 다음 질문 진행이 영상 크기만큼 늦어질 수 있다.
  void uploadInterviewRecording({ interviewId, questionId, file }).then(
    ({ errorMessage }) => {
      if (errorMessage) {
        console.error("녹화 업로드 실패:", errorMessage);
      }
    },
  );
};
