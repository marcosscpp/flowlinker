import { api } from "@/services/api";

export type DeviceStatus = "ACTIVE" | "INACTIVE";
export type DeviceConnectionStatus = "ONLINE" | "IDLE" | "OFFLINE";

export type DeviceResponse = {
  id: number;
  name: string;
  hostName?: string;
  osName?: string;
  osVersion?: string;
  appVersion?: string;
  fingerprint?: string;
  deviceId?: string;
  lastIp?: string;
  status: DeviceStatus;
  connectionStatus?: DeviceConnectionStatus;
  lastSeenAt?: string;
  createdAt?: string;
};

export type DevicesCountsResponse = {
  customerId: number;
  total: number;
  active: number;
  inactive: number;
  allowed: number;
};

const DEVICES_ENDPOINT = {
  LIST: "/devices/mine",
  COUNTS: "/devices/mine/counts",
  STATUS: (deviceId: number) => `/devices/${deviceId}/status`,
  NAME: (deviceId: number) => `/devices/${deviceId}/name`,
} as const;

type ListParams = {
  status?: DeviceStatus;
};

type UpdateStatusPayload = {
  status: DeviceStatus;
};

type UpdateNamePayload = {
  name: string;
};

export const devicesService = {
  list: async (params: ListParams = {}): Promise<DeviceResponse[]> => {
    const searchParams = new URLSearchParams();
    if (params.status) {
      searchParams.append("status", params.status);
    }
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${DEVICES_ENDPOINT.LIST}?${queryString}`
      : DEVICES_ENDPOINT.LIST;
    return api.get<DeviceResponse[]>(endpoint);
  },

  getCounts: async (): Promise<DevicesCountsResponse> => {
    return api.get<DevicesCountsResponse>(DEVICES_ENDPOINT.COUNTS);
  },

  updateStatus: async (
    deviceId: number,
    payload: UpdateStatusPayload
  ): Promise<void> => {
    await api.patch(DEVICES_ENDPOINT.STATUS(deviceId), payload);
  },

  updateName: async (
    deviceId: number,
    payload: UpdateNamePayload
  ): Promise<DeviceResponse> => {
    return api.patch<DeviceResponse>(DEVICES_ENDPOINT.NAME(deviceId), payload);
  },
};
