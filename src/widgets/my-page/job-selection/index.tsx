import {
  JOB_CATEGORIES,
  NON_DEVELOPMENT_FAMILIES,
  getJobRolesByCategory,
  type JobCategory,
} from "@/shared/constants/job/jobRoles";

import * as S from "./style";

interface JobSelectionProps {
  category: JobCategory;
  job: string;
  onCategoryChange: (category: JobCategory) => void;
  onJobChange: (job: string) => void;
}

const JobSelection = ({
  category,
  job,
  onCategoryChange,
  onJobChange,
}: JobSelectionProps) => (
  <S.Section aria-labelledby="my-page-job-title">
    <S.Heading>
      <S.SectionNumber aria-hidden="true">01</S.SectionNumber>
      <S.Title id="my-page-job-title">직무</S.Title>
      <S.RequiredBadge>필수</S.RequiredBadge>
    </S.Heading>
    <S.Controls>
      <S.CategoryGroup aria-label="직무 구분">
        {JOB_CATEGORIES.map((option) => (
          <S.CategoryOption key={option.value}>
            <S.CategoryInput
              type="radio"
              name="my-page-job-category"
              value={option.value}
              checked={category === option.value}
              onChange={() => onCategoryChange(option.value)}
            />
            <S.CategoryText>{option.label}</S.CategoryText>
          </S.CategoryOption>
        ))}
      </S.CategoryGroup>
      <S.SelectWrapper>
        <S.Select
          aria-label="세부 직무"
          aria-describedby="my-page-job-hint"
          value={job}
          $isPlaceholder={!job}
          onChange={(event) => onJobChange(event.target.value)}
        >
          <option value="" disabled>본인의 직무를 선택해 주세요</option>
          {category === "DEVELOPMENT"
            ? getJobRolesByCategory(category).map((role) => (
              <option key={role.code} value={role.code}>{role.label}</option>
            ))
            : NON_DEVELOPMENT_FAMILIES.map((family) => (
              <optgroup key={family} label={family}>
                {getJobRolesByCategory(category)
                  .filter((role) => role.family === family)
                  .map((role) => (
                    <option key={role.code} value={role.code}>{role.label}</option>
                  ))}
              </optgroup>
            ))}
        </S.Select>
        <S.Chevron aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </S.Chevron>
      </S.SelectWrapper>
    </S.Controls>
    <S.Hint id="my-page-job-hint">
      개발·비개발을 선택한 뒤, 준비하고 싶은 세부 직무를 선택해 주세요.
    </S.Hint>
  </S.Section>
);

export default JobSelection;
