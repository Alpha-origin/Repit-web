import type { CompanySummary } from "@/features/interview-page/company/model/type";
import type { CompanyCategoryFilter } from "@/features/interview-page/setting-company/model/useCompanySetup";

export interface CompanyPickerProps {
  listState: "loading" | "success" | "error";
  emptyMessage: string;
  query: string;
  onQueryChange: (value: string) => void;
  category: CompanyCategoryFilter;
  onCategoryChange: (value: CompanyCategoryFilter) => void;
  companies: CompanySummary[];
  selectedCompanyId: number | null;
  onSelect: (companyId: number | null) => void;
  disabled: boolean;
}

export interface SelectedProps {
  $selected: boolean;
}
