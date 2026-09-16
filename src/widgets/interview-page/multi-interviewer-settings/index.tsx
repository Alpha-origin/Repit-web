import {
  MULTI_INTERVIEWER_TEMPLATES, PERSONALITY_OPTIONS, TONE_OPTIONS, ROLE_OPTIONS,
  type InterviewerSlot,
} from "@/shared/constants/interview-page/setting-multi-interview";
import * as S from "@/widgets/interview-page/setting-multi-interview/style";

interface Props {
  slot: InterviewerSlot;
  otherSlots: readonly InterviewerSlot[];
  technical: boolean;
  disabled: boolean;
  onChange: (patch: Partial<InterviewerSlot>) => void;
}

const MultiInterviewerSettings = ({ slot, otherSlots, technical, disabled, onChange }: Props) => (
  <S.SettingsPanel disabled={disabled}>
    <S.Section>
      <S.SectionTitle>성격/분위기</S.SectionTitle>
      <S.ChoiceRow $columns={3} role="group" aria-label="성격">
        {PERSONALITY_OPTIONS.map((option) => (
          <S.ChoiceButton key={option.value} type="button" $selected={slot.personality === option.value}
            aria-pressed={slot.personality === option.value} onClick={() => onChange({ personality: option.value })}>
            {option.label}
          </S.ChoiceButton>
        ))}
      </S.ChoiceRow>
      <S.ChoiceRow $columns={3} role="group" aria-label="말투">
        {TONE_OPTIONS.map((option) => (
          <S.ChoiceButton key={option.value} type="button" $selected={slot.tone === option.value}
            aria-pressed={slot.tone === option.value} onClick={() => onChange({ tone: option.value })}>
            {option.label}
          </S.ChoiceButton>
        ))}
      </S.ChoiceRow>
    </S.Section>
    <S.Section>
      <S.SectionTitle>{technical ? "전문 분야" : "역할"}</S.SectionTitle>
      <S.ChoiceRow $columns={technical ? 2 : 4} role="group" aria-label={technical ? "전문 분야" : "역할"}>
        {technical ? ([{ value: "BACKEND", label: "백엔드" }, { value: "FRONTEND", label: "프론트엔드" }] as const).map((option) => (
          <S.ChoiceButton key={option.value} type="button" $selected={slot.major === option.value}
            aria-pressed={slot.major === option.value} onClick={() => onChange({ major: option.value })}>
            {option.label}
          </S.ChoiceButton>
        )) : ROLE_OPTIONS.map((option) => {
          const alreadySelected = otherSlots.some((other) => other.role === option.value);

          return (
            <S.ChoiceButton key={option.value} type="button" $selected={slot.role === option.value}
              $unavailable={alreadySelected} disabled={disabled || alreadySelected}
              title={alreadySelected ? "다른 슬롯에서 선택한 역할입니다." : undefined}
              aria-pressed={slot.role === option.value} onClick={() => onChange({ role: option.value })}>
              {option.label}
              {alreadySelected ? <S.SelectedLabel>선택됨</S.SelectedLabel> : null}
            </S.ChoiceButton>
          );
        })}
      </S.ChoiceRow>
    </S.Section>
    <S.Section>
      <S.SectionTitle>면접관</S.SectionTitle>
      <S.IdentityRow role="group" aria-label="면접관 선택">
        {MULTI_INTERVIEWER_TEMPLATES.map((interviewer) => {
          const alreadySelected = otherSlots.some((other) => other.interviewer?.key === interviewer.key);

          return (
            <S.IdentityButton key={interviewer.key} type="button" $selected={slot.interviewer?.key === interviewer.key}
              $unavailable={alreadySelected} disabled={disabled || alreadySelected}
              title={alreadySelected ? "다른 슬롯에서 선택한 면접관입니다." : undefined}
              aria-pressed={slot.interviewer?.key === interviewer.key} onClick={() => onChange({ interviewer })}>
              <S.IdentityImage src={interviewer.image} alt="" />
              {interviewer.name}
              {alreadySelected ? <S.SelectedLabel>선택됨</S.SelectedLabel> : null}
            </S.IdentityButton>
          );
        })}
      </S.IdentityRow>
    </S.Section>
  </S.SettingsPanel>
);

export default MultiInterviewerSettings;
