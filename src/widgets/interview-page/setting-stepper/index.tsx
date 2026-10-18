import * as S from "./style";

const STEPS = ["면접 사전설정", "기업 선택", "면접 진입"] as const;

interface SettingStepperProps {
  current: number; // 0부터 시작
}

const SettingStepper = ({ current }: SettingStepperProps) => (
  <S.List aria-label="면접 준비 단계">
    {STEPS.map((label, index) => {
      const state = index < current ? "done" : index === current ? "current" : "next";
      return (
        <S.Item key={label} aria-current={state === "current" ? "step" : undefined}>
          {index > 0 ? <S.Line aria-hidden="true" /> : null}
          <S.StepNumber $state={state}>{index + 1}</S.StepNumber>
          <S.Label $state={state}>{label}</S.Label>
        </S.Item>
      );
    })}
  </S.List>
);

export default SettingStepper;
