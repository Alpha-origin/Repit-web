import { savePersona, type CreateInterviewParams, type SavePersonaParams } from "@/features/interview-page/interview/api";
import type {
  MultiInterviewDraft,
} from "@/features/interview-page/setting-company/model/draft";
import {
  LEVEL_BY_DIFFICULTY,
  type InterviewerCount,
  type InterviewerTemplate,
} from "@/shared/constants/interview-page/setting-multi-interview";
import { completeSlot, validateSelection } from "./selection";

const buildPersonaName = (template: InterviewerTemplate) => `${template.key}-${crypto.randomUUID()}`;

export const buildMultiInterviewPayload = async (
  draft: MultiInterviewDraft,
): Promise<CreateInterviewParams> => {
  const { difficulty, slots } = draft;
  const interviewerCount = slots.length as InterviewerCount;
  const validationError = validateSelection(slots, interviewerCount);
  if (validationError) {
    throw new Error(validationError);
  }
  const selectedSlots = slots.map(completeSlot);

  const savedPersonaIds: number[] = [];

  for (const template of selectedSlots) {
    const personaPayload: SavePersonaParams = {
      personaName: buildPersonaName(template),
      role: template.role,
      type: template.personality,
      tone: template.tone,
      level: LEVEL_BY_DIFFICULTY[difficulty],
      career: template.career,
      gender: template.gender,
      voiceIndex: template.voiceIndex,
      imageUrl: template.image,
      description: template.description,
    };
    const { data: savedPersona, errorMessage: savePersonaError } =
      await savePersona(personaPayload);

    if (savePersonaError || !savedPersona) {
      const failureMessage = `${template.roleLabel} 면접관 저장에 실패했습니다.`;
      const savedPersonaMessage =
        savedPersonaIds.length > 0
          ? ` 이미 저장된 ${savedPersonaIds.length}명은 서버에 남아있을 수 있습니다.`
          : "";

      throw new Error(
        `${failureMessage}${savedPersonaMessage}${
          savePersonaError ? ` (${savePersonaError})` : ""
        }`,
      );
    }

    if (!Number.isInteger(savedPersona.personaId) || savedPersona.personaId <= 0 || savedPersonaIds.includes(savedPersona.personaId)) {
      throw new Error("면접관 저장 응답이 올바르지 않습니다.");
    }
    savedPersonaIds.push(savedPersona.personaId);
  }

  return { personaIds: savedPersonaIds };
};
