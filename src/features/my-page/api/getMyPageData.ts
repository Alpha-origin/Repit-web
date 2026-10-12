import {
  apiInstance,
  ensureAccessToken,
} from "@/shared/api/axiosInstance";

export interface MyPageMetaData {
  gitUrls: string[];
  fileUrl: string;
}

interface MetaDataResponse {
  data?: MyPageMetaData;
}

interface MetaDataUploadResponse {
  job_id?: string;
  jobId?: string;
  status?: string;
  message?: string;
  data?: MetaDataUploadResponse;
}

const META_DATA_URL = "/api/v1/metaData/getMetaData";
const META_DATA_UPLOAD_URL = "/api/v1/metaData/dataUpload";

export { getLatestProfile } from "@/features/profile/api";

export const getMyPageMetaData = async (signal?: AbortSignal) => {
  const response = await apiInstance.get<MyPageMetaData | MetaDataResponse>(
    META_DATA_URL,
    { signal, timeout: 15_000 },
  );
  const payload = response.data;

  if ("data" in payload && payload.data) {
    return payload.data;
  }

  return payload as MyPageMetaData;
};

interface UploadMyPageMetaDataParams {
  file: File;
  gitUrls: string[];
}

export const uploadMyPageMetaData = async ({
  file,
  gitUrls,
}: UploadMyPageMetaDataParams) => {
  const authorizationHeader = await ensureAccessToken();
  const formData = new FormData();
  formData.append("file", file);
  gitUrls.forEach((gitUrl) => {
    formData.append("gitUrls", gitUrl);
  });

  const response = await apiInstance.post<MetaDataUploadResponse>(
    META_DATA_UPLOAD_URL,
    formData,
    {
      headers: {
        Authorization: authorizationHeader,
      },
    },
  );

  const payload = response.data.data ?? response.data;

  return {
    jobId: payload.jobId ?? payload.job_id ?? null,
    gitUrls,
    fileUrl: "",
  } satisfies MyPageMetaData & { jobId: string | null };
};
