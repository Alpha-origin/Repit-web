import type {
  CreateInterviewParams,
  CreateInterviewPersonaType,
  InterviewPersonaGender,
  InterviewPersonaMajor,
} from "./create-interview";

export type SavePersonaParams = CreateInterviewParams;

export interface SavedPersonaData {
  personaId: number;
  personaName: string;
  major: InterviewPersonaMajor;
  type: CreateInterviewPersonaType;
  career: number;
  gender: InterviewPersonaGender;
}
