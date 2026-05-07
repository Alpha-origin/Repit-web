import NotFoundBackground from "@/widgets/not-found/not-found-background";
import NotFoundContent from "@/widgets/not-found/not-found-content";
import * as S from "./style";

const NotFound = () => {
  return (
    <S.Page>
      <NotFoundBackground />
      <NotFoundContent />
    </S.Page>
  );
};

export default NotFound;
