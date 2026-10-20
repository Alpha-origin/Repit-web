import type { MaterialError } from "@/features/my-page/api/materials";
import { getDocumentTypeLabel } from "@/shared/constants/job/documentTypes";

// 서버 검사(MaterialsValidator)와 같은 한도. 06 §3.3, Web 수정 사항 4.7.
export const MAX_JOB_TITLE = 30;
export const MAX_COVER_LETTERS = 5;
export const MAX_COVER_LETTER_QUESTION = 200;
export const MAX_COVER_LETTER_ANSWER = 2000;
export const MAX_DOCUMENTS = 5;
export const MAX_FILE_BYTES = 50 * 1024 * 1024;
export const MAX_TOTAL_NEW_FILE_BYTES = 200 * 1024 * 1024;
export const MAX_GITHUB_URLS = 10;
export const MAX_SUPPLEMENTS = 3;
export const MAX_SUPPLEMENT_TITLE = 80;
export const MAX_SUPPLEMENT_ITEM = 500;

// github.com의 저장소 또는 계정 주소만 받는다. 계정 자리에 오는 GitHub 기능 경로는 막는다(Web 수정 사항 4.6).
const GITHUB_URL = /^(https?:\/\/)?(www\.)?github\.com\/([A-Za-z0-9-]+)(\/[A-Za-z0-9._-]+)?\/?$/i;
const GITHUB_RESERVED_PATHS = new Set([
  "about", "account", "apps", "codespaces", "collections", "contact", "copilot", "customer-stories",
  "dashboard", "discussions", "enterprise", "enterprises", "events", "explore", "features", "issues",
  "join", "login", "logout", "marketplace", "new", "notifications", "organizations", "orgs", "pricing",
  "pulls", "readme", "search", "security", "sessions", "settings", "signup", "site", "sponsors",
  "stars", "team", "teams", "topics", "trending",
]);

export const isValidGithubUrl = (url: string) => {
  const match = GITHUB_URL.exec(url.trim());
  return Boolean(match) && !GITHUB_RESERVED_PATHS.has(match![3].toLowerCase());
};

// 대소문자·https·www·끝의 /·.git만 다른 주소는 같은 저장소로 본다(서버도 하나로 합친다).
export const getGithubKey = (url: string) =>
  url.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "").replace(/\.git$/, "");

export const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

export const MATERIAL_MESSAGES = {
  JOB_TITLE_REQUIRED: "직무명을 입력해 주세요",
  JOB_TITLE_INVALID: "직무명은 30자까지 한 줄로 입력해 주세요",
  MATERIAL_REQUIRED: "이력서 외에 경력기술서·포트폴리오·업무 산출물 중 1개를 올리거나 자소서를 1문항 이상 작성해 주세요",
  COVER_LETTER_INCOMPLETE: "문항과 답을 모두 입력해 주세요",
  COVER_LETTER_INVALID: "자소서는 5문항까지, 문항 200자·답 2,000자까지 쓸 수 있어요",
  JOB_ROLE_REQUIRED: "직무를 선택해 주세요",
  TOO_MANY_DOCUMENTS: "문서는 5개까지 올릴 수 있어요",
  DOC_TYPE_NOT_ALLOWED: "이 직무에서 받지 않는 문서 종류예요",
  UNREADABLE_PDF: "PDF 파일을 열 수 없어요. 다시 내보내 주세요",
  ENCRYPTED_PDF: "암호가 걸린 PDF는 올릴 수 없어요",
  FILE_TOO_LARGE: "파일 하나는 50MB까지예요",
  TOTAL_FILE_TOO_LARGE: "새로 첨부한 파일의 합계는 200MB까지예요",
  DUPLICATE_FILE: "같은 파일이 이미 있어요",
  MATERIALS_CHANGED: "자료 정보가 바뀌었어요. 새로고침 후 다시 저장해 주세요",
  GITHUB_REQUIRED: "GitHub 저장소를 1개 이상 등록해 주세요",
  GITHUB_NOT_ALLOWED: "이 직무는 GitHub를 받지 않아요",
  INVALID_GITHUB_URL: "GitHub 저장소 주소 형식을 확인해 주세요",
  TOO_MANY_GITHUB_URLS: "GitHub 주소는 10개까지 등록할 수 있어요",
  SUPPLEMENT_INVALID: "보완 입력 내용을 확인해 주세요",
  NOT_PDF_FILE: "PDF 파일만 업로드할 수 있습니다.",
  SAVE_FAILED: "자료를 저장하지 못했습니다.",
  LOAD_FAILED: "저장된 자료를 불러오지 못했어요. 다시 불러와야 저장할 수 있어요",
} as const;

export const getRequiredDocumentMessage = (typeCodes: readonly string[]) =>
  `${typeCodes.map(getDocumentTypeLabel).join(", ")} 중 1개 이상 올려 주세요`;

export const getTooManyPagesMessage = (totalPages: string | null) =>
  totalPages ? `문서 쪽수 합계가 50쪽을 넘어요 (현재 ${totalPages}쪽)` : "문서 쪽수 합계가 50쪽을 넘어요";

// 422 errors[] 한 건을 화면 문구로 바꾼다(06 §3.4, Web 수정 사항 4.4).
export const getMaterialErrorMessage = (error: MaterialError, requiredDocuments: readonly string[]) => {
  switch (error.reason) {
    case "JOB_TITLE_REQUIRED": return MATERIAL_MESSAGES.JOB_TITLE_REQUIRED;
    case "JOB_TITLE_INVALID": return MATERIAL_MESSAGES.JOB_TITLE_INVALID;
    case "MATERIAL_REQUIRED": return MATERIAL_MESSAGES.MATERIAL_REQUIRED;
    case "COVER_LETTER_INVALID": return /^coverLetters\[\d+]$/.test(error.field) ? MATERIAL_MESSAGES.COVER_LETTER_INCOMPLETE : MATERIAL_MESSAGES.COVER_LETTER_INVALID;
    case "JOB_TITLE_NOT_ALLOWED":
    case "COVER_LETTER_NOT_ALLOWED": return MATERIAL_MESSAGES.MATERIALS_CHANGED;
    case "JOB_ROLE_REQUIRED":
      return MATERIAL_MESSAGES.JOB_ROLE_REQUIRED;
    case "NO_DOCUMENT":
      return getRequiredDocumentMessage(requiredDocuments);
    case "REQUIRED_DOC_MISSING":
      return getRequiredDocumentMessage(error.detail ? error.detail.split(",") : requiredDocuments);
    case "TOO_MANY_DOCUMENTS":
      return MATERIAL_MESSAGES.TOO_MANY_DOCUMENTS;
    case "DOC_TYPE_NOT_ALLOWED":
      return MATERIAL_MESSAGES.DOC_TYPE_NOT_ALLOWED;
    case "NOT_PDF":
    case "BROKEN_PDF":
      return MATERIAL_MESSAGES.UNREADABLE_PDF;
    case "ENCRYPTED_PDF":
      return MATERIAL_MESSAGES.ENCRYPTED_PDF;
    case "FILE_TOO_LARGE":
      return error.field === "documents" ? MATERIAL_MESSAGES.TOTAL_FILE_TOO_LARGE : MATERIAL_MESSAGES.FILE_TOO_LARGE;
    case "DUPLICATE_FILE":
      return MATERIAL_MESSAGES.DUPLICATE_FILE;
    case "TOO_MANY_PAGES":
      return getTooManyPagesMessage(error.detail);
    case "MATERIALS_RESET_REQUIRED":
    case "EXISTING_NOT_FOUND":
      return MATERIAL_MESSAGES.MATERIALS_CHANGED;
    case "GITHUB_REQUIRED":
      return MATERIAL_MESSAGES.GITHUB_REQUIRED;
    case "GITHUB_NOT_ALLOWED":
      return MATERIAL_MESSAGES.GITHUB_NOT_ALLOWED;
    case "INVALID_GITHUB_URL":
      return error.detail === "TOO_MANY" ? MATERIAL_MESSAGES.TOO_MANY_GITHUB_URLS : MATERIAL_MESSAGES.INVALID_GITHUB_URL;
    case "SUPPLEMENT_NOT_ALLOWED":
    case "SUPPLEMENT_INVALID":
      return MATERIAL_MESSAGES.SUPPLEMENT_INVALID;
    default:
      return MATERIAL_MESSAGES.SAVE_FAILED;
  }
};
