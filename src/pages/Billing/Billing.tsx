import { useState } from "react";
import styles from "./Billing.module.scss";
import { PageHeader, Button, Modal, ModalGhostButton } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { billingService } from "@/services";

const Billing = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const FIFTEEN_MINUTES = 1000 * 60 * 15;

  const {
    refetch: fetchPortal,
    isFetching: loadingPortal,
    error: portalError,
  } = useQuery({
    queryKey: ["billingPortalPortal"],
    queryFn: () => billingService.openPortal(),
    enabled: false,
    staleTime: FIFTEEN_MINUTES,
    gcTime: FIFTEEN_MINUTES,
  });

  const handleConfirmRedirect = async () => {
    const result = await fetchPortal();
    if (result.data) {
      window.open(result.data, "_blank", "noopener,noreferrer");
      setModalOpen(false);
    }
  };

  return (
    <section className={styles.container}>
      <PageHeader
        title="Central de Pagamentos"
        subtitle="Acesse o portal de pagamentos para visualizar faturas e atualizar dados de cobrança. Você será redirecionado para a plataforma segura da Stripe."
      />

      <div className={styles.actions}>
        <Button onClick={() => setModalOpen(true)}>
          Abrir portal de pagamentos
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Ir para Stripe"
        footer={
          <>
            <ModalGhostButton
              onClick={() => setModalOpen(false)}
              disabled={loadingPortal}
            >
              Cancelar
            </ModalGhostButton>
            <Button
              onClick={handleConfirmRedirect}
              isLoading={loadingPortal}
              disabled={loadingPortal}
            >
              Confirmar redirecionamento
            </Button>
          </>
        }
      >
        <p className="body-md">
          Você será redirecionado para o portal de pagamentos seguro da Stripe.
          Confirme para continuar. Se preferir, você também pode abrir em outra
          aba sem fechar o Flowlinker.
        </p>
        {portalError ? (
          <p className={styles.errorText}>
            Não foi possível abrir o portal. Tente novamente em instantes.
          </p>
        ) : null}
      </Modal>
    </section>
  );
};

export default Billing;
