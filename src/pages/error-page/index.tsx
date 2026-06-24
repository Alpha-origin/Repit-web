import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import styled from "styled-components";

import { extractErrorMessage } from "@/shared/api/errorMessage";

const Page = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
  box-sizing: border-box;
`;

const Panel = styled.section`
  width: min(100%, 34rem);
  padding: 2rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.96);
  border: 0.0625rem solid rgba(220, 232, 251, 0.8);
  box-shadow: 0 1rem 2.5rem rgba(112, 143, 206, 0.12);
  text-align: center;
`;

const Title = styled.h1`
  margin: 0 0 0.85rem;
  color: #1f2f4d;
  font-size: 1.6rem;
  font-weight: 800;
`;

const Message = styled.p`
  margin: 0;
  color: #5d6b86;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button`
  padding: 0.8rem 1.1rem;
  border: none;
  border-radius: 0.8rem;
  background: #1a73e8;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
`;

const SecondaryButton = styled(ActionButton)`
  background: #dfe9fb;
  color: #1f2f4d;
`;

const RouteErrorPage = () => {
  const navigate = useNavigate();
  const routeError = useRouteError();
  const errorMessage = isRouteErrorResponse(routeError)
    ? extractErrorMessage(routeError.data, routeError.statusText || "페이지를 불러오지 못했습니다.")
    : extractErrorMessage(routeError, "예상치 못한 오류가 발생했습니다.");

  return (
    <Page>
      <Panel>
        <Title>문제가 발생했습니다.</Title>
        <Message>{errorMessage}</Message>
        <ActionRow>
          <ActionButton type="button" onClick={() => window.location.reload()}>
            새로고침
          </ActionButton>
          <SecondaryButton type="button" onClick={() => navigate("/")}>
            홈으로 이동
          </SecondaryButton>
        </ActionRow>
      </Panel>
    </Page>
  );
};

export default RouteErrorPage;
