/**
 * Constantes centralizadas para query keys do React Query.
 *
 * Padrão de nomenclatura:
 * - Usar camelCase
 * - Prefixo indica o domínio/serviço
 * - Sufixo indica o tipo de dados quando necessário
 *
 * @example
 * // Uso básico
 * queryKey: [QUERY_KEYS.customer]
 *
 * // Com parâmetros
 * queryKey: [QUERY_KEYS.metrics.shares, { hours: 24 }]
 */
export const QUERY_KEYS = {
  // Customer
  customer: "customer",

  // App Releases
  latestRelease: "latestRelease",

  // Metrics
  metrics: {
    recent: "metrics.recent",
    shares: "metrics.shares",
    peopleReached: "metrics.peopleReached",
    errors: "metrics.errors",
    heatmap: "metrics.heatmap",
    distributionSocial: "metrics.distributionSocial",
  },

  // Social Media Accounts
  accounts: {
    active: "accounts.active",
    available: "accounts.available",
    categories: "accounts.categories",
    personasRanking: "accounts.personasRanking",
  },

  // Devices
  devices: {
    list: "devices.list",
    counts: "devices.counts",
  },

  // Campaigns
  campaigns: {
    list: "campaigns.list",
  },

  // Billing
  billing: {
    portal: "billing.portal",
  },
} as const;

// Type helper para extrair os valores das query keys
export type QueryKeyValue =
  | typeof QUERY_KEYS.customer
  | typeof QUERY_KEYS.latestRelease
  | typeof QUERY_KEYS.metrics[keyof typeof QUERY_KEYS.metrics]
  | typeof QUERY_KEYS.accounts[keyof typeof QUERY_KEYS.accounts]
  | typeof QUERY_KEYS.devices[keyof typeof QUERY_KEYS.devices]
  | typeof QUERY_KEYS.campaigns[keyof typeof QUERY_KEYS.campaigns]
  | typeof QUERY_KEYS.billing[keyof typeof QUERY_KEYS.billing];
