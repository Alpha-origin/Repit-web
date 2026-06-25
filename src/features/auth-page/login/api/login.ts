import type { LoginFormData } from "@/features/auth-page/login/model/types";
import {
  setAccessToken,
  syncAccessTokenFromResponse,
} from "@/shared/api/accessToken";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import { authInstance } from "@/shared/api/axiosInstance";

const LOGIN_URL = "/api/v1/auth/login";

export async function login(formData: LoginFormData): Promise<string | null> {
  const loginData = {
    email: formData.email.trim(),
    password: formData.password,
  };

  try {
    const response = await authInstance.post(LOGIN_URL, loginData);
    const syncedToken = syncAccessTokenFromResponse({
      data: response.data,
      headers: response.headers as Record<string, unknown>,
    });

    console.log("[POST /api/v1/auth/login] accessToken", syncedToken ?? null);

    if (!syncedToken) {
      setAccessToken(null);
    }

    return null;
  } catch (error) {
    return extractErrorMessage(error, "로그인에 실패했습니다.");
  }
}
