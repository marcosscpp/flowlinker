import { api } from "@/services/api";

export interface LatestReleaseResponse {
  url: string;
}

const APP_RELEASES_ENDPOINT = {
  LATEST: "/app/releases/latest", 
} as const;

export const appReleasesService = {
  getLatest: async (): Promise<LatestReleaseResponse> => {
    const endpoint = APP_RELEASES_ENDPOINT.LATEST;

    const data = await api.get<LatestReleaseResponse>(endpoint);
    return data;
  },
};
