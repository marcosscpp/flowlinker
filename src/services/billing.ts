import { api } from "@/services/api";

const BILLING_ENDPOINT = {
  PORTAL: "/billing/portal",
} as const;

type OpenPortalParams = {
  returnUrl?: string;
};

type BillingPortalResponse = {
  url: string;
};

export const billingService = {
  openPortal: async (params: OpenPortalParams = {}): Promise<string> => {
    const searchParams = new URLSearchParams();
    if (params.returnUrl) {
      searchParams.append("returnUrl", params.returnUrl);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${BILLING_ENDPOINT.PORTAL}?${queryString}`
      : BILLING_ENDPOINT.PORTAL;

    const response = await api.post<BillingPortalResponse>(endpoint);
    return response.url;
  },
};
