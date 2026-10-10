import { create } from "zustand";
import { uploadInterviewRecording } from "../api/upload-recording";
import type { UploadInterviewRecordingParams } from "../api/upload-recording";

interface RecordingUploadJob {
  id: string;
  interviewId: number;
  kind: UploadInterviewRecordingParams["kind"];
  questionId?: number;
  status: "UPLOADING" | "SUCCEEDED" | "FAILED";
  errorMessage: string | null;
  canRetry: boolean;
}
interface RecordingUploadState {
  jobs: RecordingUploadJob[];
}

export const useRecordingUploadStore = create<RecordingUploadState>(() => ({ jobs: [] }));
const files = new Map<string, UploadInterviewRecordingParams>();
const requests = new Map<string, Promise<void>>();

const runUpload = (id: string) => {
  const params = files.get(id);
  if (!params || requests.has(id)) return;
  useRecordingUploadStore.setState((state) => ({
    jobs: state.jobs.map((job) => job.id === id ? { ...job, status: "UPLOADING", errorMessage: null } : job),
  }));
  const request = uploadInterviewRecording(params).then(({ errorMessage }) => {
    if (!errorMessage) files.delete(id);
    useRecordingUploadStore.setState((state) => ({
      jobs: state.jobs.map((job) => job.id === id ? {
        ...job, status: errorMessage ? "FAILED" : "SUCCEEDED", errorMessage,
      } : job),
    }));
  }).finally(() => { requests.delete(id); });
  requests.set(id, request);
};

export const enqueueRecordingUpload = (params: UploadInterviewRecordingParams) => {
  const id = crypto.randomUUID();
  files.set(id, params);
  useRecordingUploadStore.setState((state) => ({
    jobs: [...state.jobs, {
      id, interviewId: params.interviewId, kind: params.kind,
      ...(params.kind === "ANSWER" ? { questionId: params.questionId } : {}),
      status: "UPLOADING", errorMessage: null, canRetry: true,
    }],
  }));
  runUpload(id);
};

export const reportRecordingFailure = (params: {
  interviewId: number;
  kind: UploadInterviewRecordingParams["kind"];
  questionId?: number;
  errorMessage: string;
}) => {
  useRecordingUploadStore.setState((state) => ({
    jobs: [...state.jobs, { ...params, id: crypto.randomUUID(), status: "FAILED", canRetry: false }],
  }));
};

export const retryRecordingUpload = (id: string) => { runUpload(id); };
export const dismissRecordingUpload = (id: string) => {
  if (requests.has(id)) return;
  files.delete(id);
  useRecordingUploadStore.setState((state) => ({ jobs: state.jobs.filter((job) => job.id !== id) }));
};
export const waitForRecordingUploads = async () => {
  while (requests.size) await Promise.all([...requests.values()]);
  return files.size === 0;
};
export const hasUnsavedRecordings = () => files.size > 0;
