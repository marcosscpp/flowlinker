import axios from "axios";

const DICAS_API_URL = "https://dicadepost-api.onrender.com/api/dicas";

export interface DicaPostRequest {
  instagram: string;
  nicho: string;
  descricao: string;
}

export interface Dica {
  numero: number;
  titulo: string;
  descricao: string;
  formatoSugerido: string;
  horarioIdeal: string;
  hashtags: string[];
  tendenciaRelacionada: string;
}

export interface DicaPostResponse {
  instagram: string;
  data: string;
  dicas: Dica[];
  mensagem: string;
}

export const dicasPostService = {
  getDicas: async (data: DicaPostRequest): Promise<DicaPostResponse> => {
    const response = await axios.post<DicaPostResponse>(DICAS_API_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
};

