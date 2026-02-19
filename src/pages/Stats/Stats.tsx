import { useState } from "react";
import { PageHeader, Select } from "@/components";
import {
  PersonasRankingChart,
  ActionsByDayChart,
  ActionsBySocialNetworkChart,
  HeatmapChart,
  SummaryCard,
  CampaignReportsSection,
} from "@/components/Charts";
import styles from "./Stats.module.scss";

type PeriodOption = {
  label: string;
  hours: number;
  days: number;
};

const PERIOD_OPTIONS: PeriodOption[] = [
  { label: "Últimas 24 horas", hours: 24, days: 1 },
  { label: "Últimos 7 dias", hours: 168, days: 7 },
  { label: "Últimos 30 dias", hours: 720, days: 30 },
];

const Stats = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>(
    PERIOD_OPTIONS[1]
  );

  // Acesso direto às propriedades - useMemo era desnecessário aqui
  // pois acessar propriedades de objetos é O(1) e não requer memoização
  const { hours, days } = selectedPeriod;

  return (
    <section className={styles.container}>
      <PageHeader
        title="Estatísticas"
        subtitle="Visualize e analise métricas de suas ações"
        action={
          <div className={styles.periodFilter} data-tourid="stats-filter">
            <Select
              label="Período"
              value={PERIOD_OPTIONS.findIndex(
                (opt) => opt.hours === selectedPeriod.hours
              )}
              onChange={(e) => {
                const index = parseInt(e.target.value, 10);
                setSelectedPeriod(PERIOD_OPTIONS[index]);
              }}
              className={styles.periodSelect}
            >
              {PERIOD_OPTIONS.map((option, index) => (
                <option key={option.hours} value={index}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        }
      />

      <div className={styles.chartsGrid} data-tourid="stats-charts">
        <div className={styles.chartCard}>
          <SummaryCard hours={hours} />
        </div>
        <div className={styles.chartCard}>
          <PersonasRankingChart hours={hours} limit={5} />
        </div>
        <div className={styles.chartCard}>
          <ActionsByDayChart days={days} />
        </div>
        <div className={styles.chartCard}>
          <ActionsBySocialNetworkChart hours={hours} />
        </div>
        <div className={styles.chartCardFull}>
          <HeatmapChart days={days} />
        </div>
      </div>

      <div className={styles.chartCardFull}>
        <CampaignReportsSection />
      </div>
    </section>
  );
};

export default Stats;

