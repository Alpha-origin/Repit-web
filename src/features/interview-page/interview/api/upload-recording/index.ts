import { apiInstance } from "@/shared/api/axiosInstance";
import { extractErrorMessage } from "@/shared/api/errorMessage";

interface UploadInterviewRecordingParams {
  interviewId: number;
  questionId?: number | null;
  file: File;
}

export const uploadInterviewRecording = async ({
  interviewId,
  questionId,
  file,
}: UploadInterviewRecordingParams) => {
  const formData = new FormData();
  formData.append("file", file);

  if (questionId != null) {
    formData.append("questionId", String(questionId));
  }

  try {
    const response = await apiInstance.post(
      `/api/interviews/${encodeURIComponent(interviewId)}/recordings`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return { data: response.data.data, errorMessage: null };
  } catch (error) {
    return {
      data: null,
      errorMessage: extractErrorMessage(error, "녹화 파일 업로드에 실패했습니다."),
    };
  }
};
