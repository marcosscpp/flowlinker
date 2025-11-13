import { api } from "@/services/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const AUTH_ENDPOINT = {
  LOGIN: "/auth/login",
  ME: "/auth/me",
  LOGOUT: "/auth/logout",
} as const;

export const authService = {
  login: async (payload: LoginPayload) => {
    const params = new URLSearchParams({
      username: payload.email,
      password: payload.password,
      type: "web",
    });

    const endpoint = `${AUTH_ENDPOINT.LOGIN}?${params.toString()}`;

    await api.post<void>(endpoint);
  },

  me: async <T = AuthUser>() => {
    const data = await api.get<T>(AUTH_ENDPOINT.ME);
    return data;
  },

  logout: async () => {
    await api.post<void>(AUTH_ENDPOINT.LOGOUT);
  },
};
