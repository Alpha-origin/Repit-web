// style.ts

import styled from "styled-components";

export const Container = styled.section`
  position: relative;
  left: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
  min-height: 100vh;
  margin-left: -50vw;
  /* 상하 색상 반전 (아래가 은은한 하늘색, 위가 하얀색) */
  background: linear-gradient(
    180deg,
    #f8fafc 0%,
    #edf6ff 55%,
    #dbeeff 100%
  );
  overflow: hidden;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 5.5rem 0rem 0em;

  @media (max-width: 56.25rem) {
    padding: 4.5rem 1.5rem 5rem;
  }
`;

export const Footer = styled.footer`
  width: 100%;
  padding: 2rem clamp(1.5rem, 7vw, 7rem);
  background: #d1e2f8;
  color: #53617a;
  font-size: 0.875rem;
  line-height: 1.6;
`;

export const FooterInner = styled.div`
  display: grid;
  gap: 0.75rem;
  width: min(100%, 80rem);
  margin: 0 auto;
`;

export const FooterTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;

  @media (max-width: 56.25rem) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const FooterBrand = styled.strong`
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.125rem;
  white-space: nowrap;
`;

export const FooterLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const FooterLinkItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

export const FooterSeparator = styled.span`
  color: #8b98ae;
`;

export const FooterNotice = styled.p`
  margin: 0;
`;

export const FooterMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.25rem 1rem;
  padding-top: 0.25rem;
  border-top: 1px solid rgb(83 97 122 / 18%);
`;

export const FooterCopyright = styled.span`
  white-space: nowrap;
`;
