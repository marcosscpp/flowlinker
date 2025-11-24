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
  slugs?: string[];
};

const SOCIAL_MEDIA_ACCOUNTS_ENDPOINT = {
  ACTIVE_COUNT: "/social-media-accounts/active/count",
  CREATE: "/social-media-accounts",
  AVAILABLE: "/social-media-accounts/search",
  BY_ID: "/social-media-accounts",
  STATUS: "/social-media-accounts",
  CATEGORIES: "/social/categories",
} as const;

type GetActiveCountParams = {
  platform?: SocialMediaPlatform;
};

export type UpdateSocialMediaAccountPayload = Partial<{
  platform: SocialMediaPlatform;
  username: string;
  password: string;
  profileName: string;
  nomePerfil: string;
  slugs: string[];
  status: string;
}>;

export type UpdateStatusPayload = {
  status: string;
};

export type SocialCategoryResponse = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

export const socialMediaAccountsService = {
  normalizeAccount(raw: any): SocialMediaAccountResponse {
    const statusMap: Record<string, string> = {
      ATIVO: "ACTIVE",
      ATIVA: "ACTIVE",
      BLOQUEADO: "BLOCKED",
      BLOQUEADA: "BLOCKED",
      DELETADO: "DELETED",
      DELETADA: "DELETED",
    };

    const normalizedStatus =
      statusMap[String(raw.status ?? "").toUpperCase()] ?? raw.status ?? "";

    return {
      id: Number(raw.id),
      platform: String(raw.platform ?? raw.plataforma ?? ""),
      username: String(raw.username ?? ""),
      password: raw.password ?? "",
      profileName: String(
        raw.profileName ?? raw.perfilName ?? raw.nomePerfil ?? ""
      ),
      status: normalizedStatus,
      hasCookies: Boolean(raw.hasCookies),
      cookiesUpdatedAt: raw.cookiesUpdatedAt ?? "",
      cookiesExpiresAt: raw.cookiesExpiresAt ?? null,
      slugs: Array.isArray(raw.slugs)
        ? raw.slugs
        : Array.isArray(raw.categories)
        ? raw.categories
        : raw.categorySlug
        ? [raw.categorySlug]
        : raw.category?.slug
        ? [raw.category.slug]
        : undefined,
    };
  },
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
    platforms?: SocialMediaPlatform | SocialMediaPlatform[],
    categories?: string[],
    match: "all" | "any" = "any"
  ): Promise<SocialMediaAccountResponse[]> => {
    const searchParams = new URLSearchParams();

    if (Array.isArray(platforms)) {
      platforms
        .filter((platform) => Boolean(platform))
        .forEach((platform) => searchParams.append("platform", platform));
    } else if (platforms) {
      searchParams.append("platform", platforms);
    }

    if (Array.isArray(categories) && categories.length > 0) {
      categories.forEach((category) =>
        searchParams.append("category", category)
      );
    }

    if (match && match !== "any") {
      searchParams.append("match", match);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${SOCIAL_MEDIA_ACCOUNTS_ENDPOINT.AVAILABLE}?${queryString}`
      : SOCIAL_MEDIA_ACCOUNTS_ENDPOINT.AVAILABLE;

    const data = await api.get<any[]>(endpoint);
    if (!Array.isArray(data)) return [];
    return data.map((item) =>
      socialMediaAccountsService.normalizeAccount(item)
    );
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${SOCIAL_MEDIA_ACCOUNTS_ENDPOINT.CREATE}/${id}`);
  },

  update: async (
    id: number,
    payload: UpdateSocialMediaAccountPayload
  ): Promise<SocialMediaAccountResponse> => {
    const normalized: Record<string, unknown> = { ...payload };

    if (normalized.profileName && !normalized.nomePerfil) {
      normalized.nomePerfil = normalized.profileName;
      delete normalized.profileName;
    }

    if (Array.isArray(normalized.slugs) && normalized.slugs.length === 0) {
      delete normalized.slugs;
    }

    Object.keys(normalized).forEach((key) => {
      if (normalized[key] === undefined) {
        delete normalized[key];
      }
    });

    return api.put<SocialMediaAccountResponse>(
      `${SOCIAL_MEDIA_ACCOUNTS_ENDPOINT.BY_ID}/${id}`,
      normalized
    );
  },

  updateStatus: async (
    id: number,
    payload: UpdateStatusPayload
  ): Promise<SocialMediaAccountResponse> => {
    return api.patch<SocialMediaAccountResponse>(
      `${SOCIAL_MEDIA_ACCOUNTS_ENDPOINT.STATUS}/${id}/status`,
      payload
    );
  },

  getCategories: async (): Promise<SocialCategoryResponse[]> => {
    return api.get<SocialCategoryResponse[]>(
      SOCIAL_MEDIA_ACCOUNTS_ENDPOINT.CATEGORIES
    );
  },
};
