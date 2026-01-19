import styles from "./Billing.module.scss";
import { PageHeader, Button, Modal, ModalGhostButton } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { billingService } from "@/services";
import { useModal } from "@/hooks";
import { QUERY_KEYS } from "@/constants";

const Billing = () => {
  const confirmModal = useModal();

  const FIFTEEN_MINUTES = 1000 * 60 * 15;

  const {
    refetch: fetchPortal,
    isFetching: loadingPortal,
    error: portalError,
  } = useQuery({
    queryKey: [QUERY_KEYS.billing.portal],
    queryFn: () => billingService.openPortal(),
    enabled: false,
    staleTime: FIFTEEN_MINUTES,
    gcTime: FIFTEEN_MINUTES,
  });

  const handleConfirmRedirect = async () => {
    const result = await fetchPortal();
    if (result.data) {
      window.open(result.data, "_blank", "noopener,noreferrer");
      confirmModal.close();
    }
  };

  return (
    <section className={styles.container}>
      <PageHeader
        title="Informações de Pagamento"
        subtitle="Gerencie suas informações de pagamento, visualize faturas e atualize seus dados de cobrança. Ao clicar no botão abaixo, você será redirecionado para o portal seguro da Stripe."
      />

      <div className={styles.actions} data-tourid="billing-action">
        <Button onClick={confirmModal.open}>
          Abrir portal de pagamentos
        </Button>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        title="Ir para Stripe"
        footer={
          <>
            <ModalGhostButton
              onClick={confirmModal.close}
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
