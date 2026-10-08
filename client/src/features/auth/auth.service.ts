import { apiClient } from "@/lib/api/api-client";
import type { ApiResponse } from "@/types/api";
import type { CurrentUser, LoginInput, SignupInput } from "./auth.types";

export const authService = {
    signup: async (
        input: SignupInput,
    ): Promise<ApiResponse<undefined>> => {
        return apiClient.post<undefined>("/api/auth/signup", input);
    },

    login: async (
        input: LoginInput,
    ): Promise<ApiResponse<undefined>> => {
        return apiClient.post<undefined>("/api/auth/login", input);
    },

    getCurrentUser: async (): Promise<ApiResponse<CurrentUser>> => {
        return apiClient.get<CurrentUser>("/api/auth/me");
    },

    logout: async (): Promise<ApiResponse<undefined>> => {
        return apiClient.post<undefined>("/api/auth/logout");
    },

    refresh: async (): Promise<ApiResponse<undefined>> => {
        return apiClient.post<undefined>("/api/auth/refresh");
    },
};