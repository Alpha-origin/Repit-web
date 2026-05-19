import PersonalInfo from "@/widgets/my-page/personal-info";
import Portfolio from "@/widgets/my-page/portfolio";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import * as S from "./style";

const MyPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [portfolioFileError, setPortfolioFileError] = useState("");
  const [gitLink, setGitLink] = useState("");
  const [jobRole, setJobRole] = useState("");

  const handlePortfolioUploadClick = () => {
    const input = fileInputRef.current;
    if (!input) return;
    input.value = "";
    input.click();
  };

  const handlePortfolioFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPortfolioFile(null);
      setPortfolioFileError("");
      return;
    }

    const isPdfFile =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdfFile) {
      setPortfolioFile(null);
      setPortfolioFileError("PDF 파일만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    setPortfolioFile(file);
    setPortfolioFileError("");
  };

  const handleGitLinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGitLink(event.target.value);
  };

  const handleJobRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setJobRole(event.target.value);
  };

  return (
    <S.Page>
      <PersonalInfo />
      <Portfolio
        fileError={portfolioFileError}
        fileInputRef={fileInputRef}
        gitLink={gitLink}
        jobRole={jobRole}
        onGitLinkChange={handleGitLinkChange}
        onJobRoleChange={handleJobRoleChange}
        onPortfolioFileChange={handlePortfolioFileChange}
        onPortfolioUploadClick={handlePortfolioUploadClick}
        selectedPortfolioFile={portfolioFile}
      />
    </S.Page>
  );
};

export default MyPage;
