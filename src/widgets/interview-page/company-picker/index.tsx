import {
  COMPANY_CATEGORY_LABELS,
  COMPANY_CATEGORY_ORDER,
  COMPANY_LEGAL_SIZE_LABELS,
  formatDataAsOf,
} from "@/features/interview-page/company/model/companyLabels";
import type { CompanySummary } from "@/features/interview-page/company/model/type";
import type { CompanyCategoryFilter } from "@/features/interview-page/setting-company/model/useCompanySetup";
import * as S from "./style";
import type { CompanyPickerProps } from "./type";

const CATEGORY_FILTERS: { value: CompanyCategoryFilter; label: string }[] = [
  { value: "ALL", label: "전체" },
  ...COMPANY_CATEGORY_ORDER.map((value) => ({
    value,
    label: COMPANY_CATEGORY_LABELS[value],
  })),
];

const getInitial = (displayName: string) =>
  displayName.replace(/^샘플/, "").charAt(0) || displayName.charAt(0);

const getMeta = (company: CompanySummary) => {
  const category = COMPANY_CATEGORY_LABELS[company.category];
  return company.legalSize
    ? `${category} · ${COMPANY_LEGAL_SIZE_LABELS[company.legalSize]}`
    : category;
};

const CompanyPicker = ({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  companies,
  selectedCompanyId,
  onSelect,
  disabled,
  listState,
  emptyMessage,
}: CompanyPickerProps) => (
  <S.Container>
    <S.Toolbar>
      <S.SearchField>
        <S.SearchIcon aria-hidden="true" />
        <S.SearchInput
          type="search"
          maxLength={30}
          value={query}
          disabled={disabled}
          placeholder="기업 이름으로 검색"
          aria-label="기업 이름으로 검색"
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </S.SearchField>
      <S.ChipGroup role="group" aria-label="기업 분류">
        {CATEGORY_FILTERS.map((filter) => (
          <S.Chip
            key={filter.value}
            type="button"
            disabled={disabled}
            $selected={category === filter.value}
            aria-pressed={category === filter.value}
            onClick={() => onCategoryChange(filter.value)}
          >
            {filter.label}
          </S.Chip>
        ))}
      </S.ChipGroup>
    </S.Toolbar>

    <S.Grid role="radiogroup" aria-label="기업 선택">
      <S.Card
        $selected={selectedCompanyId === null}
      >
        <S.RadioInput type="radio" name="company" checked={selectedCompanyId === null}
          disabled={disabled} onChange={() => onSelect(null)} aria-label="선택 안 함" />
        <S.CardTop>
          <S.Badge $selected={false} $muted>—</S.Badge>
          <S.Names>
            <S.Name>선택 안 함</S.Name>
            <S.SubName>기업 없이 기본 면접으로 진행</S.SubName>
          </S.Names>
          <S.Radio $selected={selectedCompanyId === null} />
        </S.CardTop>
        <S.CardNote>지금까지와 같은 방식의 연습 면접이에요</S.CardNote>
      </S.Card>

      {(listState === "success" ? companies : []).map((company) => {
        const selected = selectedCompanyId === company.companyId;
        return (
          <S.Card
            key={company.companyId}
            $selected={selected}
          >
            <S.RadioInput type="radio" name="company" checked={selected}
              disabled={disabled} onChange={() => onSelect(company.companyId)} aria-label={company.displayName} />
            <S.CardTop>
              <S.Badge $selected={selected}>{getInitial(company.displayName)}</S.Badge>
              <S.Names>
                <S.Name>{company.displayName}</S.Name>
                {company.legalName !== company.displayName ? (
                  <S.SubName>{company.legalName}</S.SubName>
                ) : null}
              </S.Names>
              <S.Radio $selected={selected} />
            </S.CardTop>
            <S.CardBottom>
              <S.Meta>{getMeta(company)}</S.Meta>
              <S.TagRow>
                <S.Tags>
                  {company.talentKeywords.slice(0, 3).map((keyword) => (
                    <S.Tag key={keyword} $selected={selected}>#{keyword}</S.Tag>
                  ))}
                </S.Tags>
                <S.AsOf>{formatDataAsOf(company.dataAsOf)}</S.AsOf>
              </S.TagRow>
            </S.CardBottom>
          </S.Card>
        );
      })}

      {listState === "success" && companies.length === 0 ? (
        <S.Empty role="status">{emptyMessage}</S.Empty>
      ) : null}
    </S.Grid>
    {listState === "loading" ? <S.Empty role="status">기업 목록을 불러오고 있어요</S.Empty> : null}
  </S.Container>
);

export default CompanyPicker;
