import {
  uploadInterviewRecording,
  type InterviewRecordingKind,
} from "../api";

interface UploadRecordingParams {
  interviewId: number | null;
  questionId?: number;
  file: File | null;
  kind?: InterviewRecordingKind;
}

export const uploadRecordingInBackground = ({
  interviewId,
  questionId,
  file,
  kind,
}: UploadRecordingParams) => {
  if (!file || interviewId == null) {
    return;
  }

  // 답변 파일은 질문 번호가 없으면 서버 채점에 연결할 수 없으므로 보내지 않는다.
  if (kind !== "FULL_INTERVIEW" && questionId == null) {
    return;
  }

  // 업로드를 기다리면 다음 질문 진행이 영상 크기만큼 늦어질 수 있다.
  void uploadInterviewRecording({ interviewId, questionId, file, kind }).then(
    ({ errorMessage }) => {
      if (errorMessage) {
        console.error("녹화 업로드 실패:", errorMessage);
      }
    },
  );
};
