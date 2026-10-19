export interface SettingActionsProps {
  isBusy: boolean;
  isNextDisabled: boolean;
  isPortfolioAnalyzing: boolean;
  nextLabel?: string;
  onBack: () => void;
  onNext: () => void;
}
