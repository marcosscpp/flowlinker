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
};
