import axios, { AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.API_BASE_URL || "https://37b23ebdb144.ngrok-free.app/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const extractErrorMessage = (error: AxiosError) => {
  const fallbackMessage = "Erro na requisição";

  if (error.response?.status === 401 || error.response?.status === 403) {
    return "Credenciais inválidas. Verifique seu e-mail e senha.";
  }

  if (error.response?.data && typeof error.response.data === "object") {
    const data = error.response.data as { message?: string };
    if (data.message) {
      if (data.message.toLowerCase().includes("invalid")) {
        return "Credenciais inválidas. Verifique seu e-mail e senha.";
      }

      return data.message;
    }
  }

  if (error.message.toLowerCase().includes("invalid")) {
    return "Credenciais inválidas. Verifique seu e-mail e senha.";
  }

  return error.message || fallbackMessage;
};

const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(endpoint);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
        throw new Error(extractErrorMessage(error));
      }
      throw error;
    }
  },
};

export { api };
