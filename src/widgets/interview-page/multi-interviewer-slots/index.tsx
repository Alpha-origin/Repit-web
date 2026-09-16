import {
  getRoleLabel, PERSONALITY_OPTIONS, TONE_OPTIONS,
  type InterviewerSlot, type SlotIndex,
} from "@/shared/constants/interview-page/setting-multi-interview";
import * as S from "@/widgets/interview-page/setting-multi-interview/style";

interface MultiInterviewerSlotsProps {
  activeSlot: SlotIndex;
  slots: readonly InterviewerSlot[];
  disabled?: boolean;
  onSelectSlot: (slot: SlotIndex) => void;
}

const MultiInterviewerSlots = ({ activeSlot, slots, disabled, onSelectSlot }: MultiInterviewerSlotsProps) => (
  <S.Section aria-labelledby="multi-interviewer-slots-title">
    <S.SectionTitle id="multi-interviewer-slots-title">면접관 선택</S.SectionTitle>
    <S.SlotGrid $count={slots.length}>
      {slots.map((slot, index) => (
        <S.SlotButton key={index} $active={activeSlot === index}
          $filled={Boolean(slot.interviewer && slot.role)} disabled={disabled}
          aria-label={`면접관 ${index + 1} 설정`} aria-pressed={activeSlot === index}
          type="button" onClick={() => onSelectSlot(index as SlotIndex)}>
          {slot.interviewer ? <S.SlotImage src={slot.interviewer.image} alt="" /> : null}
          <S.SlotBody>
            <S.SlotNumber>Slot {index + 1}</S.SlotNumber>
            {slot.role ? <S.SlotName>{getRoleLabel(slot.role)}</S.SlotName> : null}
            {slot.interviewer ? <S.SlotRole>{slot.interviewer.name}</S.SlotRole> : null}
            {slot.interviewer && slot.role ? (
              <S.SlotSpecialty>
                {PERSONALITY_OPTIONS.find((item) => item.value === slot.personality)?.label} · {TONE_OPTIONS.find((item) => item.value === slot.tone)?.label}
              </S.SlotSpecialty>
            ) : null}
            <S.SlotPrompt>면접관 설정</S.SlotPrompt>
          </S.SlotBody>
        </S.SlotButton>
      ))}
    </S.SlotGrid>
  </S.Section>
);

export default MultiInterviewerSlots;
