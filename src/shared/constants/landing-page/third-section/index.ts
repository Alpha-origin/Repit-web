export const THIRD_SECTION_SUBTITLE = "User Review";

export const THIRD_SECTION_TITLE = "사람들이 말하는 레핏";

const REVIEW_MESSAGE =
  "혼자 집에서도 간편하게 면접을 보고\n구체적인 피드백을 받을 수 있어 좋아요";

export const THIRD_SECTION_REVIEW_ITEMS = [
  {
    id: 1,
    align: "left",
    bubbleAsset: 1,
    message: REVIEW_MESSAGE,
  },
  {
    id: 2,
    align: "right",
    bubbleAsset: 2,
    message: REVIEW_MESSAGE,
  },
  {
    id: 3,
    align: "left",
    bubbleAsset: 3,
    message: REVIEW_MESSAGE,
  },
  {
    id: 4,
    align: "right",
    bubbleAsset: 4,
    message: REVIEW_MESSAGE,
  },
] as const;

export const THIRD_SECTION_FOOTER_TEXT = "사이트 정보 여기";
