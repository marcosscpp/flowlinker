import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileDownloadIcon,
  Search01FreeIcons,
  Analytics01Icon,
  Calendar03Icon,
  Share08Icon,
  SentIcon,
  UserMultiple03Icon,
  Link04Icon,
} from "@hugeicons/core-free-icons";
import { Button, Pagination, Loader, Field, Modal } from "@/components";
import { campaignReportsService } from "@/services/campaignReports";
import type {
  CampaignDetailItem,
  ShareEvent,
  DirectMessageEvent,
} from "@/services/campaignReports";
import { useToast } from "@/context";
import { QUERY_KEYS } from "@/constants";
import styles from "./CampaignReportsSection.module.scss";

const PAGE_SIZE = 10;

const getDefaultDateRange = () => {
  const now = new Date();
  const end = format(now, "yyyy-MM-dd");
  const start = format(
    new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    "yyyy-MM-dd"
  );
  return { start, end };
};

const campaignTypeLabels: Record<string, string> = {
  FB_GROUP_SHARE: "Grupos",
  DIRECT_MESSAGE: "Mensagem Direta",
  INSTAGRAM_DM: "DM Instagram",
  WHATSAPP_MESSAGE: "WhatsApp",
};

const platformLabels: Record<string, string> = {
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  WHATSAPP: "WhatsApp",
  TWITTER: "Twitter",
};

const formatDateBR = (timestamp?: string | null) => {
  if (!timestamp) return "—";
  // Remove sufixo [Timezone] que o Java ZonedDateTime inclui (ex: [America/Sao_Paulo])
  const cleaned = timestamp.replace(/\[.*\]$/, "");
  const date = new Date(cleaned);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "dd/MM/yyyy HH:mm");
};

/* ---- Sub-componente: Lista de Shares em cards ---- */
const SharesList = ({ shares }: { shares: ShareEvent[] }) => {
  if (shares.length === 0) {
    return (
      <p className={styles.modalEmptyText}>
        Nenhum compartilhamento registrado.
      </p>
    );
  }

  return (
    <div className={styles.eventCardList}>
      {shares.map((s) => (
        <div key={s.eventId} className={styles.eventCard}>
          <div className={styles.eventCardHeader}>
            <span className={styles.eventCardAccount}>{s.account}</span>
            <span className={styles.eventCardDate}>
              {formatDateBR(s.eventAtLocal || s.eventAt)}
            </span>
          </div>
          <div className={styles.eventCardBody}>
            <div className={styles.eventCardRow}>
              <span className={styles.eventCardLabel}>Grupo</span>
              <span className={styles.eventCardValue}>
                {s.groupUrl ? (
                  <a
                    href={s.groupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.groupLink}
                    title={s.groupName}
                  >
                    {s.groupName}
                    <HugeiconsIcon icon={Link04Icon} size="0.875rem" />
                  </a>
                ) : (
                  s.groupName || "—"
                )}
              </span>
            </div>
            <div className={styles.eventCardRow}>
              <span className={styles.eventCardLabel}>Membros</span>
              <span className={styles.eventCardValue}>
                {s.groupMembers || "—"}
              </span>
            </div>
            {s.post && (
              <div className={styles.eventCardRow}>
                <span className={styles.eventCardLabel}>Post</span>
                <span className={styles.eventCardValueWrap} title={s.post}>
                  {s.post.length > 100 ? `${s.post.slice(0, 100)}...` : s.post}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---- Sub-componente: Lista de DMs em cards ---- */
const DirectMessagesList = ({
  messages,
}: {
  messages: DirectMessageEvent[];
}) => {
  if (messages.length === 0) {
    return (
      <p className={styles.modalEmptyText}>
        Nenhuma mensagem direta registrada.
      </p>
    );
  }

  return (
    <div className={styles.eventCardList}>
      {messages.map((m) => (
        <div key={m.eventId} className={styles.eventCard}>
          <div className={styles.eventCardHeader}>
            <span className={styles.eventCardAccount}>{m.account}</span>
            <span className={styles.eventCardDate}>
              {formatDateBR(m.eventAtLocal || m.eventAt)}
            </span>
          </div>
          <div className={styles.eventCardBody}>
            <div className={styles.eventCardRow}>
              <span className={styles.eventCardLabel}>Destinatário</span>
              <span className={styles.eventCardValue}>
                {m.recipientName || "—"}
              </span>
            </div>
            {m.message && (
              <div className={styles.eventCardRow}>
                <span className={styles.eventCardLabel}>Mensagem</span>
                <span className={styles.eventCardValueWrap} title={m.message}>
                  {m.message.length > 150
                    ? `${m.message.slice(0, 150)}...`
                    : m.message}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---- Componente principal ---- */
const CampaignReportsSection = () => {
  const defaults = getDefaultDateRange();
  const toast = useToast();
  const [startDate, setStartDate] = useState(defaults.start);
  const [endDate, setEndDate] = useState(defaults.end);
  const [currentPage, setCurrentPage] = useState(0);
  const [isExporting, setIsExporting] = useState<"xlsx" | "pdf" | null>(null);
  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignDetailItem | null>(null);

  const [searchParams, setSearchParams] = useState({
    start: defaults.start,
    end: defaults.end,
  });

  const {
    data: detailsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      QUERY_KEYS.campaignReports.details,
      searchParams.start,
      searchParams.end,
      currentPage,
      PAGE_SIZE,
    ],
    queryFn: () =>
      campaignReportsService.getDetails({
        start: searchParams.start,
        end: searchParams.end,
        tz: "America/Sao_Paulo",
        page: currentPage,
        size: PAGE_SIZE,
      }),
    staleTime: 1000 * 120,
  });

  const handleSearch = () => {
    setSearchParams({ start: startDate, end: endDate });
    setCurrentPage(0);
  };

  const handleExport = async (fmt: "xlsx" | "pdf") => {
    setIsExporting(fmt);
    try {
      await campaignReportsService.exportFile({
        start: searchParams.start,
        end: searchParams.end,
        tz: "America/Sao_Paulo",
        format: fmt,
      });
      toast.success(`Arquivo ${fmt.toUpperCase()} exportado com sucesso`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error(`Falha ao exportar ${fmt.toUpperCase()}: ${message}`);
    } finally {
      setIsExporting(null);
    }
  };

  const campaigns = detailsData?.items ?? [];
  const totalItems = detailsData?.total ?? 0;
  const totalPages = Math.max(Math.ceil(totalItems / PAGE_SIZE), 1);

  const renderRow = (item: CampaignDetailItem) => {
    const hasDetails =
      item.shares.length > 0 || item.directMessages.length > 0;

    return (
      <tr
        key={item.campaignId}
        className={hasDetails ? styles.clickableRow : undefined}
        onClick={() => hasDetails && setSelectedCampaign(item)}
        title={hasDetails ? "Clique para ver detalhes" : undefined}
      >
        <td title={item.campaignName}>{item.campaignName || "—"}</td>
        <td>{platformLabels[item.platform] || item.platform || "—"}</td>
        <td className={styles.numberCell}>{item.sharesCount}</td>
        <td className={styles.numberCell}>{item.directMessagesCount}</td>
        <td className={styles.numberCell}>{item.total}</td>
      </tr>
    );
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className="body-lg-semibold">Relatórios de Campanhas</h3>
        <p className="body-sm">
          Consulte detalhes e exporte relatórios das suas campanhas
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.dateFields}>
          <Field
            type="date"
            label="Data início"
            id="report-start"
            name="report-start"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            leftIcon={<HugeiconsIcon icon={Calendar03Icon} />}
            showLeftIcon
          />
          <Field
            type="date"
            label="Data fim"
            id="report-end"
            name="report-end"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            leftIcon={<HugeiconsIcon icon={Calendar03Icon} />}
            showLeftIcon
          />
        </div>

        <div className={styles.actions}>
          <Button
            onClick={handleSearch}
            leftIcon={<HugeiconsIcon icon={Search01FreeIcons} />}
          >
            Buscar
          </Button>

          <div className={styles.exportGroup}>
            <Button
              variant="secondary"
              onClick={() => handleExport("xlsx")}
              isLoading={isExporting === "xlsx"}
              disabled={isExporting !== null || totalItems === 0}
              leftIcon={<HugeiconsIcon icon={FileDownloadIcon} />}
            >
              Exportar XLSX
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleExport("pdf")}
              isLoading={isExporting === "pdf"}
              disabled={isExporting !== null || totalItems === 0}
              leftIcon={<HugeiconsIcon icon={FileDownloadIcon} />}
            >
              Exportar PDF
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.emptyState}>
          <Loader />
        </div>
      ) : error ? (
        <div className={styles.emptyState}>
          <p className="body-sm">
            Erro ao carregar relatórios. Tente novamente.
          </p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className={styles.emptyState}>
          <HugeiconsIcon
            icon={Analytics01Icon}
            size="3rem"
            className={styles.emptyIcon}
          />
          <p className="body-lg-semibold">Nenhum dado encontrado</p>
          <p className="body-sm">Ajuste o período e tente novamente.</p>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Plataforma</th>
                  <th>Compartilhamentos</th>
                  <th>Mensagens</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>{campaigns.map(renderRow)}</tbody>
            </table>
          </div>

          <div className={styles.footerRow}>
            <span className={styles.resultCount}>
              {totalItems} resultado{totalItems !== 1 ? "s" : ""}
            </span>
            <Pagination
              currentPage={currentPage + 1}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page - 1)}
              disabled={isLoading}
            />
          </div>
        </>
      )}

      {/* ---- Modal de detalhes ---- */}
      <Modal
        isOpen={selectedCampaign !== null}
        onClose={() => setSelectedCampaign(null)}
        title={selectedCampaign?.campaignName ?? "Detalhes da Campanha"}
        size="lg"
      >
        {selectedCampaign && (
          <div className={styles.modalContent}>
            {/* Info cards */}
            <div className={styles.modalInfoGrid}>
              <div className={styles.modalInfoCard}>
                <span className={styles.modalInfoLabel}>Plataforma</span>
                <span className={styles.modalInfoValue}>
                  {platformLabels[selectedCampaign.platform] ||
                    selectedCampaign.platform}
                </span>
              </div>
              <div className={styles.modalInfoCard}>
                <span className={styles.modalInfoLabel}>Tipo</span>
                <span className={styles.modalInfoValue}>
                  {campaignTypeLabels[selectedCampaign.campaignType] ||
                    selectedCampaign.campaignType}
                </span>
              </div>
              <div className={styles.modalInfoCard}>
                <span className={styles.modalInfoLabel}>Iniciada em</span>
                <span className={styles.modalInfoValue}>
                  {formatDateBR(
                    selectedCampaign.startedAtLocal ||
                      selectedCampaign.startedAt
                  )}
                </span>
              </div>
              <div className={styles.modalInfoCard}>
                <span className={styles.modalInfoLabel}>Concluída em</span>
                <span className={styles.modalInfoValue}>
                  {formatDateBR(
                    selectedCampaign.completedAtLocal ||
                      selectedCampaign.completedAt
                  )}
                </span>
              </div>
            </div>

            {/* Stats badges */}
            <div className={styles.modalStatsBadges}>
              <div className={styles.modalBadge}>
                <HugeiconsIcon icon={Share08Icon} size="1.25rem" />
                <span>
                  {selectedCampaign.sharesCount} compartilhamento
                  {selectedCampaign.sharesCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className={styles.modalBadge}>
                <HugeiconsIcon icon={SentIcon} size="1.25rem" />
                <span>
                  {selectedCampaign.directMessagesCount} mensagen
                  {selectedCampaign.directMessagesCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className={styles.modalBadge}>
                <HugeiconsIcon icon={UserMultiple03Icon} size="1.25rem" />
                <span>{selectedCampaign.total} itens no total</span>
              </div>
            </div>

            {/* Shares */}
            {selectedCampaign.shares.length > 0 && (
              <div className={styles.modalSection}>
                <h4 className={styles.modalSectionTitle}>
                  <HugeiconsIcon icon={Share08Icon} size="1.25rem" />
                  Compartilhamentos ({selectedCampaign.shares.length})
                </h4>
                <SharesList shares={selectedCampaign.shares} />
              </div>
            )}

            {/* Direct Messages */}
            {selectedCampaign.directMessages.length > 0 && (
              <div className={styles.modalSection}>
                <h4 className={styles.modalSectionTitle}>
                  <HugeiconsIcon icon={SentIcon} size="1.25rem" />
                  Mensagens Diretas ({selectedCampaign.directMessages.length})
                </h4>
                <DirectMessagesList
                  messages={selectedCampaign.directMessages}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CampaignReportsSection;
