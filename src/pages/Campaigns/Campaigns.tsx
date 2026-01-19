import { useState, useMemo } from "react";
import clsx from "clsx";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./Campaigns.module.scss";
import {
  PageHeader,
  Badge,
  FilterTabs,
  Pagination,
  QueryState,
  SkeletonCampaigns,
  type FilterOption,
} from "@/components";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Megaphone01Icon,
  FacebookIcon,
  InstagramIcon,
} from "@hugeicons/core-free-icons";
import {
  campaignsService,
  type CampaignListResponse,
  type CampaignStatus,
} from "@/services/campaigns";
import { QUERY_KEYS } from "@/constants";
const PAGE_SIZE = 5;

type FilterStatus = "ALL" | CampaignStatus;

const filterOptions: FilterOption<FilterStatus>[] = [
  { value: "ALL", label: "Todas" },
  { value: "RUNNING", label: "Em execução" },
  { value: "PAUSED", label: "Pausadas" },
  { value: "COMPLETED", label: "Concluídas" },
  { value: "CANCELLED", label: "Canceladas" },
];

const filterLabels: Record<FilterStatus, string> = {
  ALL: "Todas",
  RUNNING: "Em execução",
  PAUSED: "Pausadas",
  COMPLETED: "Concluídas",
  CANCELLED: "Canceladas",
};

const statusLabels: Record<CampaignStatus, string> = {
  RUNNING: "Em execução",
  PAUSED: "Pausada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
};

const statusDotClassMap: Record<CampaignStatus, string> = {
  RUNNING: styles.statusRunning,
  PAUSED: styles.statusPaused,
  COMPLETED: styles.statusCompleted,
  CANCELLED: styles.statusCancelled,
};

const platformIconMap = {
  FACEBOOK: FacebookIcon,
  INSTAGRAM: InstagramIcon,
} as const;

const channelLabels: Record<string, string> = {
  GROUP_SHARE: "Compartilhamento em grupos",
  DIRECT_MESSAGE: "Mensagem direta",
};

const formatDate = (timestamp?: string) => {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

const formatRelativeDate = (timestamp?: string) => {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";
  return formatDistanceToNow(date, { locale: ptBR, addSuffix: true });
};

const Campaigns = () => {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("RUNNING");
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed para o backend
  const [pendingActionId, setPendingActionId] = useState<number | null>(null);

  const {
    data: campaignsData,
    isLoading: loadingCampaigns,
    error: campaignsError,
  } = useQuery({
    queryKey: [QUERY_KEYS.campaigns.list, activeFilter, currentPage, PAGE_SIZE],
    queryFn: () =>
      campaignsService.list({
        status: activeFilter === "ALL" ? undefined : activeFilter,
        page: currentPage,
        size: PAGE_SIZE,
      }),
    staleTime: 1000 * 120, // 2 minutes
    refetchInterval: 1000 * 60, // Refetch every minute
  });

  const cancelMutation = useMutation({
    mutationFn: (campaignId: number) => campaignsService.cancel(campaignId),
    onMutate: (campaignId) => setPendingActionId(campaignId),
    onSettled: () => {
      setPendingActionId(null);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.campaigns.list] });
    },
  });

  const campaigns = campaignsData?.content ?? [];
  const totalItems = campaignsData?.totalElements ?? 0;
  const totalPages = campaignsData?.totalPages ?? 1;

  // Reset para página 0 quando filtro muda
  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
    setCurrentPage(0);
  };

  const badgeText = useMemo(() => {
    if (loadingCampaigns) return "Carregando campanhas...";
    if (campaignsError) return "Erro ao carregar campanhas";

    const filterLabel = filterLabels[activeFilter].toLowerCase();

    if (totalItems === 0) {
      return activeFilter === "ALL"
        ? "Nenhuma campanha encontrada"
        : `Nenhuma campanha ${filterLabel}`;
    }

    const showing = campaigns.length;

    if (activeFilter === "ALL") {
      return `Exibindo ${showing} de ${totalItems} campanha${
        totalItems === 1 ? "" : "s"
      }`;
    }

    return `Exibindo ${showing} de ${totalItems} campanha${
      totalItems === 1 ? "" : "s"
    } ${filterLabel}`;
  }, [
    campaigns.length,
    totalItems,
    activeFilter,
    loadingCampaigns,
    campaignsError,
  ]);

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (!message) return "—";
    if (message.length <= maxLength) return message;
    return `${message.substring(0, maxLength)}...`;
  };

  const renderCampaignCard = (campaign: CampaignListResponse) => {
    const isUpdating = pendingActionId === campaign.campaignId;
    const canCancel =
      campaign.status === "RUNNING" || campaign.status === "PAUSED";

    const totalItems = campaign.totalItems ?? 0;
    const processedItems = campaign.lastProcessedIndex ?? 0;
    const progressPercentage =
      campaign.completionPercentage ??
      (totalItems > 0 ? Math.round((processedItems / totalItems) * 100) : 0);

    const PlatformIcon =
      platformIconMap[campaign.platform as keyof typeof platformIconMap];

    return (
      <article key={campaign.campaignId} className={styles.campaignCard}>
        <div className={styles.campaignHeader}>
          <div className={styles.campaignInfo}>
            {PlatformIcon && (
              <span
                className={clsx(
                  styles.platformIcon,
                  styles[`platform-${campaign.platform?.toLowerCase()}`]
                )}
              >
                <HugeiconsIcon icon={PlatformIcon} size="1.5rem" />
              </span>
            )}
            <div className={styles.campaignTexts}>
              <div className={styles.campaignTitleRow}>
                <p className={clsx("body-lg-semibold", styles.campaignName)}>
                  {campaign.name || "Campanha sem nome"}
                </p>
                <span
                  className={clsx(
                    styles.statusBadge,
                    styles[`status-${campaign.status.toLowerCase()}`]
                  )}
                >
                  <span
                    className={clsx(
                      styles.statusDot,
                      statusDotClassMap[campaign.status]
                    )}
                  />
                  {statusLabels[campaign.status]}
                </span>
              </div>
              <p className={styles.campaignMeta}>
                {channelLabels[campaign.channel] || campaign.channel}
                {" • "}
                Criada {formatRelativeDate(campaign.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.campaignBody}>
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>Progresso</span>
              <span className={styles.progressValue}>
                {processedItems} / {totalItems} ({progressPercentage}%)
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.max(progressPercentage, 2)}%` }}
              />
            </div>
          </div>

          <div className={styles.campaignDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Dispositivo</span>
              <span className={styles.detailValue}>
                {campaign.device?.name || campaign.device?.hostname || "—"}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Iniciada em</span>
              <span className={styles.detailValue}>
                {formatDate(campaign.startedAt)}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Contas</span>
              <div className={styles.accountsList}>
                {campaign.accounts?.slice(0, 3).map((account) => (
                  <span key={account.id} className={styles.accountBadge}>
                    <span
                      className={clsx(
                        styles.accountDot,
                        !account.hasCookies && styles.inactive
                      )}
                    />
                    {account.perfilName || account.username}
                  </span>
                ))}
                {campaign.accounts?.length > 3 && (
                  <span className={styles.accountBadge}>
                    +{campaign.accounts.length - 3}
                  </span>
                )}
              </div>
            </div>

            {campaign.message && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Mensagem</span>
                <span className={styles.detailValue} title={campaign.message}>
                  {truncateMessage(campaign.message, 40)}
                </span>
              </div>
            )}
          </div>

          {canCancel && (
            <div className={styles.campaignFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => cancelMutation.mutate(campaign.campaignId)}
                disabled={isUpdating}
              >
                <HugeiconsIcon icon={Cancel01Icon} size="1.25rem" />
                Cancelar campanha
              </button>
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <section className={styles.container}>
      <PageHeader
        title="Campanhas"
        subtitle="Gerencie suas campanhas de automação em redes sociais."
      />

      <FilterTabs
        options={filterOptions}
        value={activeFilter}
        onChange={handleFilterChange}
      />

      <Badge className={styles.counterBadge}>{badgeText}</Badge>

      <div className={styles.campaignsList} data-tourid="campaigns-list">
        <QueryState
          isLoading={loadingCampaigns}
          error={campaignsError}
          hasData={campaigns.length > 0}
          skeleton={<SkeletonCampaigns count={PAGE_SIZE} />}
          errorText="Não foi possível carregar as campanhas. Tente novamente em instantes."
          emptyClassName={styles.emptyWrapper}
          emptyState={
            <div className={styles.emptyState}>
              <HugeiconsIcon
                icon={Megaphone01Icon}
                size="4rem"
                className={styles.emptyIcon}
              />
              <p className={clsx("body-lg-semibold", styles.emptyTitle)}>
                {activeFilter === "ALL"
                  ? "Nenhuma campanha encontrada"
                  : `Nenhuma campanha ${filterLabels[
                      activeFilter
                    ].toLowerCase()}`}
              </p>
              <p className={styles.emptyDescription}>
                {activeFilter === "ALL"
                  ? "As campanhas criadas no Flowlinker Desktop aparecerão aqui."
                  : "Tente selecionar outro filtro ou aguarde novas campanhas."}
              </p>
            </div>
          }
        >
          {campaigns.map(renderCampaignCard)}
        </QueryState>
      </div>

      {!loadingCampaigns && !campaignsError && totalItems > 0 && (
        <Pagination
          currentPage={currentPage + 1} // UI mostra 1-indexed
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page - 1)} // Converte para 0-indexed
          disabled={loadingCampaigns}
        />
      )}
    </section>
  );
};

export default Campaigns;
