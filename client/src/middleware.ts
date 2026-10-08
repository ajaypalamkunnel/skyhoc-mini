import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/config/env";

const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(jsonPayload) as { exp?: number };
    if (!payload.exp) return false;
    // Buffer with 5 seconds leeway
    return payload.exp * 1000 <= Date.now() + 5000;
  } catch {
    return true;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run refresh logic for protected paths or pages (e.g. /dashboard)
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup")
  ) {
    const accessToken = request.cookies.get("access_token");
    const refreshToken = request.cookies.get("refresh_token");

    const needsRefresh =
      (!accessToken?.value || isTokenExpired(accessToken.value)) &&
      Boolean(refreshToken?.value);

    if (needsRefresh && refreshToken?.value) {
      try {
        const refreshRes = await fetch(`${env.apiUrl}/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `refresh_token=${refreshToken.value}`,
          },
        });

        if (refreshRes.ok) {
          const setCookies = refreshRes.headers.getSetCookie?.() || [];
          const rawSetCookie = refreshRes.headers.get("set-cookie");
          const cookieStrings =
            setCookies.length > 0
              ? setCookies
              : rawSetCookie
                ? [rawSetCookie]
                : [];

          let newAccessToken: string | null = null;
          for (const cookieStr of cookieStrings) {
            const match = cookieStr.match(/access_token=([^;]+)/);
            if (match) {
              newAccessToken = match[1];
            }
          }

          const requestHeaders = new Headers(request.headers);
          if (newAccessToken) {
            request.cookies.set("access_token", newAccessToken);
            const existingCookies = request.headers.get("cookie") || "";
            requestHeaders.set(
              "cookie",
              `${existingCookies ? existingCookies + "; " : ""}access_token=${newAccessToken}`,
            );
          }

          const response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });

          // Write rotated Set-Cookie headers back to the browser
          for (const cookieStr of cookieStrings) {
            response.headers.append("Set-Cookie", cookieStr);
          }

          return response;
        }
      } catch {
        // Fall through to allow Server Components to handle unauthenticated state
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
