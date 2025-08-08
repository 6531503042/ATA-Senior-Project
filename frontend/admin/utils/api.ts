"use server";

import { cookies } from "next/headers";

export interface ApiResponse<T> {
    statusCode: number;
    message: string | null;
    data: T | null;
}

// General API Request function
export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    body?: object | FormData,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = (await cookies()).get("accessToken")?.value;
      const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  
      const headers: HeadersInit = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Only set Content-Type for JSON. DO NOT set it for FormData!
        ...(!isFormData && body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
      };
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method,
        headers,
        credentials: "include",
        body: body
          ? isFormData
            ? (body as FormData)
            : JSON.stringify(body)
          : undefined,
        ...options,
      });
  
      const responseData = await response.json();
  
      if (responseData.statusCode && responseData.message && responseData.data) {
        return {
          data: responseData.data,
          statusCode: responseData.statusCode,
          message: responseData.message,
        };
      } else if (response.ok) {
        return {
          data: responseData,
          statusCode: response.status,
          message: null,
        };
      }
  
      return {
        data: null,
        statusCode: response.status,
        message: responseData.message || "Request failed",
      };
    } catch (err) {
      return {
        data: null,
        statusCode: 500,
        message: (err as Error).message,
      };
    }
  }