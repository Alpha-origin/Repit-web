import {
  THIRD_SECTION_FOOTER_AI_NOTICE,
  THIRD_SECTION_FOOTER_COMPANY_NOTICE,
  THIRD_SECTION_FOOTER_COPYRIGHT,
  THIRD_SECTION_FOOTER_LINKS,
  THIRD_SECTION_FOOTER_OPERATOR,
} from "@/shared/constants/landing-page/third-section";
import UserReview from "@/widgets/landing-page/third-section/user-review";
import * as S from "./style";

const ThirdSection = () => {
  return (
    <S.Container>
      <S.Content>
        <UserReview />
      </S.Content>

      <S.Footer>
        <S.FooterInner>
          <S.FooterTop>
            <S.FooterBrand>리핏 (Repit)</S.FooterBrand>
            <S.FooterLinks aria-label="사이트 정보">
              {THIRD_SECTION_FOOTER_LINKS.map((link, index) => (
                <S.FooterLinkItem key={link}>
                  {index > 0 && <S.FooterSeparator aria-hidden="true">|</S.FooterSeparator>}
                  <span>{link}</span>
                </S.FooterLinkItem>
              ))}
            </S.FooterLinks>
          </S.FooterTop>

          <S.FooterNotice>{THIRD_SECTION_FOOTER_AI_NOTICE}</S.FooterNotice>
          <S.FooterNotice>{THIRD_SECTION_FOOTER_COMPANY_NOTICE}</S.FooterNotice>
          <S.FooterMeta>
            <span>{THIRD_SECTION_FOOTER_OPERATOR}</span>
            <S.FooterCopyright>{THIRD_SECTION_FOOTER_COPYRIGHT}</S.FooterCopyright>
          </S.FooterMeta>
        </S.FooterInner>
      </S.Footer>
    </S.Container>
  );
};

export default ThirdSection;
