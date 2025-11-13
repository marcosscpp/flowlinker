import { PageHeader, Button, FullScreenLoader } from "@/components";
import { useFetch } from "@/hooks";
import { appReleasesService, customerService } from "@/services";
import styles from "./Home.module.scss";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon } from "@hugeicons/core-free-icons";

const Home = () => {
  const { data: customerData, loading: loadingCustomer } = useFetch(() =>
    customerService.getName()
  );

  const { data: latestReleaseData, loading: loadingRelease } = useFetch(() =>
    appReleasesService.getLatest()
  );

  const isLoading = loadingCustomer || loadingRelease;
  const hasData = customerData && latestReleaseData;

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
        fullWidth
        leftIcon={<HugeiconsIcon icon={Download01Icon} />}
        onClick={() => window.open(latestReleaseData.url, "_blank")}
      >
        Baixar a Última Versão do Flowlinker
      </Button>
      <section className={styles.content}>
        <div></div>
        <div className={styles.info}>
          <ul></ul>
        </div>
      </section>
    </>
  );
};

export default Home;
