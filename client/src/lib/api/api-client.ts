import { env } from "@/config/env";
import type { ApiErrorResponse, ApiResponse } from "@/types/api";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number,
    code?: string,
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

let refreshPromise: Promise<void> | null = null;

const refreshAuthSession = async (): Promise<void> => {
  const response = await fetch(`${env.apiUrl}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Session expired. Please log in again.";
    let code: string | undefined;

    try {
      const errorBody = (await response.json()) as ApiErrorResponse;
      if (errorBody.message) {
        message = errorBody.message;
      }
      if (errorBody.code) {
        code = errorBody.code;
      }
    } catch {
      // Fallback message used if response is non-JSON
    }

    throw new ApiError(message, response.status, code);
  }
};

const request = async <T>(
  endpoint: string,
  options: RequestOptions = {},
  isRetry = false,
): Promise<ApiResponse<T>> => {
  const { body, headers, ...requestOptions } = options;

  const response = await fetch(`${env.apiUrl}${endpoint}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && endpoint !== "/api/auth/refresh" && !isRetry) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAuthSession().finally(() => {
          refreshPromise = null;
        });
      }

      await refreshPromise;
      return await request<T>(endpoint, options, true);
    } catch {
      // Fall through to parse and throw the 401 ApiError
    }
  }

  let responseBody: ApiResponse<T> | ApiErrorResponse;

  try {
    responseBody = (await response.json()) as ApiResponse<T> | ApiErrorResponse;
  } catch {
    throw new ApiError(
      "Unable to process server response",
      response.status,
    );
  }

  if (!response.ok) {
    const errorBody = responseBody as ApiErrorResponse;
    throw new ApiError(
      errorBody.message || "An unexpected error occurred",
      response.status,
      errorBody.code,
    );
  }

  return responseBody as ApiResponse<T>;
};

export const apiClient = {
  get: <T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> =>
    request<T>(endpoint, {
      ...options,
      method: "GET",
    }),

  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    }),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    }),

  delete: <T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> =>
    request<T>(endpoint, {
      ...options,
      method: "DELETE",
    }),
};