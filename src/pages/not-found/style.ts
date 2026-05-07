import styled from "styled-components";

export const Page = styled.main`
  position: relative;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  overflow: hidden;
  font-family: ${({ theme }) => theme.fontFamily.pretendard};
  background:
    radial-gradient(circle at top right, rgba(24, 119, 242, 0.14), transparent 24rem),
    linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
  color: ${({ theme }) => theme.colors.text.strong};

  &::before {
    content: "";
    position: absolute;
    top: 6%;
    left: 50%;
    width: min(90vw, 68rem);
    height: 1px;
    background: rgba(24, 119, 242, 0.16);
    transform: translateX(-50%);
  }

  @media (max-width: 48rem) {
    padding: 1rem;
  }
`;
