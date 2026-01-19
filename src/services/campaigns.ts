import { api } from "@/services/api";

// Tipos base
export type CampaignStatus = "RUNNING" | "PAUSED" | "COMPLETED" | "CANCELLED";
export type CampaignPlatform = "FACEBOOK" | "INSTAGRAM";
export type CampaignChannel = "GROUP_SHARE" | "DIRECT_MESSAGE";

// Informações do dispositivo
export type CampaignDeviceInfo = {
  id: number;
  deviceId: string;
  name: string;
  hostname: string;
  osName: string;
  osVersion: string;
  appVersion: string;
  lastSeenAt: string;
};

// Informações da conta
export type CampaignAccountInfo = {
  id: number;
  username: string;
  perfilName: string;
  status: string;
  hasCookies: boolean;
};

// Resposta da lista de campanhas
export type CampaignListResponse = {
  campaignId: number;
  name: string;
  status: CampaignStatus;
  startedAt: string;
  createdAt: string;
  campaignType: string;
  platform: CampaignPlatform;
  channel: CampaignChannel;
  device: CampaignDeviceInfo;
  accounts: CampaignAccountInfo[];
  totalItems: number;
  lastProcessedIndex: number;
  completionPercentage: number;
  extractionId: number;
  message: string;
  linkUrl: string;
  rotateAccountEveryN: number;
  typingDelayMs: number;
  intervalDelayMs: number;
  clickButtonsDelayMs: number;
  triggerId: number;
  triggerCategory: string;
};

// Resposta paginada genérica
export type PaginatedResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

// Progresso da campanha
export type CampaignProgressResponse = {
  campaignId: number;
  lastProcessedIndex: number;
  totalGroups: number;
  status: CampaignStatus;
};

// Payload para atualização de progresso
export type CampaignProgressUpdateRequest = {
  lastProcessedIndex?: number;
};

// Gatilho de campanha
export type CampaignTrigger = {
  id: number;
  text: string;
  category: string;
};

const CAMPAIGNS_ENDPOINT = {
  LIST: "/campaigns",
  GET: (campaignId: number) => `/campaigns/${campaignId}`,
  PROGRESS: (campaignId: number) => `/campaigns/${campaignId}/progress`,
  PAUSE: (campaignId: number) => `/campaigns/${campaignId}/pause`,
  RESUME: (campaignId: number) => `/campaigns/${campaignId}/resume`,
  CANCEL: (campaignId: number) => `/campaigns/${campaignId}/cancel`,
  COMPLETE: (campaignId: number) => `/campaigns/${campaignId}/complete`,
  DELETE: (campaignId: number) => `/campaigns/${campaignId}`,
  TRIGGERS: "/campaigns/triggers",
} as const;

type ListParams = {
  status?: CampaignStatus | CampaignStatus[];
  page?: number;
  size?: number;
};

const DEFAULT_PAGE_SIZE = 5;

export const campaignsService = {
  /**
   * Lista campanhas do cliente com filtros e paginação
   */
  list: async (
    params: ListParams = {}
  ): Promise<PaginatedResponse<CampaignListResponse>> => {
    const searchParams = new URLSearchParams();

    if (params.status) {
      const statusArray = Array.isArray(params.status)
        ? params.status
        : [params.status];
      searchParams.append("status", statusArray.join(","));
    }

    // Paginação (page é 0-indexed no backend Spring)
    const page = params.page ?? 0;
    const size = params.size ?? DEFAULT_PAGE_SIZE;
    searchParams.append("page", String(page));
    searchParams.append("size", String(size));

    const queryString = searchParams.toString();
    const endpoint = `${CAMPAIGNS_ENDPOINT.LIST}?${queryString}`;

    return api.get<PaginatedResponse<CampaignListResponse>>(endpoint);
  },

  /**
   * Obtém detalhes de uma campanha específica
   */
  get: async (campaignId: number): Promise<CampaignListResponse> => {
    return api.get<CampaignListResponse>(CAMPAIGNS_ENDPOINT.GET(campaignId));
  },

  /**
   * Obtém o progresso de uma campanha
   */
  getProgress: async (
    campaignId: number
  ): Promise<CampaignProgressResponse> => {
    return api.get<CampaignProgressResponse>(
      CAMPAIGNS_ENDPOINT.PROGRESS(campaignId)
    );
  },

  /**
   * Pausa uma campanha em execução
   */
  pause: async (
    campaignId: number,
    payload?: CampaignProgressUpdateRequest
  ): Promise<void> => {
    await api.post(CAMPAIGNS_ENDPOINT.PAUSE(campaignId), payload);
  },

  /**
   * Retoma uma campanha pausada
   */
  resume: async (
    campaignId: number,
    payload?: CampaignProgressUpdateRequest
  ): Promise<void> => {
    await api.post(CAMPAIGNS_ENDPOINT.RESUME(campaignId), payload);
  },

  /**
   * Cancela uma campanha
   */
  cancel: async (
    campaignId: number,
    payload?: CampaignProgressUpdateRequest
  ): Promise<void> => {
    await api.post(CAMPAIGNS_ENDPOINT.CANCEL(campaignId), payload);
  },

  /**
   * Marca uma campanha como completa
   */
  complete: async (
    campaignId: number,
    payload?: CampaignProgressUpdateRequest
  ): Promise<void> => {
    await api.post(CAMPAIGNS_ENDPOINT.COMPLETE(campaignId), payload);
  },

  /**
   * Exclui uma campanha
   */
  delete: async (campaignId: number): Promise<void> => {
    await api.delete(CAMPAIGNS_ENDPOINT.DELETE(campaignId));
  },

  /**
   * Lista gatilhos de texto disponíveis para campanhas
   */
  getTriggers: async (): Promise<CampaignTrigger[]> => {
    return api.get<CampaignTrigger[]>(CAMPAIGNS_ENDPOINT.TRIGGERS);
  },
};
