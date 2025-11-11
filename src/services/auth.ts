import { api } from "@/services/api";

type LoginType = "web" | "device";

export interface LoginPayload {
  email: string;
  password: string;
  type?: LoginType;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  user: AuthUser;
}

const AUTH_ENDPOINT = {
  LOGIN: "/auth/login",
  ME: "/auth/me",
  LOGOUT: "/auth/logout",
} as const;

export const authService = {
  login: async <T = LoginResponse>(payload: LoginPayload) => {
    const params = new URLSearchParams({
      username: payload.email,
      password: payload.password,
      type: payload.type ?? "web",
    });

    const endpoint = `${AUTH_ENDPOINT.LOGIN}?${params.toString()}`;

    const data = await api.post<T>(endpoint);
    return data;
  },

  me: async <T = AuthUser>() => {
    const data = await api.get<T>(AUTH_ENDPOINT.ME);
    return data;
  },

  logout: async () => {
    await api.post<void>(AUTH_ENDPOINT.LOGOUT);
  },
};
