import { createInterview, prepareInterviewRecord, savePersona, setActiveInterviewSessionId, type SavedPersonaData, type SavePersonaParams } from "@/features/interview-page/interview/api";
import type {
  MultiInterviewDraft,
  SubmitInterviewResult,
} from "@/features/interview-page/setting-company/model/draft";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import {
  LEVEL_BY_DIFFICULTY,
  type InterviewerCount,
  type InterviewerTemplate,
} from "@/shared/constants/interview-page/setting-multi-interview";
import { completeSlot, validateSelection } from "./selection";

const buildPersonaName = (template: InterviewerTemplate) => `${template.key}-${crypto.randomUUID()}`;

export const submitMultiInterview = async (
  draft: MultiInterviewDraft,
): Promise<SubmitInterviewResult> => {
  const { answerMode, difficulty, slots, style } = draft;
  const interviewerCount = slots.length as InterviewerCount;
  const validationError = validateSelection(slots, interviewerCount);
  if (validationError) {
    return { ok: false, errorMessage: validationError, requiresMaterials: false };
  }
  const selectedSlots = slots.map(completeSlot);
  let requiresMaterials = false;

  try {
    const savedPersonas: SavedPersonaData[] = [];
    const savedPersonaIds: number[] = [];
    const savedPersonaLabels: string[] = [];

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
      savedPersonas.push(savedPersona);
      savedPersonaIds.push(savedPersona.personaId);
      savedPersonaLabels.push(template.roleLabel);
    }

    const { data: createdInterview, errorMessage: createError } =
      await createInterview({ personaIds: savedPersonaIds });

    if (createError || !createdInterview) {
      throw new Error(
        `${createError ?? "MULTI 면접 생성에 실패했습니다."} (저장된 페르소나 ${savedPersonaIds.length}명: ${savedPersonaLabels.join(", ")})`,
      );
    }

    if (createdInterview.personaIds.length !== interviewerCount ||
      !savedPersonaIds.every((id) => createdInterview.personaIds.includes(id))) {
      throw new Error("생성된 면접의 면접관 정보가 선택한 설정과 일치하지 않습니다.");
    }

    const { data: preparedInterviewRecord, errorMessage: prepareError, statusCode } =
      await prepareInterviewRecord(createdInterview.interviewId);

    if (prepareError || !preparedInterviewRecord) {
      requiresMaterials = statusCode === 404;
      throw new Error(prepareError ?? "질문 준비에 실패했습니다.");
    }

    const representative = selectedSlots[0];
    const interviewSessionId =
      preparedInterviewRecord.sessionId ??
      createdInterview.sessionId;
    setActiveInterviewSessionId(interviewSessionId);

    return {
      ok: true,
      path: `/main/interview/${createdInterview.interviewId}`,
      state: {
        preparedInterview: {
          sessionId: interviewSessionId,
          interviewId: preparedInterviewRecord.interviewId,
          userId: createdInterview.userId,
          personaId: savedPersonaIds[0],
          personaName: representative.name,
          role: representative.role,
          major: savedPersonas[0].major ?? null,
          type: representative.personality,
          personaType: representative.personality,
          level: LEVEL_BY_DIFFICULTY[difficulty],
          career: representative.career,
          gender: representative.gender,
          tone: representative.tone,
          jobId: preparedInterviewRecord.jobId ?? "",
          analysisJobId: preparedInterviewRecord.analysisJobId,
          questionPreparationStatus: preparedInterviewRecord.status,
          status:
            createdInterview.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
          currentQuestionIndex: createdInterview.currentQuestionIndex,
          questions: [],
          mode: "MULTI",
          answerMode,
          interviewers: selectedSlots.map((interviewer, index) =>
            ({
              personaId: savedPersonaIds[index], name: interviewer.name,
              roleLabel: interviewer.roleLabel, image: interviewer.image,
              gender: interviewer.gender, voiceIndex: interviewer.voiceIndex,
              personaType: interviewer.personality, tone: interviewer.tone,
              level: LEVEL_BY_DIFFICULTY[difficulty],
            }),
          ),
        },
        multiInterview: {
          interviewId: createdInterview.interviewId,
          sessionId: createdInterview.sessionId,
          mode: "MULTI",
          personaIds: createdInterview.personaIds,
          interviewers: selectedSlots,
          style,
          difficulty,
        },
      },
    };
  } catch (error) {
    return {
      ok: false,
      errorMessage: extractErrorMessage(error, "MULTI 면접 준비에 실패했습니다."),
      requiresMaterials,
    };
  }
};
