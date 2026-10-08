import { create } from "zustand";

import { authService } from "./auth.service";
import type {
    CurrentUser,
    LoginInput,
    SignupInput,
} from "./auth.types";

interface AuthState {
    user: CurrentUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    signup: (input: SignupInput) => Promise<void>;
    login: (input: LoginInput) => Promise<void>;
    getCurrentUser: () => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    signup: async (input) => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            await authService.signup(input);

            set({
                isLoading: false,
            });
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to create account",
            });

            throw error;
        }
    },

    login: async (input) => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            await authService.login(input);
            const response = await authService.getCurrentUser();

            if (!response.data) {
                throw new Error("Current user data is missing");
            }

            set({
                user: response.data,
                isLoading: false,
                isAuthenticated: true,
            });
        } catch (error) {
            set({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to login",
            });

            throw error;
        }
    },

    getCurrentUser: async () => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const response = await authService.getCurrentUser();

            if (!response.data) {
                throw new Error("Current user data is missing");
            }

            set({
                user: response.data,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to fetch current user",
            });

            throw error;
        }
    },

    logout: async () => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            await authService.logout();

            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to logout",
            });

            throw error;
        }
    },

    refresh: async () => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            await authService.refresh();

            set({
                isLoading: false,
                isAuthenticated: true,
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to refresh session",
            });

            throw error;
        }
    },
}));