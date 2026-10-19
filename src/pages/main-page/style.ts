import styled from "styled-components";

import { pageLayout } from "@/shared/styles/pageLayout";

export const Page = styled.div`
  ${pageLayout}
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1.4vw, 1rem);
  font-family: ${({ theme }) => theme.fontFamily.pretendard};

  button {
    font-family: inherit;
  }
`;
