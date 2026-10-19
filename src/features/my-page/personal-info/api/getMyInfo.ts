    import { authInstance } from "@/shared/api/axiosInstance";
    import { extractErrorMessage } from "@/shared/api/errorMessage";

    const GET_MY_INFO_URL = "/api/v1/users/me";

    export interface RawUserRecord {
    id?: number;
    name?: string;
    username?: string;
    nickname?: string;
    email?: string;
    }

    export interface RawUserResponse {
    success?: boolean;
    message?: string | null;
    data?: RawUserRecord;
    }

    export interface UserMeData {
    id: number | null;
    name: string;
    nickname: string;
    email: string;
    }

    const getRecord = (
    payload: RawUserRecord | RawUserResponse | null | undefined,
    ): RawUserRecord => {
    if (!payload) {
        return {};
    }

    if ("data" in payload && payload.data) {
        return payload.data;
    }

    return payload as RawUserRecord;
    };

    export const normalizeUserMe = (
    payload: RawUserRecord | RawUserResponse | null | undefined,
    ): UserMeData => {
    const record = getRecord(payload);

    return {
        id: typeof record.id === "number" ? record.id : null,
        name: (record.name ?? record.username ?? "").toString().trim(),
        nickname: (record.nickname ?? "").toString().trim(),
        email: (record.email ?? "").toString().trim(),
    };
    };

    export const getMyInfo = async () => {
    try {
        const response = await authInstance.get<RawUserRecord | RawUserResponse>(
        GET_MY_INFO_URL,
        );

        if ("success" in response.data && response.data.success === false) {
        return {
            data: null,
            errorMessage:
            response.data.message?.trim() || "회원 정보를 불러오지 못했습니다.",
        };
        }

        if (
        "success" in response.data &&
        response.data.success === true &&
        !response.data.data
        ) {
        return {
            data: null,
            errorMessage: "회원 정보를 받지 못했습니다.",
        };
        }

        return {
        data: normalizeUserMe(response.data),
        errorMessage: null,
        };
    } catch (error) {
        return {
        data: null,
        errorMessage: extractErrorMessage(error, "회원 정보를 불러오지 못했습니다."),
        };
    }
    };
