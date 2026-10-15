import { apiInstance } from "@/shared/api/axiosInstance";

import {
  getErrorMessage,
  getNumericValue,
  getRecord,
  getTrimmedString,
} from "../shared";
import type { SavePersonaParams, SavedPersonaData } from "../type";

const SAVE_PERSONA_URL = "/api/persona/save";

const normalizeSavedPersona = (
  payload: unknown,
  fallbackData: SavePersonaParams,
) => {
  const responseRecord = getRecord(payload);
  const responseDataRecord = getRecord(responseRecord?.data);
  const sourceRecord = responseDataRecord ?? responseRecord;
  const personaId = getNumericValue(sourceRecord?.personaId);

  if (personaId === null) {
    return null;
  }

  return {
    personaId,
    personaName:
      getTrimmedString(sourceRecord?.personaName) ?? fallbackData.personaName,
    role:
      (getTrimmedString(sourceRecord?.role) as SavedPersonaData["role"] | null) ??
      fallbackData.role,
    major:
      (getTrimmedString(sourceRecord?.major) as SavedPersonaData["major"] | null) ??
      null,
    type:
      (getTrimmedString(sourceRecord?.type) as SavedPersonaData["type"] | null) ??
      fallbackData.type,
    tone:
      (getTrimmedString(sourceRecord?.tone) as SavedPersonaData["tone"] | null) ??
      fallbackData.tone,
    level:
      (getTrimmedString(sourceRecord?.level) as SavedPersonaData["level"] | null) ??
      fallbackData.level,
    career: getNumericValue(sourceRecord?.career) ?? fallbackData.career,
    gender:
      (getTrimmedString(sourceRecord?.gender) as SavedPersonaData["gender"] | null) ??
      fallbackData.gender,
    imageUrl:
      getTrimmedString(sourceRecord?.imageUrl) ?? fallbackData.imageUrl,
    description:
      getTrimmedString(sourceRecord?.description) ?? fallbackData.description,
  } satisfies SavedPersonaData;
};

export const savePersona = async (params: SavePersonaParams) => {
  try {
    const response = await apiInstance.post(SAVE_PERSONA_URL, params);
    const responseRecord = getRecord(response.data);

    if (responseRecord?.success === false) {
      return {
        data: null,
        errorMessage: "페르소나 저장에 실패했습니다.",
      };
    }

    const savedPersona = normalizeSavedPersona(response.data, params);

    if (!savedPersona) {
      return {
        data: null,
        errorMessage: "저장된 페르소나 정보를 받지 못했습니다.",
      };
    }

    return {
      data: savedPersona,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: getErrorMessage(error, "페르소나 저장에 실패했습니다."),
    };
  }
};
