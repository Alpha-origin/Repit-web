import { useState } from "react";

import {
  getJobRole,
  getJobRolesByCategory,
  type JobCategory,
} from "@/shared/constants/job/jobRoles";

// savedJob: 서버에 저장된 직무. 사용자가 직접 고르기 전까지만 화면 값으로 채운다.
export const useJobSelection = (savedJob?: string | null) => {
  const [category, setCategory] = useState<JobCategory>("DEVELOPMENT");
  const [job, setJob] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [appliedSavedJob, setAppliedSavedJob] = useState<string | null>(null);

  const savedRole = getJobRole(savedJob);
  if (savedRole && !isEdited && appliedSavedJob !== savedRole.code) {
    setAppliedSavedJob(savedRole.code);
    setCategory(savedRole.category);
    setJob(savedRole.code);
  }

  const handleCategoryChange = (nextCategory: JobCategory) => {
    if (category === nextCategory) return;
    setIsEdited(true);
    setCategory(nextCategory);
    setJob("");
  };

  const handleJobChange = (nextJob: string) => {
    if (getJobRolesByCategory(category).some((role) => role.code === nextJob)) {
      setIsEdited(true);
      setJob(nextJob);
    }
  };

  return {
    category,
    job,
    onCategoryChange: handleCategoryChange,
    onJobChange: handleJobChange,
  };
};
