    import { authInstance } from "@/shared/api/axiosInstance";
    import { extractErrorMessage } from "@/shared/api/errorMessage";
    import {
    normalizeUserMe,
    type RawUserResponse,
    } from "@/features/my-page/personal-info/api/getMyInfo";

    const UPDATE_MY_INFO_URL = "/api/v1/users/me";

    // 이메일은 로그인 ID라 서버가 수정하지 않는다.
    export interface UpdateMyInfoParams {
    name: string;
    nickname: string;
    }

    export const updateMyInfo = async (params: UpdateMyInfoParams) => {
    try {
        const response = await authInstance.patch<RawUserResponse>(
        UPDATE_MY_INFO_URL,
        {
            username: params.name,
            nickname: params.nickname,
        },
        );

        return {
        data: response.data.data ? normalizeUserMe(response.data) : null,
        errorMessage: null,
        };
    } catch (error) {
        return {
        data: null,
        errorMessage: extractErrorMessage(error, "회원정보 수정에 실패했습니다."),
        };
    }
    };
