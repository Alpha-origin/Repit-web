import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { getMyInfo } from "@/features/my-page/personal-info/api/getMyInfo";
import { useUserStore } from "@/shared/store/userStore";

// 세션 만료는 API 요청이 401을 받아야 드러나므로, 진입 시 요청이 없는 화면에서도
// 화면 이동과 탭 복귀 시점에 /me를 호출해 재발급 → 로그인 이동 흐름을 태운다.
export const useSessionCheck = () => {
  const { pathname } = useLocation();
  const setUser = useUserStore((state) => state.setUser);
  const checkedPathnameRef = useRef<string | null>(null);
  const isCheckingRef = useRef(false);

  const checkSession = useCallback(async () => {
    if (isCheckingRef.current) {
      return;
    }

    isCheckingRef.current = true;

    try {
      const { data } = await getMyInfo();

      if (data) {
        setUser(data);
      }
    } finally {
      isCheckingRef.current = false;
    }
  }, [setUser]);

  useEffect(() => {
    const previousPathname = checkedPathnameRef.current;

    if (previousPathname === pathname) {
      return;
    }

    checkedPathnameRef.current = pathname;

    // 회원 정보가 없는 첫 진입은 헤더의 useEnsureCurrentUser가 이미 /me를 호출한다.
    if (previousPathname === null && !useUserStore.getState().isLoaded) {
      return;
    }

    void checkSession();
  }, [checkSession, pathname]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkSession]);
};
