export const AUTH_PAGE_SIDE_CONTENT = {
  login: {
    description: '로그인을 하고 레핏을 이용해보세요',
    imageAlt: '리핏 로그인 안내 이미지',
    switchAuthLabel: '회원가입',
    switchAuthPath: '/signup',
  },
  signup: {
    description: '회원가입을 하고 레핏을 시작해보세요',
    imageAlt: '리핏 회원가입 안내 이미지',
    switchAuthLabel: '로그인',
    switchAuthPath: '/login',
  },
} as const;
