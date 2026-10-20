import { useEffect } from "react";
import {
  dismissRecordingUpload,
  hasUnsavedRecordings,
  retryRecordingUpload,
  useRecordingUploadStore,
} from "@/features/interview-page/interview/model/interviewRecordingStore";
import * as S from "./style";

const RecordingUploads = () => {
  const jobs = useRecordingUploadStore((state) => state.jobs);
  const visibleJobs = jobs.filter((job) => job.kind !== "ANSWER" || job.status !== "SUCCEEDED");
  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedRecordings()) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, []);
  if (!visibleJobs.length) return null;
  return (
    <S.Panel aria-label="면접 녹화 업로드 상태">
      {visibleJobs.map((job) => (
        <S.Job key={job.id}>
          <div role={job.status === "FAILED" ? "alert" : "status"}>
            면접 {job.interviewId} · {job.kind === "ANSWER" ? `질문 ${job.questionId} 음성` : "전체 영상"}
            <S.Message>
              {job.status === "UPLOADING" ? "업로드 중입니다. 새로고침하거나 탭을 닫지 마세요."
                : job.status === "FAILED" ? job.errorMessage : "업로드 완료"}
            </S.Message>
          </div>
          {job.status === "FAILED" && job.canRetry && (
            <S.Button type="button" onClick={() => retryRecordingUpload(job.id)}>다시 시도</S.Button>
          )}
          {job.status !== "UPLOADING" && (
            <S.Button type="button" onClick={() => dismissRecordingUpload(job.id)}>
              {job.status === "FAILED" && job.canRetry ? "파일 폐기" : "닫기"}
            </S.Button>
          )}
        </S.Job>
      ))}
    </S.Panel>
  );
};
export default RecordingUploads;
