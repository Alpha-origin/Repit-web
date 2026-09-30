    import { authInstance } from "@/shared/api/axiosInstance";
    import { extractErrorMessage } from "@/shared/api/errorMessage";

    const UPDATE_MY_INFO_URL = "/api/v1/users/me";

    // 이메일은 로그인 ID라 서버가 수정하지 않는다.
    export interface UpdateMyInfoParams {
    name: string;
    nickname: string;
    }

    export const updateMyInfo = async (params: UpdateMyInfoParams) => {
    try {
        await authInstance.patch(UPDATE_MY_INFO_URL, {
        username: params.name,
        nickname: params.nickname,
        });

        return { errorMessage: null };
    } catch (error) {
        return {
        errorMessage: extractErrorMessage(error, "회원정보 수정에 실패했습니다."),
        };
    }
    };