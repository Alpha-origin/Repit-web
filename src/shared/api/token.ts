import { deleteCookie, getCookie, setAccessToken } from "@/shared/util/cookie";

export const getAccessToken = () => getCookie("accessToken");

export const getRefreshToken = () => getCookie("refreshToken");

export const saveAccessToken = (accessToken: string) => {
  setAccessToken(accessToken);
};

export const clearTokens = () => {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
};