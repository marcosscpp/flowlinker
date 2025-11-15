import clsx from "clsx";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Field,
  Modal,
  PageHeader,
  ModalGhostButton,
} from "@/components";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock05Icon,
  ComputerIcon,
  Delete02Icon,
  Edit02Icon,
  FacebookIcon,
  InstagramIcon,
  UserMultiple03Icon,
} from "@hugeicons/core-free-icons";
import styles from "./Profiles.module.scss";
import {
  socialMediaAccountsService,
  type SocialMediaAccountResponse,
} from "@/services";

const platformIconMap = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
} as const;

type PersonaPlatform = keyof typeof platformIconMap;

const AVAILABLE_ACCOUNTS_QUERY_KEY = ["availableAccounts"] as const;

const Profiles = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const [personaForm, setPersonaForm] = useState({
    profileName: "",
    username: "",
    password: "",
    platform: "instagram" as PersonaPlatform,
  });
  const [personaToDelete, setPersonaToDelete] =
    useState<SocialMediaAccountResponse | null>(null);
  const {
    data: personasData,
    isLoading: loadingPersonas,
    error: personasError,
  } = useQuery({
    queryKey: AVAILABLE_ACCOUNTS_QUERY_KEY,
    queryFn: () => socialMediaAccountsService.getAvailable(),
  });

  const personaCards = useMemo(() => {
    if (!personasData) return [];

    return [...personasData]
      .sort((a, b) => b.id - a.id)
      .map((account) => ({
        id: account.id,
        name: account.profileName || account.username,
        platform:
          (account.platform?.toLowerCase() as PersonaPlatform) || "facebook",
        account,
      }));
  }, [personasData]);

  const setAvailableAccountsCache = (
    updater: (
      previous: SocialMediaAccountResponse[]
    ) => SocialMediaAccountResponse[]
  ) => {
    queryClient.setQueryData<SocialMediaAccountResponse[]>(
      AVAILABLE_ACCOUNTS_QUERY_KEY,
      (previous) => updater(previous ?? [])
    );
  };

  const createPersonaMutation = useMutation({
    mutationFn: () => socialMediaAccountsService.create(personaForm),
    onSuccess: (newPersona) => {
      setAvailableAccountsCache((previous) => [
        newPersona,
        ...previous.filter((persona) => persona.id !== newPersona.id),
      ]);
      queryClient.invalidateQueries({ queryKey: ["activeAccounts"] });
      queryClient.invalidateQueries({ queryKey: AVAILABLE_ACCOUNTS_QUERY_KEY });
      setPersonaForm({
        profileName: "",
        username: "",
        password: "",
        platform: "instagram",
      });
      setModalOpen(false);
    },
  });

  const deletePersonaMutation = useMutation({
    mutationFn: (id: number) => socialMediaAccountsService.delete(id),
    onSuccess: (_, deletedId) => {
      setAvailableAccountsCache((previous) =>
        previous.filter((persona) => persona.id !== deletedId)
      );
      // queryClient.invalidateQueries({ queryKey: ["activeAccounts"] });
      queryClient.invalidateQueries({ queryKey: AVAILABLE_ACCOUNTS_QUERY_KEY });
      closeDeleteModal();
    },
  });

  const toggleModal = () => setModalOpen((prev) => !prev);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setPersonaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createPersonaMutation.mutate();
  };

  const handleDeleteClick = (persona: SocialMediaAccountResponse) => {
    setPersonaToDelete(persona);
  };

  const closeDeleteModal = () => setPersonaToDelete(null);

  const handleConfirmDelete = () => {
    if (!personaToDelete) return;
    deletePersonaMutation.mutate(personaToDelete.id);
  };

  return (
    <section className={styles.container}>
      <PageHeader
        title="Gerenciador de Personas"
        subtitle="Crie e gerencie personas virtuais para automatizar suas interações."
        action={
          <Button
            leftIcon={<HugeiconsIcon icon={UserMultiple03Icon} />}
            onClick={toggleModal}
          >
            Adicionar Persona
          </Button>
        }
      />

      <Badge>Total de Personas: {personaCards.length}</Badge>

      <div className={styles.personasGrid}>
        {loadingPersonas && (
          <p className="body-sm">Carregando personas disponíveis...</p>
        )}
        {personasError && (
          <p className="body-sm">
            Não foi possível carregar as personas. Tente novamente em instantes.
          </p>
        )}
        {!loadingPersonas && !personasError && personaCards.length === 0 && (
          <p className="body-sm">
            Nenhuma persona disponível no momento. Crie uma nova para começar.
          </p>
        )}
        {personaCards.map(({ account, ...persona }) => {
          const PlatformIcon = platformIconMap[persona.platform];

          return (
            <article key={persona.id} className={styles.personaCard}>
              <header className={styles.personaHeader}>
                <div>
                  <h3 className={clsx("body-lg-semibold", styles.personaName)}>
                    {persona.name}
                  </h3>
                </div>
                <span
                  className={clsx(
                    styles.platformBadge,
                    styles[`platform-${persona.platform}`]
                  )}
                >
                  <HugeiconsIcon icon={PlatformIcon} size="2rem" />
                </span>
              </header>

              <div className={styles.personaInfo}>
                <p className={clsx("body-sm", styles.personaInfoItem)}>
                  <HugeiconsIcon icon={ComputerIcon} />
                  Último dispositivo: Notebook Flowlinker - Windows 10
                </p>
                <p className={clsx("body-sm", styles.personaInfoItem)}>
                  <HugeiconsIcon icon={Clock05Icon} />
                  Última atividade: Há 5 minutos
                </p>
              </div>

              <footer className={styles.personaActions}>
                <button type="button" className={styles.personaActionEdit}>
                  <HugeiconsIcon icon={Edit02Icon} />
                  <span className="body-sm">Editar</span>
                </button>
                <button
                  type="button"
                  className={styles.personaActionDelete}
                  onClick={() => handleDeleteClick(account)}
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                  <span className="body-sm">Deletar</span>
                </button>
              </footer>
            </article>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        title="Adicionar persona"
        footer={
          <>
            <ModalGhostButton
              onClick={toggleModal}
              disabled={createPersonaMutation.isPending}
            >
              Cancelar
            </ModalGhostButton>
            <Button
              type="submit"
              form="persona-form"
              isLoading={createPersonaMutation.isPending}
              disabled={createPersonaMutation.isPending}
            >
              Salvar persona
            </Button>
          </>
        }
      >
        <form
          id="persona-form"
          className={styles.modalForm}
          onSubmit={handleSubmit}
        >
          <div className={styles.modalField}>
            <Field
              label="Nome da persona"
              name="profileName"
              value={personaForm.profileName}
              onChange={handleChange}
              required
              placeholder="Ex: Samuel Mendonça"
            />
          </div>

          <div className={styles.modalField}>
            <Field
              label="Usuário"
              name="username"
              value={personaForm.username}
              onChange={handleChange}
              required
              placeholder="usuario.flowlinker"
            />
          </div>

          <div className={styles.modalField}>
            <Field.Password
              label="Senha"
              name="password"
              value={personaForm.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <label className={styles.modalField}>
            <span className="body-sm-bold">Rede social</span>
            <select
              name="platform"
              value={personaForm.platform}
              onChange={handleChange}
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
          </label>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(personaToDelete)}
        onClose={closeDeleteModal}
        title="Excluir persona"
        footer={
          <>
            <ModalGhostButton
              onClick={closeDeleteModal}
              disabled={deletePersonaMutation.isPending}
            >
              Cancelar
            </ModalGhostButton>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={deletePersonaMutation.isPending}
              disabled={deletePersonaMutation.isPending}
            >
              Confirmar exclusão
            </Button>
          </>
        }
      >
        <p className="body-md">
          Tem certeza que deseja excluir a persona{" "}
          <strong>
            {personaToDelete?.profileName ?? personaToDelete?.username}
          </strong>{" "}
          ? Essa ação não pode ser desfeita.
        </p>
      </Modal>
    </section>
  );
};

export default Profiles;
