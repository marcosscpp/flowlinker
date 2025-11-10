import axios, { AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.API_BASE_URL || "https://14115e0ae047.ngrok-free.app/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(endpoint);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        throw new Error(axiosError.message || "Erro na requisição");
      }
      throw error;
    }
  },

  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    try {
      const response = await axiosInstance.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        throw new Error(
          (axiosError.response?.data as { message?: string } | undefined)
            ?.message ||
            axiosError.message ||
            "Erro na requisição"
        );
      }
      throw error;
    }
  },
};
