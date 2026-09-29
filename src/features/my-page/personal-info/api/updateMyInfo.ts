    import { authInstance } from "@/shared/api/axiosInstance";
    import { extractErrorMessage } from "@/shared/api/errorMessage";

    const UPDATE_MY_INFO_URL = "/api/v1/users/me";

    export interface UpdateMyInfoParams {
    name: string;
    nickname: string;
    email: string;
    }

    export const updateMyInfo = async (params: UpdateMyInfoParams) => {
    try {
        await authInstance.patch(UPDATE_MY_INFO_URL, {
        username: params.name,
        nickname: params.nickname,
        email: params.email,
        });

        return { errorMessage: null };
    } catch (error) {
        return {
        errorMessage: extractErrorMessage(error, "회원정보 수정에 실패했습니다."),
        };
    }
    };