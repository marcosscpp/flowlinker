import { useQuery } from "@tanstack/react-query";
import { KpiCard } from "@/components/UI/KpiCard";
import clsx from "clsx";
import {
  metricsService,
  socialMediaAccountsService,
} from "@/services";
import { QUERY_KEYS } from "@/constants";
import chartStyles from "./Chart.module.scss";
import styles from "./SummaryCard.module.scss";

interface SummaryCardProps {
  hours?: number;
}

const SummaryCard = ({ hours = 24 }: SummaryCardProps) => {
  const { data: activeAccountsData, isLoading: loadingActiveAccounts } =
    useQuery({
      queryKey: [QUERY_KEYS.accounts.active],
      queryFn: () => socialMediaAccountsService.getActiveCount(),
    });

  const { data: sharesData, isLoading: loadingShares } = useQuery({
    queryKey: [QUERY_KEYS.metrics.shares, hours],
    queryFn: () => metricsService.getShares({ hours }),
  });

  const { data: peopleReachedData, isLoading: loadingPeopleReached } =
    useQuery({
      queryKey: [QUERY_KEYS.metrics.peopleReached, hours],
      queryFn: () => metricsService.getPeopleReached({ hours }),
    });

  // Estimativa de Pessoas Atingidas: 5-10% do alcance potencial (usando 7.5% como média)
  const estimatedPeopleReached = peopleReachedData?.peopleReached
    ? Math.round(peopleReachedData.peopleReached * 0.075)
    : 0;

  // Compartilhamentos por Conta: média de compartilhamentos por conta ativa
  const sharesPerAccount = activeAccountsData?.activeCount && activeAccountsData.activeCount > 0
    ? Math.round((sharesData?.shares ?? 0) / activeAccountsData.activeCount)
    : 0;

  return (
    <div className={clsx(chartStyles.container, styles.summaryCard)}>
      <div className={chartStyles.header}>
        <h3 className="body-lg-semibold">Resumo</h3>
        <p className="body-sm">Métricas gerais de suas ações</p>
      </div>
      <div className={styles.content}>
        <div className={styles.grid}>
          <KpiCard
            label="Total de Contas Ativas"
            value={activeAccountsData?.activeCount ?? 0}
            loading={loadingActiveAccounts}
            className={styles.kpiCard}
          />
          <KpiCard
            label="Total Compartilhamentos"
            value={sharesData?.shares ?? 0}
            loading={loadingShares}
            className={styles.kpiCard}
          />
          <KpiCard
            label="Compartilhamentos por Conta"
            value={sharesPerAccount}
            loading={loadingShares || loadingActiveAccounts}
            tooltip="Dica: Evite fazer mais de 120 compartilhamentos por dia por conta para manter a segurança das contas."
            className={styles.kpiCard}
          />
          <KpiCard
            label="Estimativa de Pessoas Atingidas"
            value={estimatedPeopleReached}
            loading={loadingPeopleReached}
            tooltip={`Estimativa calculada: ${peopleReachedData?.peopleReached ?? 0} × 7.5% = ${estimatedPeopleReached} pessoas (baseado em taxa média de engajamento de 5-10%).`}
            className={styles.kpiCard}
          />
        </div>
        <div className={styles.largeCardWrapper}>
          <KpiCard
            label="Máximo de Pessoas Atingidas"
            value={peopleReachedData?.peopleReached ?? 0}
            loading={loadingPeopleReached}
            className={styles.largeCard}
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;

