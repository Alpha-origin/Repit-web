import ProfileGuidance from "@/widgets/interview-page/profile-guidance";
import {
  useMultiInterviewSetup,
} from "@/features/interview-page/setting-multi-interview/model/useMultiInterviewSetup";
import MultiInterviewerSettings from "@/widgets/interview-page/multi-interviewer-settings";
import { INTERVIEWER_COUNT_OPTIONS } from "@/shared/constants/interview-page/setting-multi-interview";
import MultiInterviewerSlots from "@/widgets/interview-page/multi-interviewer-slots";
import SettingOptions from "@/widgets/interview-page/setting-interview/setting-options";
import AnswerModeOptions from "@/widgets/interview-page/setting-interview/answer-mode-options";
import * as S from "@/widgets/interview-page/setting-multi-interview/style";

const SettingMultiInterviewPage = () => {
  const setup = useMultiInterviewSetup();

  return (
    <S.Container>
      <S.Content>
        <S.MainGrid>
          <S.SettingsPanel>
            <AnswerModeOptions
              answerMode={setup.answerMode}
              onAnswerModeChange={setup.onAnswerModeChange}
            />
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
          </S.SettingsPanel>
          <S.InterviewerColumn>
            <S.Section>
              <S.SectionTitle>면접관 수</S.SectionTitle>
              <S.ChoiceRow $columns={3} role="group" aria-label="면접관 수">
                {INTERVIEWER_COUNT_OPTIONS.map((count) => (
                  <S.ChoiceButton key={count} type="button"
                    $selected={setup.selection.interviewerCount === count}
                    aria-pressed={setup.selection.interviewerCount === count}
                    onClick={() => setup.select.count(count)}>{count}명</S.ChoiceButton>
                ))}
              </S.ChoiceRow>
            </S.Section>
            <MultiInterviewerSlots
              activeSlot={setup.selection.activeSlot}
              slots={setup.selection.slots}
              onSelectSlot={setup.select.slot}
            />
            <MultiInterviewerSettings
              slot={setup.selection.slots[setup.selection.activeSlot]}
              otherSlots={setup.selection.slots.filter((_, index) => index !== setup.selection.activeSlot)}
              technical={setup.selection.activeSlot === 0}
              disabled={false}
              onChange={setup.updateSlot}
            />
          </S.InterviewerColumn>
        </S.MainGrid>

        <ProfileGuidance
          message={setup.profileGuidance}
          showMyPageLink={setup.showMyPageLink}
          onRetry={setup.onRefreshProfile}
        />
        {setup.errorMessage ? (
          <S.ErrorMessage role="alert">{setup.errorMessage}</S.ErrorMessage>
        ) : null}

        <S.ActionRow>
          <S.BackButton type="button" onClick={setup.onBack}>
            돌아가기
          </S.BackButton>
          <S.NextButton
            $analyzing={setup.isPortfolioAnalyzing}
            disabled={setup.isNextDisabled}
            type="button"
            onClick={setup.onNext}
          >
            {setup.isPortfolioAnalyzing
              ? (
                <>
                  분석 중<S.LoadingDots aria-hidden="true" />
                </>
              )
              : "다음"}
          </S.NextButton>
        </S.ActionRow>
      </S.Content>
    </S.Container>
  );
};

export default SettingMultiInterviewPage;
