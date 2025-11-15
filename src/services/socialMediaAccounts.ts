import { api } from "@/services/api";

export type SocialMediaPlatform = "FACEBOOK" | "INSTAGRAM" | string;

export type ActiveAccountsResponse = {
  activeCount: number;
  customerId: number;
};

export type CreateSocialMediaAccountPayload = {
  platform: SocialMediaPlatform;
  username: string;
  password: string;
  profileName: string;
};

export type SocialMediaAccountResponse = {
  id: number;
  platform: SocialMediaPlatform;
  username: string;
  password: string;
  profileName: string;
  status: string;
  hasCookies: boolean;
  cookiesUpdatedAt: string;
  cookiesExpiresAt: string | null;
};

const SOCIAL_MEDIA_ACCOUNTS_ENDPOINT = {
  ACTIVE_COUNT: "/social-media-accounts/active/count",
  CREATE: "/social-media-accounts",
  AVAILABLE: "/social-media-accounts/search",
} as const;

type GetActiveCountParams = {
  platform?: SocialMediaPlatform;
};

export const socialMediaAccountsService = {
  getActiveCount: async (
    params: GetActiveCountParams = {}
  ): Promise<ActiveAccountsResponse> => {
    const searchParams = new URLSearchParams();

    if (params.platform) {
      searchParams.append("platform", params.platform);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${SOCIAL_MEDIA_ACCOUNTS_ENDPOINT.ACTIVE_COUNT}?${queryString}`
      : SOCIAL_MEDIA_ACCOUNTS_ENDPOINT.ACTIVE_COUNT;

    return api.get<ActiveAccountsResponse>(endpoint);
  },

  create: async (
    payload: CreateSocialMediaAccountPayload
  ): Promise<SocialMediaAccountResponse> => {
    return api.post<SocialMediaAccountResponse>(
      SOCIAL_MEDIA_ACCOUNTS_ENDPOINT.CREATE,
      payload
    );
  },

  getAvailable: async (
    platforms?: SocialMediaPlatform | SocialMediaPlatform[]
  ): Promise<SocialMediaAccountResponse[]> => {
    const searchParams = new URLSearchParams();

    if (Array.isArray(platforms)) {
      platforms
        .filter((platform) => Boolean(platform))
        .forEach((platform) => searchParams.append("platform", platform));
    } else if (platforms) {
      searchParams.append("platform", platforms);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${SOCIAL_MEDIA_ACCOUNTS_ENDPOINT.AVAILABLE}?${queryString}`
      : SOCIAL_MEDIA_ACCOUNTS_ENDPOINT.AVAILABLE;

    return api.get<SocialMediaAccountResponse[]>(endpoint);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${SOCIAL_MEDIA_ACCOUNTS_ENDPOINT.CREATE}/${id}`);
  },
};
