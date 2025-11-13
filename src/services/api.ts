import axios, { AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.API_BASE_URL || "https://flowlinker.onrender.com";

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
