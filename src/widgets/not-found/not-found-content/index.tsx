import { useNavigate } from "react-router-dom";
import * as S from "./style";

const NotFoundContent = () => {
  const navigate = useNavigate();

  return (
    <S.Content>
      <S.CopyBlock>
        <S.Badge>Page Not Found</S.Badge>
        <S.Code>404</S.Code>
        <S.Title>페이지를 찾을 수 없습니다</S.Title>
        <S.Description>
          요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
          <br />
          아래 버튼을 눌러 메인 페이지로 이동해 주세요.
        </S.Description>

        <S.ActionGroup>
          <S.HomeButton to="/">메인으로 돌아가기</S.HomeButton>
          <S.SecondaryButton type="button" onClick={() => navigate(-1)}>
            이전 페이지로
          </S.SecondaryButton>
        </S.ActionGroup>
      </S.CopyBlock>
    </S.Content>
  );
};

export default NotFoundContent;
