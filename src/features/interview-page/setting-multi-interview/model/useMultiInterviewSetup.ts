import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInterview, prepareInterviewRecord, savePersona, setActiveInterviewSessionId, type SavePersonaParams } from "@/features/interview-page/interview/api";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import {
  LEVEL_BY_DIFFICULTY,
  type InterviewerCount, type InterviewerSlot, type MultiInterviewSelection,
  type InterviewerTemplate, type SlotIndex,
} from "@/shared/constants/interview-page/setting-multi-interview";
import { INTERVIEW_SETTING_DEFAULT_SELECTION, type InterviewDifficultyOption, type InterviewStyleOption } from "@/shared/constants/interview-page/setting-interview";
import { completeSlot, createSlot, resizeSlots, validateSelection } from "./selection";

const buildPersonaName = (template: InterviewerTemplate) => `${template.key}-${crypto.randomUUID()}`;

export const useMultiInterviewSetup = () => {
  const navigate = useNavigate();
  const [style, setStyle] = useState<InterviewStyleOption>(INTERVIEW_SETTING_DEFAULT_SELECTION.style);
  const [difficulty, setDifficulty] = useState<InterviewDifficultyOption>(INTERVIEW_SETTING_DEFAULT_SELECTION.difficulty);
  const [activeSlot, setActiveSlot] = useState<SlotIndex>(0);
  const [slots, setSlots] = useState<InterviewerSlot[]>(() => Array.from({ length: 3 }, (_, i) => createSlot(i)));
  const interviewerCount = slots.length as InterviewerCount;
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const updateSlot = (patch: Partial<InterviewerSlot>) => {
    if (submittingRef.current) return;
    if (patch.role && (activeSlot === 0 ? patch.role !== "TECH" : patch.role === "TECH")) return;
    if (patch.role && slots.some((slot, index) => index !== activeSlot && slot.role === patch.role)) {
      setErrorMessage("같은 역할을 중복 선택할 수 없습니다.");
      return;
    }
    if (patch.interviewer && slots.some((slot, index) => index !== activeSlot && slot.interviewer?.key === patch.interviewer?.key)) {
      setErrorMessage("같은 면접관을 중복 선택할 수 없습니다.");
      return;
    }
    setSlots((previous) => previous.map((slot, index) => index === activeSlot ? { ...slot, ...patch } : slot));
    setErrorMessage("");
  };

  const changeCount = (count: InterviewerCount) => {
    if (submittingRef.current) return;
    setSlots((previous) => resizeSlots(previous, count));
    setActiveSlot((previous) => Math.min(previous, count - 1) as SlotIndex);
    setErrorMessage("");
  };

  // 면접 스타일은 난이도와 같은 독립 설정값이다.
  // 면접관별 성격·말투는 슬롯이 직접 들고 있으므로 여기서 건드리지 않는다.
  const changeStyle = (next: InterviewStyleOption) => {
    if (submittingRef.current) return;
    setStyle(next);
    setErrorMessage("");
  };

  const handleNext = async () => {
    if (submittingRef.current) return;
    const validationError = validateSelection(slots, interviewerCount);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    const selectedSlots = slots.map(completeSlot);
    setErrorMessage("");
    try {
      setIsSubmitting(true);
      submittingRef.current = true;

      const savedPersonaIds: number[] = [];
      const savedPersonaLabels: string[] = [];

      for (const template of selectedSlots) {
        const personaPayload: SavePersonaParams = {
          personaName: buildPersonaName(template),
          role: template.role,
          major: template.role === "TECH" ? template.major ?? null : null,
          type: template.personality,
          tone: template.tone,
          level: LEVEL_BY_DIFFICULTY[difficulty],
          career: template.career,
          gender: template.gender,
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

      const { data: preparedInterviewRecord, errorMessage: prepareError } =
        await prepareInterviewRecord(createdInterview.interviewId);

      if (prepareError || !preparedInterviewRecord) {
        throw new Error(prepareError ?? "질문 준비에 실패했습니다.");
      }

      const representative = selectedSlots[0];
      const interviewSessionId =
        preparedInterviewRecord.sessionId ??
        createdInterview.sessionId;
      setActiveInterviewSessionId(interviewSessionId);

      navigate(`/main/interview/${createdInterview.interviewId}`, {
        state: {
          preparedInterview: {
            sessionId: interviewSessionId,
            interviewId: preparedInterviewRecord.interviewId,
            userId: createdInterview.userId,
            personaId: savedPersonaIds[0],
            personaName: representative.name,
            role: representative.role,
            major: representative.major ?? null,
            type: representative.personality,
            personaType: representative.personality,
            level: LEVEL_BY_DIFFICULTY[difficulty],
            career: representative.career,
            gender: representative.gender,
            tone: representative.tone,
            jobId: preparedInterviewRecord.jobId ?? "",
            status:
              createdInterview.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
            currentQuestionIndex: createdInterview.currentQuestionIndex,
            questions: [],
            mode: "MULTI",
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
      });
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, "MULTI 면접 준비에 실패했습니다."));
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  return {
    errorMessage, isPortfolioAnalyzing: false, isSubmitting,
    isNextDisabled: isSubmitting,
    onBack: () => navigate(-1), onNext: handleNext, updateSlot,
    select: {
      count: changeCount,
      difficulty: (next: InterviewDifficultyOption) => { if (!submittingRef.current) setDifficulty(next); },
      slot: (slot: SlotIndex) => {
        if (!submittingRef.current && slot < slots.length) { setActiveSlot(slot); setErrorMessage(""); }
      },
      style: changeStyle,
    },
    selection: { activeSlot, difficulty, slots, style, interviewerCount } satisfies MultiInterviewSelection,
  };
};
