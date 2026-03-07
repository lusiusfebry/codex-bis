import axiosInstance from "@/api/axiosInstance";
import type { AuthUser, LoginPayload } from "@/types/auth";

type AuthEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type LoginResponse = {
  token: string;
  user: AuthUser;
};

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const response = await axiosInstance.post<AuthEnvelope<LoginResponse>>("/auth/login", payload);
  return response.data.data;
}

export async function getMeApi(): Promise<AuthUser | null> {
  const response = await axiosInstance.get<AuthEnvelope<AuthUser | null>>("/auth/me");
  return response.data.data;
}

export async function logoutApi(): Promise<void> {
  await axiosInstance.post("/auth/logout");
}
