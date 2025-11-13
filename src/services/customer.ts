import { api } from "@/services/api";

export interface CustomerNameResponse {
  name: string;
}

const CUSTOMER_ENDPOINT = {
  ME_NAME: "/customers/me/name",
} as const;

export const customerService = {
  getName: async (): Promise<CustomerNameResponse> => {
    const data = await api.get<CustomerNameResponse>(CUSTOMER_ENDPOINT.ME_NAME);
    return data;
  },
};
