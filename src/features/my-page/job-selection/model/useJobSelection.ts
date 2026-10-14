import { useState } from "react";

import {
  JOB_OPTIONS,
  type JobCategory,
} from "@/shared/constants/my-page/job";

export const useJobSelection = () => {
  const [category, setCategory] = useState<JobCategory>("DEVELOPMENT");
  const [job, setJob] = useState("");

  const handleCategoryChange = (nextCategory: JobCategory) => {
    if (category === nextCategory) return;
    setCategory(nextCategory);
    setJob("");
  };

  const handleJobChange = (nextJob: string) => {
    if (JOB_OPTIONS[category].some((option) => option.value === nextJob)) {
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
