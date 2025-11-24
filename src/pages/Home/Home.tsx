import { useMemo, useState } from "react";
import type { ReactNode } from "react";
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
  const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
  const { data: customerData, isLoading: loadingCustomer } = useQuery({
    queryKey: ["customer"],
    queryFn: () => customerService.getName(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const { data: latestReleaseData } = useQuery({
    queryKey: ["latestRelease"],
    queryFn: () => appReleasesService.getLatest(),
    staleTime: Infinity,
  });
  const {
    data: metricsData,
    isLoading: loadingMetrics,
    error: metricsError,
  } = useQuery({
    queryKey: ["recentMetrics", 8],
    queryFn: () => metricsService.getRecent({ limit: 20 }),
  });

  const { data: activeAccountsData, isLoading: loadingActiveAccounts } =
    useQuery({
      queryKey: ["activeAccounts"],
      queryFn: () => socialMediaAccountsService.getActiveCount(),
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    });

  const { data: shareMetricsData, isLoading: loadingShares } = useQuery({
    queryKey: ["shareMetrics", 24],
    queryFn: () => metricsService.getShares({ hours: 24 }),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: peopleReachedData, isLoading: loadingPeopleReached } = useQuery(
    {
      queryKey: ["peopleReached", 24],
      queryFn: () => metricsService.getPeopleReached({ hours: 24 }),
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  );

  const { data: errorsData, isLoading: loadingErrors } = useQuery({
    queryKey: ["errorsMetrics", 24],
    queryFn: () => metricsService.getErrors({ hours: 24 }),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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

  const getPlatformClass = (platformKey?: string) => {
    if (!platformKey) return undefined;
    if (platformKey === "facebook") return styles.platformFacebook;
    if (platformKey === "instagram") return styles.platformInstagram;
    return undefined;
  };

  const renderActivityText = (item: FormattedActivity): ReactNode => (
    <>
      <span className={styles.activitiesActor}>{item.actor}</span>{" "}
      {item.description}
      {item.platform && (
        <>
          {" "}
          (
          <span
            className={clsx(
              styles.activitiesPlatform,
              getPlatformClass(item.platform.key)
            )}
          >
            {item.platform.label}
          </span>
          )
        </>
      )}
    </>
  );

  const downloadUrl = latestReleaseData?.url;

  const handleConfirmDownload = () => {
    if (!downloadUrl) return;
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
    setDownloadModalOpen(false);
  };

  if (isLoading || !hasData) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <PageHeader
        title={`Bem-vindo ao Flowlinker ${customerData.name}!`}
        subtitle="Aqui você acompanha o desempenho das automações, monitora as personas ativas e visualiza os resultados das ações em tempo real."
      />
      <Button
        className={styles.downloadButton}
        fullWidth
        leftIcon={<HugeiconsIcon icon={Download02Icon} />}
        onClick={() => setDownloadModalOpen(true)}
        disabled={!downloadUrl}
      >
        Baixar Flowlinker Desktop
      </Button>
      <section className={styles.content}>
        <div className={styles.mainStack}>
          <div className={styles.kpiGrid}>
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

          <div className={styles.activitiesCard}>
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
                    href="https://wa.me/5511970253645"
                    className={clsx(styles.infoLink, "body-sm")}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    (11) 97025-3645
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
        isOpen={isDownloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Baixar Flowlinker"
        footer={
          <>
            <ModalGhostButton onClick={() => setDownloadModalOpen(false)}>
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
    </>
  );
};

export default Home;
