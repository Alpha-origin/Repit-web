import { MAX_JOB_TITLE } from "@/features/my-page/materials/model/materialRules";
import {
  JOB_CATEGORIES,
  getJobRolesByCategory,
  getJobRole,
  type JobCategory,
} from "@/shared/constants/job/jobRoles";

import * as S from "./style";

interface JobSelectionProps {
  category: JobCategory;
  job: string;
  onCategoryChange: (category: JobCategory) => void;
  onJobChange: (job: string) => void;
  jobTitle: string;
  onJobTitleChange: (value: string) => void;
  jobTitleError?: string;
  showJobTitleRetention: boolean;
}

const JobSelection = ({
  category,
  job,
  onCategoryChange,
  onJobChange,
  jobTitle,
  onJobTitleChange,
  jobTitleError,
  showJobTitleRetention,
}: JobSelectionProps) => (
  <S.Section aria-labelledby="my-page-job-title">
    <S.Heading>
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
          aria-label={category === "GENERAL" ? "대분류" : "세부 직무"}
          aria-describedby="my-page-job-hint"
          value={getJobRole(job)?.category === category ? job : ""}
          $isPlaceholder={getJobRole(job)?.category !== category}
          onChange={(event) => onJobChange(event.target.value)}
        >
          <option value="" disabled>{category === "GENERAL" ? "대분류를 선택해 주세요" : "본인의 직무를 선택해주세요."}</option>
          {getJobRolesByCategory(category).map((role) => (
            <option key={role.code} value={role.code}>{role.label}</option>
          ))}
        </S.Select>
        <S.Chevron aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </S.Chevron>
      </S.SelectWrapper>
    </S.Controls>
    <S.Hint id="my-page-job-hint">
      직무에 따라 올릴 자료와 면접 질문이 달라집니다. 직무를 바꾸면 자료가 초기화되고, 개발 직무끼리 바꿀 때는 유지됩니다. IT 외 일반 직군은 대분류를 고르고 직무명을 직접 입력해요.
      {category === "GENERAL" && <><br />IT 서비스 기획·IT 영업은 IT 비개발에서 골라 주세요.</>}
    </S.Hint>
    {category === "GENERAL" && getJobRole(job)?.category === "GENERAL" && (
      <S.JobTitleField>
        <S.FieldTop>
          <label htmlFor="my-page-job-name">직무명</label>
          <S.Count>{jobTitle.length}/{MAX_JOB_TITLE}</S.Count>
        </S.FieldTop>
        <S.JobTitleInput
          id="my-page-job-name"
          value={jobTitle}
          maxLength={MAX_JOB_TITLE}
          placeholder={getJobRole(job)?.jobTitleExample}
          aria-invalid={!!jobTitleError}
          aria-describedby={jobTitleError ? "my-page-job-name-error" : showJobTitleRetention ? "my-page-job-name-retention" : undefined}
          onChange={(event) => onJobTitleChange(event.target.value)}
        />
        {jobTitleError && <S.FieldError id="my-page-job-name-error" role="alert">{jobTitleError}</S.FieldError>}
        {showJobTitleRetention && <S.Hint id="my-page-job-name-retention">직무명을 바꿔도 자료는 그대로예요. 저장하면 새 직무명으로 다시 분석해요.</S.Hint>}
      </S.JobTitleField>
    )}
  </S.Section>
);

export default JobSelection;
