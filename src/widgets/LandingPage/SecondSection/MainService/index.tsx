import { useReducedMotion } from "framer-motion";
import {
  SECOND_SECTION_SERVICE_ITEMS,
  SECOND_SECTION_SUBTITLE,
  SECOND_SECTION_TITLE,
} from "@/shared/constants/LandingPage/landingPage";
import {
  listVariants,
  mainServiceViewport,
  revealVariants,
} from "./animation";
import * as S from "./style";

const MainService = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <S.ContentMotion
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={shouldReduceMotion ? undefined : mainServiceViewport}
    >
      <S.Header variants={revealVariants}>
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

      <S.ServiceGrid variants={listVariants}>
        {SECOND_SECTION_SERVICE_ITEMS.map((item) => (
          <S.ServiceRow
            key={item.title}
            $align={item.align ?? "left"}
            variants={revealVariants}
          >
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
    </S.ContentMotion>
  );
};

export default MainService;
