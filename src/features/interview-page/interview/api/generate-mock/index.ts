import { apiInstance } from "@/shared/api/axiosInstance";

import {
  getErrorMessage,
  getRecord,
  getTrimmedString,
} from "../shared";
import type { GenerateMockResponse } from "../type";

const GENERATE_MOCK_URL = "/api/v1/ai/generate-mock";

const normalizeGenerateMockResponse = (
  payload: unknown,
): GenerateMockResponse => {
  const responseRecord = getRecord(payload);
  const responseDataRecord = getRecord(responseRecord?.data);
  const sourceRecord = responseDataRecord ?? responseRecord;

  return {
    jobId: getTrimmedString(sourceRecord?.job_id ?? sourceRecord?.jobId),
    status: getTrimmedString(sourceRecord?.status),
    message: getTrimmedString(sourceRecord?.message),
  };
};

export const generateMockInterview = async () => {
  try {
    const response = await apiInstance.post(GENERATE_MOCK_URL);

    return {
      data: normalizeGenerateMockResponse(response.data),
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: getErrorMessage(
        error,
        "모의 면접 생성 요청에 실패했습니다.",
      ),
    };
  }
};
