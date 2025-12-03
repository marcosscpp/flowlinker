import { api } from "@/services/api";

export type MetricLogItem = {
  eventId: string;
  eventAt: string;
  eventAtLocal?: string;
  text: string;
  type?: string;
  eventType?: string;
  actor?: string;
  platform?: string;
  account?: string;
  groupName?: string;
  payload?: Record<string, unknown>;
  [key: string]: unknown;
};

export type RecentMetricsResponse = {
  customerId?: number;
  items: MetricLogItem[];
};

type RecentMetricsApiResponse = RecentMetricsResponse | MetricLogItem[] | null;

const normalizeRecentMetricsResponse = (
  data: RecentMetricsApiResponse
): RecentMetricsResponse => {
  if (!data) {
    return { customerId: undefined, items: [] };
  }

  if (Array.isArray(data)) {
    return { customerId: undefined, items: data };
  }

  if (Array.isArray(data.items)) {
    return { customerId: data.customerId, items: data.items };
  }

  return { customerId: data.customerId, items: [] };
};

const METRICS_ENDPOINT = {
  RECENT: "/metrics/recent",
  SHARES: "/metrics/shares",
  PEOPLE_REACHED: "/metrics/people-reached",
  ERRORS: "/metrics/errors",
  RANKING_PERSONAS: "/metrics/ranking/personas",
  HEATMAP: "/metrics/heatmap",
  DISTRIBUTION_SOCIAL: "/metrics/distribution/social",
} as const;

type GetRecentParams = {
  limit?: number;
};

type GetSharesParams = {
  hours?: number;
};

type GetPeopleReachedParams = {
  hours?: number;
};

type GetErrorsParams = {
  hours?: number;
};

type GetPersonasRankingParams = {
  hours?: number;
  limit?: number;
};

type GetHeatmapParams = {
  days?: number;
};

type GetDistributionSocialParams = {
  hours?: number;
};

export type SharesMetricsResponse = {
  shares: number;
  hours: number;
  customerId: number;
};

export type PeopleReachedResponse = {
  peopleReached: number;
  hours: number;
  customerId: number;
};

export type PersonasRankingItem = {
  account: string;
  actions: number;
};

export type PersonasRankingResponse = PersonasRankingItem[];

export type HeatmapItem = {
  hour: number;
  dayOfWeek: number;
  count: number;
};

export type HeatmapResponse = HeatmapItem[];

export type DistributionSocialResponse = Record<string, number>;

export const metricsService = {
  getRecent: async (
    params: GetRecentParams = {}
  ): Promise<RecentMetricsResponse> => {
    const searchParams = new URLSearchParams();

    if (typeof params.limit === "number") {
      searchParams.append("limit", String(params.limit));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${METRICS_ENDPOINT.RECENT}?${queryString}`
      : METRICS_ENDPOINT.RECENT;

    const data = await api.get<RecentMetricsApiResponse>(endpoint);
    return normalizeRecentMetricsResponse(data);
  },

  getShares: async (
    params: GetSharesParams = {}
  ): Promise<SharesMetricsResponse> => {
    const searchParams = new URLSearchParams();
    const hours = typeof params.hours === "number" ? params.hours : 24;
    searchParams.append("hours", String(hours));

    const queryString = searchParams.toString();
    const endpoint = `${METRICS_ENDPOINT.SHARES}?${queryString}`;

    const data = await api.get<SharesMetricsResponse>(endpoint);
    return data;
  },

  getPeopleReached: async (
    params: GetPeopleReachedParams = {}
  ): Promise<PeopleReachedResponse> => {
    const searchParams = new URLSearchParams();
    const hours = typeof params.hours === "number" ? params.hours : 24;
    searchParams.append("hours", String(hours));

    const queryString = searchParams.toString();
    const endpoint = `${METRICS_ENDPOINT.PEOPLE_REACHED}?${queryString}`;

    return api.get<PeopleReachedResponse>(endpoint);
  },

  getErrors: async (
    params: GetErrorsParams = {}
  ): Promise<{
    errors: number;
    referenceActions: number;
    errorRate: number;
    hours?: number;
  }> => {
    const searchParams = new URLSearchParams();
    const hours = typeof params.hours === "number" ? params.hours : 24;
    searchParams.append("hours", String(hours));

    const queryString = searchParams.toString();
    const endpoint = `${METRICS_ENDPOINT.ERRORS}?${queryString}`;

    return api.get<{
      errors: number;
      referenceActions: number;
      errorRate: number;
    }>(endpoint);
  },

  getPersonasRanking: async (
    params: GetPersonasRankingParams = {}
  ): Promise<PersonasRankingResponse> => {
    const searchParams = new URLSearchParams();
    const hours = typeof params.hours === "number" ? params.hours : 24;
    const limit = typeof params.limit === "number" ? params.limit : 10;
    
    searchParams.append("hours", String(hours));
    searchParams.append("limit", String(limit));

    const queryString = searchParams.toString();
    const endpoint = `${METRICS_ENDPOINT.RANKING_PERSONAS}?${queryString}`;

    return api.get<PersonasRankingResponse>(endpoint);
  },

  getHeatmap: async (
    params: GetHeatmapParams = {}
  ): Promise<HeatmapResponse> => {
    const searchParams = new URLSearchParams();
    const days = typeof params.days === "number" ? params.days : 7;
    
    searchParams.append("days", String(days));

    const queryString = searchParams.toString();
    const endpoint = `${METRICS_ENDPOINT.HEATMAP}?${queryString}`;

    return api.get<HeatmapResponse>(endpoint);
  },

  getDistributionSocial: async (
    params: GetDistributionSocialParams = {}
  ): Promise<DistributionSocialResponse> => {
    const searchParams = new URLSearchParams();
    const hours = typeof params.hours === "number" ? params.hours : 24;
    
    searchParams.append("hours", String(hours));

    const queryString = searchParams.toString();
    const endpoint = `${METRICS_ENDPOINT.DISTRIBUTION_SOCIAL}?${queryString}`;

    return api.get<DistributionSocialResponse>(endpoint);
  },
};
