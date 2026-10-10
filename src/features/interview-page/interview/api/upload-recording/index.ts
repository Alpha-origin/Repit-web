import { apiInstance } from "@/shared/api/axiosInstance";
import { extractErrorMessage } from "@/shared/api/errorMessage";

export type RecordingEndReason = "user" | "timeout" | "interrupted" | "unknown";

export type UploadInterviewRecordingParams = {
  interviewId: number;
  file: File;
} & (
  | { kind: "ANSWER"; questionId: number; endReason: RecordingEndReason }
  | { kind: "FULL_INTERVIEW"; questionId?: never; endReason?: never }
);

export const uploadInterviewRecording = async (params: UploadInterviewRecordingParams) => {
  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("kind", params.kind);
  if (params.kind === "ANSWER") {
    formData.append("questionId", String(params.questionId));
    formData.append("endReason", params.endReason);
  }

  try {
    const response = await apiInstance.post(
      `/api/interviews/${encodeURIComponent(params.interviewId)}/recordings`,
      formData,
      { timeout: 120_000 },
    );
    return { data: response.data.data, errorMessage: null };
  } catch (error) {
    return {
      data: null,
      errorMessage: extractErrorMessage(error, "녹화 파일 업로드에 실패했습니다."),
    };
  }
};
