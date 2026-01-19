import { useMemo } from "react";
import type { ReactNode } from "react";
import { useModal } from "@/hooks";
import { QUERY_KEYS } from "@/constants";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import {
  PageHeader,
  FullScreenLoader,
  Button,
  Modal,
  ModalGhostButton,
} from "@/components";
import { KpiCard } from "@/components/UI/KpiCard";
import {
  appReleasesService,
  customerService,
  metricsService,
  socialMediaAccountsService,
} from "@/services";
import styles from "./Home.module.scss";
import { ActivityLogFormatter, type FormattedActivity } from "@/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Mail02Icon,
  WhatsappIcon,
  Download02Icon,
} from "@hugeicons/core-free-icons";

const Home = () => {
  const downloadModal = useModal();
  const { data: customerData, isLoading: loadingCustomer } = useQuery({
    queryKey: [QUERY_KEYS.customer],
    queryFn: () => customerService.getName(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const { data: latestReleaseData } = useQuery({
    queryKey: [QUERY_KEYS.latestRelease],
    queryFn: () => appReleasesService.getLatest(),
    staleTime: Infinity,
  });
  const {
    data: metricsData,
    isLoading: loadingMetrics,
    error: metricsError,
  } = useQuery({
    queryKey: [QUERY_KEYS.metrics.recent],
    queryFn: () => metricsService.getRecent({ limit: 20 }),
  });

  // Queries de métricas com staleTime para evitar refetch desnecessário
  // staleTime: dados considerados "frescos" por 2 minutos, evitando chamadas repetidas
  const METRICS_STALE_TIME = 1000 * 60 * 2; // 2 minutos

  const { data: activeAccountsData, isLoading: loadingActiveAccounts } =
    useQuery({
      queryKey: [QUERY_KEYS.accounts.active],
      queryFn: () => socialMediaAccountsService.getActiveCount(),
      staleTime: METRICS_STALE_TIME,
    });

  const { data: shareMetricsData, isLoading: loadingShares } = useQuery({
    queryKey: [QUERY_KEYS.metrics.shares, 24],
    queryFn: () => metricsService.getShares({ hours: 24 }),
    staleTime: METRICS_STALE_TIME,
  });

  const { data: peopleReachedData, isLoading: loadingPeopleReached } = useQuery(
    {
      queryKey: [QUERY_KEYS.metrics.peopleReached, 24],
      queryFn: () => metricsService.getPeopleReached({ hours: 24 }),
      staleTime: METRICS_STALE_TIME,
    }
  );

  const { data: errorsData, isLoading: loadingErrors } = useQuery({
    queryKey: [QUERY_KEYS.metrics.errors, 24],
    queryFn: () => metricsService.getErrors({ hours: 24 }),
    staleTime: METRICS_STALE_TIME,
  });

  const isLoading = loadingCustomer && !customerData;
  const hasData = customerData;

  const MAX_ACTIVITIES = 5;

  const activityFormatter = useMemo(
    () => new ActivityLogFormatter(metricsData?.items ?? [], MAX_ACTIVITIES),
    [metricsData]
  );

  const activityItems = useMemo(
    () => activityFormatter.getActivities(),
    [activityFormatter]
  );

  const formatEventDate = ActivityLogFormatter.formatDate;

  const renderActivityText = (item: FormattedActivity): ReactNode => {
    return item.description;
  };

  const downloadUrl = latestReleaseData?.url;

  const TRUSTED_DOWNLOAD_DOMAINS = [
    "flowlinker.com.br",
    "api.flowlinker.com.br",
    "github.com",
    "releases.flowlinker.com.br",
    "flowlinker-releases.s3.us-east-2.amazonaws.com"
  ];

  const isUrlTrusted = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return TRUSTED_DOWNLOAD_DOMAINS.some(
        (domain) =>
          parsedUrl.hostname === domain ||
          parsedUrl.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  };

  const handleConfirmDownload = () => {
    if (!downloadUrl) return;

    // Valida se a URL pertence a um domínio confiável antes de redirecionar
    if (!isUrlTrusted(downloadUrl)) {
      console.warn("Tentativa de redirecionamento para domínio não confiável:", downloadUrl);
      return;
    }

    window.open(downloadUrl, "_blank", "noopener,noreferrer");
    downloadModal.close();
  };

  if (isLoading || !hasData) {
    return <FullScreenLoader />;
  }

  return (
    <div className={styles.container}>
      <PageHeader
        title={`Bem-vindo ao Flowlinker ${customerData.name}!`}
        subtitle="Aqui você acompanha o desempenho das automações, monitora as personas ativas e visualiza os resultados das ações em tempo real."
      />
      <div data-tourid="home-download">
        <Button
          className={styles.downloadButton}
          fullWidth
          leftIcon={<HugeiconsIcon icon={Download02Icon} />}
          onClick={downloadModal.open}
          disabled={!downloadUrl}
        >
          Baixar Flowlinker Desktop
        </Button>
      </div>
      <section className={styles.content}>
        <div className={styles.mainStack}>
          <div className={styles.kpiGrid} data-tourid="home-kpis">
            <KpiCard
              label="Total de contas ativas"
              value={activeAccountsData?.activeCount ?? 0}
              loading={loadingActiveAccounts}
            />
            <KpiCard
              label="Compartilhamentos nas últimas 24 horas"
              value={shareMetricsData?.shares ?? 0}
              loading={loadingShares}
              tooltip="Somatório das ações de compartilhamento realizadas nas últimas 24 horas."
            />
            <KpiCard
              label="Pessoas atingidas nas últimas 24 horas"
              value={peopleReachedData?.peopleReached ?? 0}
              loading={loadingPeopleReached}
              tooltip="O cálculo é feito com base na quantidade de pessoas por grupo multiplicada pela quantidade de compartilhamentos em um período de 24 horas."
            />
            <KpiCard
              label="Erros nas últimas 24 horas"
              value={errorsData?.errors ?? 0}
              loading={loadingErrors}
            />
          </div>

          <div className={styles.activitiesCard} data-tourid="home-activities">
            <header className={styles.activitiesHeader}>
              <p className="body-lg-semibold">Atividades Recentes</p>
              <p className="body-sm">
                Aqui você acompanha as últimas ações executadas pelo Flowlinker
              </p>
            </header>
            <ul className={styles.activitiesList}>
              {loadingMetrics && (
                <li className={styles.activitiesPlaceholder}>
                  <span className={clsx("body-sm", styles.activitiesRecord)}>
                    Carregando atividades recentes...
                  </span>
                  <span className={clsx("body-sm", styles.activitiesTime)}>
                    --
                  </span>
                </li>
              )}
              {!loadingMetrics && metricsError && (
                <li className={styles.activitiesPlaceholder}>
                  <span className={clsx("body-sm", styles.activitiesRecord)}>
                    Não foi possível carregar as atividades. Tente novamente
                    mais tarde.
                  </span>
                  <span className={clsx("body-sm", styles.activitiesTime)}>
                    --
                  </span>
                </li>
              )}
              {!loadingMetrics &&
                !metricsError &&
                activityItems.length === 0 && (
                  <li className={styles.activitiesPlaceholder}>
                    <span className={clsx("body-sm", styles.activitiesRecord)}>
                      Nenhuma atividade registrada nas últimas horas.
                    </span>
                    <span className={clsx("body-sm", styles.activitiesTime)}>
                      --
                    </span>
                  </li>
                )}
              {activityItems.map((item) => (
                <li key={item.id}>
                  <span className={clsx("body-sm", styles.activitiesRecord)}>
                    {renderActivityText(item)}
                  </span>
                  <span className={clsx("body-sm", styles.activitiesTime)}>
                    {formatEventDate(item.timestamp)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.info}>
          <article className={styles.infoCard}>
            <header>
              <p className="body-lg-semibold">Suporte & Central de Ajuda</p>
            </header>
            <ul className={clsx(styles.infoList, "body-sm")}>
              <li className={styles.infoItem}>
                <span className={styles.infoIcon} aria-hidden>
                  <HugeiconsIcon icon={Mail02Icon} size={28} />
                </span>
                <div className={styles.infoText}>
                  <a
                    href="mailto:suporte@flowlinker.com"
                    className={clsx(styles.infoLink, "body-sm")}
                  >
                    suporte@flowlinker.com
                  </a>
                </div>
              </li>
              <li className={styles.infoItem}>
                <span className={styles.infoIcon} aria-hidden>
                  <HugeiconsIcon icon={WhatsappIcon} size={28} />
                </span>
                <div className={styles.infoText}>
                  <a
                    href="https://wa.me/5511947715632"
                    className={clsx(styles.infoLink, "body-sm")}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    +55 11 94771-5632
                  </a>
                </div>
              </li>
              <li className={styles.infoItem}>
                <span className={styles.infoIcon} aria-hidden>
                  <HugeiconsIcon icon={Clock01Icon} size={28} />
                </span>
                <div className={styles.infoText}>
                  <span className={clsx("body-sm", "text-gray-400")}>
                    Seg a Sex, 9h-18h
                  </span>
                </div>
              </li>
            </ul>
          </article>

          <article className={styles.infoCard}>
            <header>
              <p className="body-lg-semibold">Comunicados gerais</p>
            </header>
            <div className={styles.cardBody}>
              <p className="body-sm">
                O suporte estará indisponível neste sábado (manutenção
                programada).
              </p>
              <p className="body-sm">
                Seu plano será renovado automaticamente amanhã.
              </p>
            </div>
          </article>

          <article className={styles.infoCard}>
            <header>
              <p className="body-lg-semibold">Atualizações</p>
            </header>
            <ul className={clsx(styles.updatesList, "body-sm")}>
              <li>
                <strong>v1.4.2</strong> - Novo painel de personas e melhorias de
                estabilidade.
              </li>
              <li>
                <strong>v1.4.1</strong> - Correção na reautenticação do
                Instagram.
              </li>
            </ul>
            {/* <a
              href="/releases"
              className={clsx(styles.infoLink, "body-sm", "text-gray-900")}
            >
              Veja todas as atualizações
            </a> */}
          </article>
        </div>
      </section>

      <Modal
        isOpen={downloadModal.isOpen}
        onClose={downloadModal.close}
        title="Baixar Flowlinker"
        footer={
          <>
            <ModalGhostButton onClick={downloadModal.close}>
              Cancelar
            </ModalGhostButton>
            <Button
              onClick={handleConfirmDownload}
              disabled={!downloadUrl}
              leftIcon={<HugeiconsIcon icon={Download02Icon} />}
            >
              Prosseguir com download
            </Button>
          </>
        }
      >
        <p className="body-md">
          Você será redirecionado para baixar a versão mais recente do
          Flowlinker para desktop. Confirme para continuar o download.
        </p>
        {!downloadUrl ? (
          <p className={styles.downloadWarning}>
            O link de download ainda não está disponível. Tente novamente em
            instantes.
          </p>
        ) : null}
      </Modal>
    </div>
  );
};

export default Home;
