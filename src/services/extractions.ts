import { api } from "@/services/api";
import type { PaginatedResponse } from "@/services/campaigns";

// Extração de Grupos (Facebook)
export type ExtractionSummary = {
  id: number;
  extractedAt: string;
  groupsCount: number;
  keywords: string;
  socialAccountUsername: string;
  socialAccountPlatform: string;
  deviceId: string;
  deviceFingerprint: string;
};

export type ExtractionGroup = {
  groupId: number;
  externalId: string;
  name: string;
  url: string;
  memberCount: number;
  lastSeenAt: string;
};

// Extração de Seguidores (Instagram)
export type FollowerExtractionSummary = {
  id: number;
  extractedAt: string;
  followersCount: number;
  followersLimit: number;
  targetUsername: string;
  socialAccountUsername: string;
  socialAccountPlatform: string;
  deviceId: string;
  deviceFingerprint: string;
};

export type FollowerExtractionAccount = {
  accountId: number;
  username: string;
  lastSeenAt: string;
};

const EXTRACTIONS_ENDPOINT = {
  // Extrações de grupos (Facebook)
  GROUPS_SUMMARIES: "/extractions/summaries",
  GROUPS_LIST: (extractionId: number) => `/extractions/${extractionId}/groups`,
  GROUPS_DELETE: (extractionId: number) => `/extractions/${extractionId}`,
  // Extrações de seguidores (Instagram)
  FOLLOWERS_SUMMARIES: "/follower-extractions/summaries",
  FOLLOWERS_LIST: (extractionId: number) =>
    `/follower-extractions/${extractionId}/followers`,
  FOLLOWERS_DELETE: (extractionId: number) =>
    `/follower-extractions/${extractionId}`,
} as const;

type PaginationParams = {
  page?: number;
  size?: number;
};

export const extractionsService = {
  // ===== Extrações de Grupos (Facebook) =====

  /**
   * Lista resumo das extrações de grupos
   */
  getGroupExtractions: async (
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<ExtractionSummary>> => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", String(params.page ?? 0));
    searchParams.append("size", String(params.size ?? 20));

    return api.get<PaginatedResponse<ExtractionSummary>>(
      `${EXTRACTIONS_ENDPOINT.GROUPS_SUMMARIES}?${searchParams.toString()}`
    );
  },

  /**
   * Lista grupos de uma extração específica
   */
  getGroupsByExtraction: async (
    extractionId: number,
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<ExtractionGroup>> => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", String(params.page ?? 0));
    searchParams.append("size", String(params.size ?? 50));

    return api.get<PaginatedResponse<ExtractionGroup>>(
      `${EXTRACTIONS_ENDPOINT.GROUPS_LIST(extractionId)}?${searchParams.toString()}`
    );
  },

  /**
   * Exclui uma extração de grupos
   */
  deleteGroupExtraction: async (extractionId: number): Promise<void> => {
    await api.delete(EXTRACTIONS_ENDPOINT.GROUPS_DELETE(extractionId));
  },

  // ===== Extrações de Seguidores (Instagram) =====

  /**
   * Lista resumo das extrações de seguidores
   */
  getFollowerExtractions: async (
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<FollowerExtractionSummary>> => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", String(params.page ?? 0));
    searchParams.append("size", String(params.size ?? 20));

    return api.get<PaginatedResponse<FollowerExtractionSummary>>(
      `${EXTRACTIONS_ENDPOINT.FOLLOWERS_SUMMARIES}?${searchParams.toString()}`
    );
  },

  /**
   * Lista seguidores de uma extração específica
   */
  getFollowersByExtraction: async (
    extractionId: number,
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<FollowerExtractionAccount>> => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", String(params.page ?? 0));
    searchParams.append("size", String(params.size ?? 50));

    return api.get<PaginatedResponse<FollowerExtractionAccount>>(
      `${EXTRACTIONS_ENDPOINT.FOLLOWERS_LIST(extractionId)}?${searchParams.toString()}`
    );
  },

  /**
   * Exclui uma extração de seguidores
   */
  deleteFollowerExtraction: async (extractionId: number): Promise<void> => {
    await api.delete(EXTRACTIONS_ENDPOINT.FOLLOWERS_DELETE(extractionId));
  },
};
