import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SquareLock02Icon,
  CreditCardIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import {
  PageHeader,
  Button,
  Field,
  Modal,
  ModalGhostButton,
} from "@/components";
import { useModal } from "@/hooks";
import { authService, billingService, customerService } from "@/services";
import { useToast } from "@/context";
import { QUERY_KEYS } from "@/constants";
import styles from "./Settings.module.scss";

const Settings = () => {
  const toast = useToast();
  const confirmPortalModal = useModal();

  // Form de alteração de senha
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Query para nome do usuário
  const { data: customerData } = useQuery({
    queryKey: [QUERY_KEYS.customer.name],
    queryFn: () => customerService.getName(),
    staleTime: 1000 * 60 * 30,
  });

  // Query para portal de pagamentos
  const { refetch: fetchPortal, isFetching: loadingPortal } = useQuery({
    queryKey: [QUERY_KEYS.billing.portal],
    queryFn: () => billingService.openPortal(),
    enabled: false,
    staleTime: 1000 * 60 * 15,
  });

  // Mutation para alterar senha
  const changePasswordMutation = useMutation({
    mutationFn: () =>
      authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    changePasswordMutation.mutate();
  };

  const handleConfirmPortalRedirect = async () => {
    const result = await fetchPortal();
    if (result.data) {
      window.open(result.data, "_blank", "noopener,noreferrer");
      confirmPortalModal.close();
    }
  };

  return (
    <section className={styles.container}>
      <PageHeader
        title="Configurações"
        subtitle="Gerencie sua conta, altere sua senha e acesse informações de pagamento"
      />

      <div className={styles.content}>
        {/* Coluna Esquerda: Info + Pagamentos */}
        <div className={styles.leftColumn}>
          {/* Card de Informações da Conta */}
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <HugeiconsIcon icon={UserCircleIcon} size="1.5rem" />
              </div>
              <div>
                <h2 className="body-lg-semibold">Informações da Conta</h2>
                <p className="body-sm">Seus dados cadastrais</p>
              </div>
            </header>
            <div className={styles.cardContent}>
              <div className={styles.infoRow}>
                <span className="body-sm-bold">Nome:</span>
                <span className="body-sm">{customerData?.name || "—"}</span>
              </div>
            </div>
          </article>

          {/* Card de Pagamentos */}
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <HugeiconsIcon icon={CreditCardIcon} size="1.5rem" />
              </div>
              <div>
                <h2 className="body-lg-semibold">Pagamentos</h2>
                <p className="body-sm">Gerencie suas informações de cobrança</p>
              </div>
            </header>
            <div className={styles.cardContent}>
              <p className="body-sm">
                Acesse o portal seguro da Stripe para gerenciar seus métodos de
                pagamento, visualizar faturas e atualizar dados de cobrança.
              </p>
              <Button
                variant="secondary"
                onClick={confirmPortalModal.open}
                data-tourid="billing-action"
              >
                Abrir portal de pagamentos
              </Button>
            </div>
          </article>
        </div>

        {/* Coluna Direita: Alterar Senha */}
        <div className={styles.rightColumn}>
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <HugeiconsIcon icon={SquareLock02Icon} size="1.5rem" />
              </div>
              <div>
                <h2 className="body-lg-semibold">Alterar Senha</h2>
                <p className="body-sm">Atualize sua senha de acesso</p>
              </div>
            </header>
            <form className={styles.cardContent} onSubmit={handlePasswordSubmit}>
              <Field.Password
                label="Senha atual"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Digite sua senha atual"
                required
              />

              <Field.Password
                label="Nova senha"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Digite a nova senha"
                required
              />

              <Field.Password
                label="Confirmar nova senha"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirme a nova senha"
                required
              />

              <Button
                type="submit"
                isLoading={changePasswordMutation.isPending}
                disabled={changePasswordMutation.isPending}
              >
                Alterar senha
              </Button>
            </form>
          </article>
        </div>
      </div>

      {/* Modal de confirmação do portal */}
      <Modal
        isOpen={confirmPortalModal.isOpen}
        onClose={confirmPortalModal.close}
        title="Ir para Stripe"
        footer={
          <>
            <ModalGhostButton
              onClick={confirmPortalModal.close}
              disabled={loadingPortal}
            >
              Cancelar
            </ModalGhostButton>
            <Button
              onClick={handleConfirmPortalRedirect}
              isLoading={loadingPortal}
              disabled={loadingPortal}
            >
              Confirmar
            </Button>
          </>
        }
      >
        <p className="body-md">
          Você será redirecionado para o portal de pagamentos seguro da Stripe
          em uma nova aba.
        </p>
      </Modal>
    </section>
  );
};

export default Settings;
