import axios, { AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.API_BASE_URL || "https://api.flowlinker.com.br";

// Rotas públicas que não devem redirecionar para login em caso de 401/403
const PUBLIC_ROUTES = ["/login", "/esqueci-senha", "/redefinir-senha"];

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const extractErrorMessage = (error: AxiosError): string => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    return "Credenciais inválidas";
  }

  if (error.response?.data && typeof error.response.data === "object") {
    const data = error.response.data as { message?: string };
    if (data.message) {
      return data.message;
    }
  }

  return error.message || "Erro na requisição";
};

const isPublicRoute = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  const { pathname } = window.location;
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
};

const redirectToLogin = () => {
  if (typeof window === "undefined") {
    return;
  }

  const { pathname } = window.location;
  if (!pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
};

const handleAuthRedirect = (error: AxiosError) => {
  // Não redireciona se estiver em uma rota pública
  if (isPublicRoute()) {
    return;
  }

  if (error.response?.status === 401 || error.response?.status === 403) {
    redirectToLogin();
  }
};

const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(endpoint);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAuthRedirect(error);
        throw new Error(extractErrorMessage(error));
      }
      throw error;
    }
  },

  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    try {
      const response = await axiosInstance.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAuthRedirect(error);
        throw new Error(extractErrorMessage(error));
      }
      throw error;
    }
  },

  put: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    try {
      const response = await axiosInstance.put<T>(endpoint, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAuthRedirect(error);
        throw new Error(extractErrorMessage(error));
      }
      throw error;
    }
  },

  patch: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    try {
      const response = await axiosInstance.patch<T>(endpoint, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAuthRedirect(error);
        throw new Error(extractErrorMessage(error));
      }
      throw error;
    }
  },

  delete: async <T>(endpoint: string): Promise<T | void> => {
    try {
      const response = await axiosInstance.delete<T>(endpoint);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAuthRedirect(error);
        throw new Error(extractErrorMessage(error));
      }
      throw error;
    }
  },
};

export { api, axiosInstance };
