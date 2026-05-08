import styled from 'styled-components';

import type { AuthPageStyleProps } from './type';

export const Container = styled.main.attrs<AuthPageStyleProps>(({ $isLogin }) => ({
  'data-is-login': String($isLogin),
}))<AuthPageStyleProps>`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  overflow: hidden;
  background-color: #f4f8ff;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
