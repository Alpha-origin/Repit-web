import {
  SECOND_SECTION_SERVICE_ITEMS,
  SECOND_SECTION_SUBTITLE,
  SECOND_SECTION_TITLE,
} from "@/shared/constants/LandingPage/landingPage";
import * as S from "./style";

const MainService = () => {
  return (
    <>
      <S.Header>
        <S.SubTitle>{SECOND_SECTION_SUBTITLE}</S.SubTitle>

        <S.Title>
          {SECOND_SECTION_TITLE.split("\n").map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </S.Title>
      </S.Header>

      <S.ServiceGrid>
        {SECOND_SECTION_SERVICE_ITEMS.map((item) => (
          <S.ServiceRow key={item.title} $align={item.align ?? "left"}>
            <S.ServiceCard $align={item.align ?? "left"}>
              <S.CardTitle>{item.title}</S.CardTitle>

              <S.CardHeading>
                {item.heading.split("\n").map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </S.CardHeading>

              <S.CardDescription>
                {item.description.split("\n").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </S.CardDescription>
            </S.ServiceCard>
          </S.ServiceRow>
        ))}
      </S.ServiceGrid>
    </>
  );
};

export default MainService;
