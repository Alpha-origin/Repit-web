import { Link } from "react-router-dom";
import styled from "styled-components";

const notFoundBackground = new URL(
  "../../shared/img/NotFound/404Page.svg",
  import.meta.url,
).href;

export const Page = styled.main`
  position: relative;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  overflow: hidden;
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

export const BackgroundArtwork = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.18) 0%,
      rgba(255, 255, 255, 0.08) 100%
    ),
    url(${notFoundBackground});
  background-repeat: no-repeat, no-repeat;
  background-position: center, center;
  background-size: cover, cover;
  opacity: 0.92;

  @media (max-width: 64rem) {
    background-image:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.2) 0%,
        rgba(255, 255, 255, 0.1) 100%
      ),
      url(${notFoundBackground});
  }
`;

export const Content = styled.section`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(100%, 72rem);
  min-height: calc(100vh - 4rem);
  margin: 0 auto;
  padding: 4rem 0;

  @media (max-width: 64rem) {
    align-items: flex-start;
    min-height: calc(100vh - 2rem);
    padding: 3rem 0;
  }

  @media (max-width: 48rem) {
    padding: 2.5rem 0;
  }
`;

export const CopyBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 36rem);
  padding: 1rem 0;
  text-align: center;

  @media (max-width: 48rem) {
    padding: 0.5rem 0;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.25rem 0.75rem;
  border-left: 0.25rem solid ${({ theme }) => theme.colors.brand.blue};
  background: rgba(24, 119, 242, 0.08);
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const Code = styled.strong`
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: clamp(5rem, 13vw, 8rem);
  font-weight: 900;
  line-height: 0.88;
  letter-spacing: -0.12rem;
`;

export const Title = styled.h1`
  margin-top: 1.25rem;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.05rem;
`;

export const Description = styled.p`
  margin-top: 1.25rem;
  color: ${({ theme }) => theme.colors.text.default};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.75;
`;

export const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
  margin-top: 2rem;
`;

const actionBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 10rem;
  min-height: 3.25rem;
  padding: 0 1.375rem;
  border-radius: 0.875rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    transform: translateY(-0.125rem);
  }
`;

export const HomeButton = styled(Link)`
  ${actionBase}
  background: #1565f5;
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1rem 2rem rgba(21, 101, 245, 0.22);

  &:hover {
    background: #2b78ff;
    box-shadow: 0 1.25rem 2.25rem rgba(21, 101, 245, 0.28);
  }
`;

export const SecondaryButton = styled.button`
  ${actionBase}
  border: 1px solid rgba(24, 119, 242, 0.18);
  background: rgba(255, 255, 255, 0.82);
  color: ${({ theme }) => theme.colors.brand.blue};
  cursor: pointer;

  &:hover {
    border-color: rgba(24, 119, 242, 0.28);
    background: rgba(255, 255, 255, 0.94);
  }
`;
