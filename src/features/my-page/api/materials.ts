import { apiInstance } from "@/shared/api/axiosInstance";
import { getJobRole, type JobRoleCode } from "@/shared/constants/job/jobRoles";

// 01-overview §4.1 C-1. 목록은 서버가 null 대신 빈 목록으로 준다.
export interface MaterialDocument {
  index: number;
  type: string;
  fileUrl: string;
  fileName: string | null;
  pageCount: number | null;
}

export interface MaterialSupplement {
  title: string;
  documentIndex: number | null;
  goal: string;
  role: string;
  decision: string;
  outcome: string;
}

export interface Materials {
  jobRole: JobRoleCode | null;
  documents: MaterialDocument[];
  gitUrls: string[];
  supplements: MaterialSupplement[];
}

interface MaterialsResponse {
  jobRole?: string | null;
  documents?: MaterialDocument[] | null;
  gitUrls?: string[] | null;
  supplements?: MaterialSupplement[] | null;
}

const MATERIALS_URL = "/api/v1/metaData/materials";

export const EMPTY_MATERIALS: Materials = {
  jobRole: null,
  documents: [],
  gitUrls: [],
  supplements: [],
};

export const getMaterials = async (signal?: AbortSignal): Promise<Materials> => {
  const response = await apiInstance.get<MaterialsResponse>(MATERIALS_URL, {
    signal,
    timeout: 15_000,
  });
  const payload = response.data;

  return {
    // 모르는 직무 코드는 직무를 고르지 않은 것으로 본다.
    jobRole: (getJobRole(payload.jobRole)?.code as JobRoleCode | undefined) ?? null,
    documents: payload.documents ?? [],
    gitUrls: payload.gitUrls ?? [],
    supplements: payload.supplements ?? [],
  };
};
