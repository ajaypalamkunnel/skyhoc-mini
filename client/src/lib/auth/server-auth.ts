import { cache } from "react";
import { cookies } from "next/headers";

import { env } from "@/config/env";
import type { CurrentUser } from "@/features/auth/auth.types";
import type { ApiResponse } from "@/types/api";

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token");

        if (!accessToken?.value) {
            return null;
        }

        const response = await fetch(`${env.apiUrl}/api/auth/me`, {
            method: "GET",
            headers: {
                Cookie: `access_token=${accessToken.value}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        const body = (await response.json()) as ApiResponse<CurrentUser>;

        if (!body.success || !body.data) {
            return null;
        }

        return body.data;
    } catch {
        return null;
    }
});
