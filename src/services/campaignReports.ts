import { api, axiosInstance } from "@/services/api";

// Tipos para detalhes de campanhas
export type ShareEvent = {
  eventId: string;
  eventAt: string;
  eventAtLocal: string;
  account: string;
  groupName: string;
  groupUrl: string;
  groupMembers: string | null;
  post: string;
};

export type DirectMessageEvent = {
  eventId: string;
  eventAt: string;
  eventAtLocal: string;
  account: string;
  recipientName: string;
  message: string;
};

export type CampaignDetailItem = {
  campaignId: number;
  platform: string;
  campaignType: string;
  startedAt: string;
  startedAtLocal: string;
  total: number;
  campaignName: string;
  completedAt: string | null;
  completedAtLocal: string | null;
  completedEventId: number | null;
  startedEventId: number | null;
  shares: ShareEvent[];
  directMessages: DirectMessageEvent[];
  sharesCount: number;
  directMessagesCount: number;
};

export type CampaignDetailsResponse = {
  total: number;
  page: number;
  size: number;
  items: CampaignDetailItem[];
};

export type ExportFormat = "xlsx" | "pdf";

const CAMPAIGN_REPORTS_ENDPOINT = {
  DETAILS: "/metrics/campaigns/details",
  EXPORT: "/metrics/campaigns/export",
} as const;

type GetDetailsParams = {
  start: string;
  end: string;
  tz?: string;
  page?: number;
  size?: number;
};

type ExportParams = {
  start: string;
  end: string;
  tz?: string;
  page?: number;
  size?: number;
  format?: ExportFormat;
};

export const campaignReportsService = {
  getDetails: async (
    params: GetDetailsParams
  ): Promise<CampaignDetailsResponse> => {
    const searchParams = new URLSearchParams();

    searchParams.append("start", params.start);
    searchParams.append("end", params.end);

    if (params.tz) {
      searchParams.append("tz", params.tz);
    }
    if (typeof params.page === "number") {
      searchParams.append("page", String(params.page));
    }
    if (typeof params.size === "number") {
      searchParams.append("size", String(params.size));
    }

    const queryString = searchParams.toString();
    const endpoint = `${CAMPAIGN_REPORTS_ENDPOINT.DETAILS}?${queryString}`;

    return api.get<CampaignDetailsResponse>(endpoint);
  },

  exportFile: async (params: ExportParams): Promise<void> => {
    const searchParams = new URLSearchParams();

    searchParams.append("start", params.start);
    searchParams.append("end", params.end);

    if (params.tz) {
      searchParams.append("tz", params.tz);
    }
    if (typeof params.page === "number") {
      searchParams.append("page", String(params.page));
    }
    if (typeof params.size === "number") {
      searchParams.append("size", String(params.size));
    }

    const format = params.format ?? "xlsx";
    searchParams.append("format", format);

    const queryString = searchParams.toString();
    const endpoint = `${CAMPAIGN_REPORTS_ENDPOINT.EXPORT}?${queryString}`;

    const response = await axiosInstance.get(endpoint, {
      responseType: "blob",
      headers: {
        Accept: format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

    // Verificar se a resposta é realmente um blob com conteúdo
    const data = response.data as Blob;
    if (!data || data.size === 0) {
      throw new Error("Arquivo vazio retornado pelo servidor");
    }

    // Se o blob veio como JSON (erro do backend), extrair a mensagem
    if (data.type && data.type.includes("application/json")) {
      const text = await data.text();
      throw new Error(`Erro no export: ${text}`);
    }

    const contentDisposition = response.headers["content-disposition"];
    let filename = `campaigns_export.${format}`;
    if (contentDisposition) {
      const match =
        contentDisposition.match(/filename="([^"]+)"/) ??
        contentDisposition.match(/filename=([^\s;]+)/);
      if (match?.[1]) {
        filename = match[1].trim();
      }
    }

    const mimeType = format === "pdf"
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Delay antes de limpar para garantir que o download iniciou
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  },
};
