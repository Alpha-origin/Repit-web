import { useState } from "react";

import {
  getJobRolesByCategory,
  type JobCategory,
} from "@/shared/constants/job/jobRoles";

export const useJobSelection = () => {
  const [category, setCategory] = useState<JobCategory>("DEVELOPMENT");
  const [job, setJob] = useState("");

  const handleCategoryChange = (nextCategory: JobCategory) => {
    if (category === nextCategory) return;
    setCategory(nextCategory);
    setJob("");
  };

  const handleJobChange = (nextJob: string) => {
    if (getJobRolesByCategory(category).some((role) => role.code === nextJob)) {
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
