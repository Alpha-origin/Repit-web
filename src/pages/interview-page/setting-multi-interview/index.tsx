import {
  useMultiInterviewSetup,
} from "@/features/interview-page/setting-multi-interview/model/useMultiInterviewSetup";
import MultiInterviewerSettings from "@/widgets/interview-page/multi-interviewer-settings";
import { INTERVIEWER_COUNT_OPTIONS } from "@/shared/constants/interview-page/setting-multi-interview";
import MultiInterviewerSlots from "@/widgets/interview-page/multi-interviewer-slots";
import SettingOptions from "@/widgets/interview-page/setting-interview/setting-options";
import * as S from "@/widgets/interview-page/setting-multi-interview/style";

const SettingMultiInterviewPage = () => {
  const setup = useMultiInterviewSetup();

  return (
    <S.Container>
      <S.Content>
        <S.MainGrid>
          <S.OptionsLock disabled={setup.isSubmitting}>
          <SettingOptions
            onSelect={{
              difficulty: setup.select.difficulty,
              style: setup.select.style,
            }}
            selection={{
              difficulty: setup.selection.difficulty,
              style: setup.selection.style,
            }}
          />

          </S.OptionsLock>
          <S.InterviewerColumn>
            <S.Section>
              <S.SectionTitle>면접관 수</S.SectionTitle>
              <S.ChoiceRow $columns={3} role="group" aria-label="면접관 수">
                {INTERVIEWER_COUNT_OPTIONS.map((count) => (
                  <S.ChoiceButton key={count} type="button" disabled={setup.isSubmitting}
                    $selected={setup.selection.interviewerCount === count}
                    aria-pressed={setup.selection.interviewerCount === count}
                    onClick={() => setup.select.count(count)}>{count}명</S.ChoiceButton>
                ))}
              </S.ChoiceRow>
            </S.Section>
            <MultiInterviewerSlots
              disabled={setup.isSubmitting}
              activeSlot={setup.selection.activeSlot}
              slots={setup.selection.slots}
              onSelectSlot={setup.select.slot}
            />
            <MultiInterviewerSettings
              slot={setup.selection.slots[setup.selection.activeSlot]}
              otherSlots={setup.selection.slots.filter((_, index) => index !== setup.selection.activeSlot)}
              technical={setup.selection.activeSlot === 0}
              disabled={setup.isSubmitting}
              onChange={setup.updateSlot}
            />
          </S.InterviewerColumn>
        </S.MainGrid>

        {setup.errorMessage ? (
          <S.ErrorMessage role="alert">{setup.errorMessage}</S.ErrorMessage>
        ) : null}

        <S.ActionRow>
          <S.BackButton disabled={setup.isSubmitting} type="button" onClick={setup.onBack}>
            돌아가기
          </S.BackButton>
          <S.NextButton
            $analyzing={setup.isPortfolioAnalyzing}
            disabled={setup.isNextDisabled}
            type="button"
            onClick={setup.onNext}
          >
            {setup.isSubmitting
              ? "시작 중..."
              : setup.isPortfolioAnalyzing
                ? (
                  <>
                    분석 중<S.LoadingDots aria-hidden="true" />
                  </>
                )
                : "다음"}
          </S.NextButton>
        </S.ActionRow>
      </S.Content>

      {setup.isSubmitting ? (
        <S.LoadingOverlay role="status" aria-live="polite">
          <S.LoadingSpinner aria-hidden="true" />
          <S.LoadingText>면접관과 질문을 준비하고 있습니다</S.LoadingText>
        </S.LoadingOverlay>
      ) : null}
    </S.Container>
  );
};

export default SettingMultiInterviewPage;
