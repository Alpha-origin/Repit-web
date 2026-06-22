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
    major:
      (getTrimmedString(sourceRecord?.major) as SavedPersonaData["major"] | null) ??
      fallbackData.major,
    type:
      (getTrimmedString(sourceRecord?.type) as SavedPersonaData["type"] | null) ??
      fallbackData.type,
    career: getNumericValue(sourceRecord?.career) ?? fallbackData.career,
    gender:
      (getTrimmedString(sourceRecord?.gender) as SavedPersonaData["gender"] | null) ??
      fallbackData.gender,
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
