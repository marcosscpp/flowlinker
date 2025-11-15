import type { MetricLogItem } from "@/services/metrics";

export type FormattedActivity = {
  id: string;
  timestamp: string;
  actor: string;
  description: string;
  platform?: {
    key: string;
    label: string;
  };
};

export class ActivityLogFormatter {
  private readonly limit: number;
  private readonly items: MetricLogItem[];

  constructor(items: MetricLogItem[] = [], limit = 5) {
    this.items = items;
    this.limit = limit;
  }

  public getActivities(): FormattedActivity[] {
    if (!this.items.length) {
      return [];
    }

    const deduped: MetricLogItem[] = [];
    const seen = new Set<string>();

    for (const item of this.items) {
      if (item.eventId && !seen.has(item.eventId)) {
        deduped.push(item);
        seen.add(item.eventId);
      }
      if (deduped.length === this.limit) {
        break;
      }
    }

    return deduped.slice(0, this.limit).map((item) => ({
      id: item.eventId,
      timestamp: item.eventAt,
      actor: item.account || item.actor || "Conta desconhecida",
      description: ActivityLogFormatter.resolveDescription(item),
      platform: ActivityLogFormatter.resolvePlatform(item),
    }));
  }

  public static formatDate(dateString?: string): string {
    if (!dateString) {
      return "--";
    }

    try {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateString));
    } catch {
      return "--";
    }
  }

  private static resolveVerb(item: MetricLogItem) {
    const type = (item.type || item.eventType || "").toLowerCase();
    if (type.includes("like")) return "curtiu";
    if (type.includes("comment")) return "comentou";
    if (type.includes("share")) return "compartilhou";
    return null;
  }

  private static resolveDescription(item: MetricLogItem): string {
    const verb = ActivityLogFormatter.resolveVerb(item);
    const target = item.groupName ?? item.payload?.account;
    if (verb && target) {
      return `${verb} em "${target}"`;
    }
    if (verb) {
      return verb;
    }
    const cleaned =
      item.text?.replace(/^Evento recebido\s*\((.*)\)$/i, "$1") ??
      item.text ??
      "Executou uma ação";
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  private static resolvePlatform(item: MetricLogItem) {
    const directPlatform =
      typeof item.platform === "string" ? item.platform : undefined;
    const payloadPlatform =
      typeof item.payload === "object" && item.payload !== null
        ? (item.payload as { platform?: string }).platform
        : undefined;

    const resolved = directPlatform ?? payloadPlatform;

    if (!resolved) {
      return undefined;
    }

    const normalized = resolved.toLowerCase();
    if (normalized.includes("facebook")) {
      return { key: "facebook", label: "Facebook" };
    }

    if (normalized.includes("instagram")) {
      return { key: "instagram", label: "Instagram" };
    }

    return { key: normalized, label: resolved };
  }
}
