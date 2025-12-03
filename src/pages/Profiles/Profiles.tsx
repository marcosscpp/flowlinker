import clsx from "clsx";
import { useMemo, useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Check,
  Field,
  Status,
  Modal,
  PageHeader,
  ModalGhostButton,
} from "@/components";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserCircleIcon,
  Delete02Icon,
  Edit02Icon,
  FacebookIcon,
  InstagramIcon,
  UserMultiple03Icon,
  SquareLock02Icon,
  AddCircleIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import styles from "./Profiles.module.scss";
import {
  socialMediaAccountsService,
  type SocialMediaAccountResponse,
} from "@/services";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Ativa",
  BLOCKED: "Bloqueada",
  DELETED: "Deletada",
};

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  ACTIVE: "success",
  BLOCKED: "warning",
  DELETED: "danger",
};

const platformIconMap = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
} as const;

type PersonaPlatform = keyof typeof platformIconMap;

const AVAILABLE_ACCOUNTS_QUERY_KEY = ["availableAccounts"] as const;

const Profiles = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<
    Record<PersonaPlatform, boolean>
  >({
    instagram: true,
    facebook: true,
  });
  const [personaForm, setPersonaForm] = useState({
    profileName: "",
    username: "",
    password: "",
    platform: "instagram" as PersonaPlatform,
  });
  const [personaToDelete, setPersonaToDelete] =
    useState<SocialMediaAccountResponse | null>(null);
  const [personaToEdit, setPersonaToEdit] =
    useState<SocialMediaAccountResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] =
    useState(false);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const [editForm, setEditForm] = useState<{
    profileName: string;
    username: string;
    password: string;
    platform: PersonaPlatform;
    status: string;
    slugs: string[];
  }>({
    profileName: "",
    username: "",
    password: "",
    platform: "instagram",
    status: "",
    slugs: [],
  });
  const {
    data: personasData,
    isLoading: loadingPersonas,
    error: personasError,
  } = useQuery({
    queryKey: [
      ...AVAILABLE_ACCOUNTS_QUERY_KEY,
      selectedPlatforms.instagram,
      selectedPlatforms.facebook,
      selectedCategory,
    ],
    queryFn: () => {
      const activePlatforms = (
        Object.entries(selectedPlatforms) as Array<[PersonaPlatform, boolean]>
      )
        .filter(([, isActive]) => isActive)
        .map(([key]) => key);

      const apiPlatforms =
        activePlatforms.length > 0
          ? activePlatforms.map((p) => p.toUpperCase())
          : undefined;

      return socialMediaAccountsService.getAvailable(
        apiPlatforms,
        selectedCategory ? [selectedCategory] : undefined
      );
    },
  });

  const {
    data: categoriesData,
    isLoading: loadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["socialCategories"],
    queryFn: () => socialMediaAccountsService.getCategories(),
    staleTime: 1000 * 60 * 60 * 24 * 7,
    gcTime: 1000 * 60 * 60 * 24 * 30,
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
  const closeEditModal = () => setPersonaToEdit(null);

  const handleConfirmDelete = () => {
    if (!personaToDelete) return;
    deletePersonaMutation.mutate(personaToDelete.id);
  };

  const openEditModal = (persona: SocialMediaAccountResponse) => {
    setPersonaToEdit(persona);
    setEditForm({
      profileName: persona.profileName ?? "",
      username: persona.username ?? "",
      password: persona.password ?? "",
      platform:
        (persona.platform?.toLowerCase() as PersonaPlatform) ?? "instagram",
      status: persona.status ?? "",
      slugs: persona.slugs ?? [],
    });
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (slug: string) => {
    setEditForm((prev) => {
      const currentSlugs = prev.slugs || [];
      const isSelected = currentSlugs.includes(slug);
      return {
        ...prev,
        slugs: isSelected
          ? currentSlugs.filter((s) => s !== slug)
          : [...currentSlugs, slug],
      };
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesDropdownOpen(false);
      }
    };

    if (isCategoriesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoriesDropdownOpen]);

  const updatePersonaMutation = useMutation({
    mutationFn: async () => {
      if (!personaToEdit) return null;
      const payload: {
        nomePerfil?: string;
        username?: string;
        password?: string;
        platform?: string;
        slugs?: string[];
        status?: string;
      } = {};

      if (editForm.profileName) payload.nomePerfil = editForm.profileName;
      if (editForm.username) payload.username = editForm.username;
      if (editForm.password) payload.password = editForm.password;
      if (editForm.platform) payload.platform = editForm.platform.toUpperCase();
      if (editForm.slugs && editForm.slugs.length > 0)
        payload.slugs = editForm.slugs;
      if (editForm.status) payload.status = editForm.status;

      return socialMediaAccountsService.update(personaToEdit.id, payload);
    },
    onSuccess: (updated) => {
      if (!updated) return;
      setAvailableAccountsCache((previous) =>
        previous.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      queryClient.invalidateQueries({ queryKey: AVAILABLE_ACCOUNTS_QUERY_KEY });
      closeEditModal();
    },
  });

  const maskPassword = (value?: string) => {
    if (!value) return "—";
    const len = value.length;

    const visibleHead = len >= 3 ? 3 : 1;
    const visibleTail = len >= 7 ? 2 : 0;

    const head = value.slice(0, visibleHead);
    const tail = visibleTail > 0 ? value.slice(len - visibleTail) : "";

    const middleCount = Math.max(6, len - (visibleHead + visibleTail));
    const middleMask = "•".repeat(middleCount);

    return `${head}${middleMask}${tail}`;
  };

  const togglePlatform = (platform: PersonaPlatform) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  return (
    <section className={styles.container}>
      <PageHeader
        title="Gerenciador de Perfis"
        subtitle="Crie e gerencie perfis virtuais para automatizar suas interações."
        action={
          <Button
            leftIcon={<HugeiconsIcon icon={UserMultiple03Icon} />}
            onClick={toggleModal}
          >
            Adicionar Perfil
          </Button>
        }
      />

      <div className={styles.platformFilters}>
        <div className={styles.filterGroup}>
          <span className="body-sm-bold">Filtrar por rede:</span>
          <Check
            label="Instagram"
            checked={selectedPlatforms.instagram}
            onChange={() => togglePlatform("instagram")}
            size="sm"
          />
          <Check
            label="Facebook"
            checked={selectedPlatforms.facebook}
            onChange={() => togglePlatform("facebook")}
            size="sm"
          />
        </div>
        <div className={styles.filterGroup}>
          <span className="body-sm-bold">Categoria:</span>
          <select
            className={styles.categorySelect}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filtrar por categoria"
            disabled={loadingCategories}
          >
            <option value="">Todas as categorias</option>
            {loadingCategories && <option disabled>Carregando...</option>}
            {categoriesError && <option disabled>Erro ao carregar</option>}
            {categoriesData?.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Badge>Total de Perfis: {personaCards.length}</Badge>

      <div className={styles.personasGrid}>
        {loadingPersonas && (
          <p className="body-sm">Carregando perfis disponíveis...</p>
        )}
        {personasError && (
          <p className="body-sm">
            Não foi possível carregar os perfis. Tente novamente em instantes.
          </p>
        )}
        {!loadingPersonas && !personasError && personaCards.length === 0 && (
          <p className="body-sm">
            Nenhum perfil disponível no momento. Crie um novo para começar.
          </p>
        )}
        {personaCards.map(({ account, ...persona }) => {
          const PlatformIcon = platformIconMap[persona.platform];
          const personaCategories = (
            (account as SocialMediaAccountResponse).slugs || []
          )
            .map((slug: string) => {
              const category = categoriesData?.find((cat) => cat.slug === slug);
              return category ? { slug, name: category.name } : null;
            })
            .filter(
              (cat): cat is { slug: string; name: string } => cat !== null
            );

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
                  <HugeiconsIcon icon={UserCircleIcon} />
                  Nome do perfil: {account.username || "-"}
                </p>
                <p className={clsx("body-sm", styles.personaInfoItem)}>
                  <HugeiconsIcon icon={SquareLock02Icon} />
                  Senha: {maskPassword(account.password)}
                </p>
                <p className={clsx("body-sm", styles.personaInfoItem)}>
                  <Status
                    label={STATUS_LABELS[account.status] ?? account.status}
                    variant={STATUS_VARIANT[account.status] ?? "warning"}
                  />
                </p>
                {personaCategories.length > 0 && (
                  <div className={styles.personaCategories}>
                    {personaCategories.map(
                      (category: { slug: string; name: string }) => (
                        <Badge
                          key={category.slug}
                          className={styles.categoryBadge}
                        >
                          {category.name}
                        </Badge>
                      )
                    )}
                  </div>
                )}
              </div>

              <footer className={styles.personaActions}>
                <button
                  type="button"
                  className={styles.personaActionEdit}
                  onClick={() => openEditModal(account)}
                >
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
        title="Adicionar perfil"
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
              Salvar perfil
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
              label="Nome do perfil"
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
        isOpen={Boolean(personaToEdit)}
        onClose={closeEditModal}
        title="Editar perfil"
        footer={
          <>
            <ModalGhostButton
              onClick={closeEditModal}
              disabled={updatePersonaMutation.isPending}
            >
              Cancelar
            </ModalGhostButton>
            <Button
              type="submit"
              form="persona-edit-form"
              isLoading={updatePersonaMutation.isPending}
              disabled={updatePersonaMutation.isPending}
            >
              Salvar alterações
            </Button>
          </>
        }
      >
        <form
          id="persona-edit-form"
          className={styles.modalForm}
          onSubmit={(e) => {
            e.preventDefault();
            updatePersonaMutation.mutate();
          }}
        >
          <div className={styles.modalField}>
            <Field
              label="Nome do perfil"
              name="profileName"
              value={editForm.profileName}
              onChange={handleEditChange}
              placeholder="Ex: Samuel Mendonça"
            />
          </div>

          <div className={styles.modalField}>
            <Field
              label="Usuário"
              name="username"
              value={editForm.username}
              onChange={handleEditChange}
              placeholder="usuario.flowlinker"
            />
          </div>

          <div className={styles.modalField}>
            <Field.Password
              label="Nova senha (opcional)"
              name="password"
              value={editForm.password}
              onChange={handleEditChange}
              placeholder="••••••••"
            />
          </div>

          <label className={styles.modalField}>
            <span className="body-sm-bold">Rede social</span>
            <select
              className={styles.categorySelect}
              name="platform"
              value={editForm.platform}
              onChange={handleEditChange}
              aria-label="Selecionar rede social"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
          </label>

          <div className={styles.modalField}>
            <span className="body-sm-bold">Categorias</span>
            <div className={styles.categoriesContainer}>
              <div className={styles.selectedCategories}>
                {editForm.slugs.map((slug) => {
                  const category = categoriesData?.find(
                    (cat) => cat.slug === slug
                  );
                  if (!category) return null;
                  return (
                    <Badge key={slug} className={styles.categoryTag}>
                      {category.name}
                      <button
                        type="button"
                        className={styles.removeCategoryButton}
                        onClick={() => toggleCategory(slug)}
                        aria-label={`Remover ${category.name}`}
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size="1rem" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
              <div
                className={styles.categoriesDropdown}
                ref={categoriesDropdownRef}
              >
                <button
                  type="button"
                  className={styles.addCategoryButton}
                  onClick={() =>
                    setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)
                  }
                  aria-label="Adicionar categoria"
                >
                  <HugeiconsIcon icon={AddCircleIcon} size="1.25rem" />
                  <span className="body-sm">Adicionar categoria</span>
                </button>
                {isCategoriesDropdownOpen && (
                  <div className={styles.categoriesList}>
                    {categoriesData
                      ?.filter(
                        (category) => !editForm.slugs.includes(category.slug)
                      )
                      .map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          className={styles.categoryOption}
                          onClick={() => {
                            toggleCategory(category.slug);
                          }}
                        >
                          {category.name}
                        </button>
                      ))}
                    {categoriesData &&
                      categoriesData.filter(
                        (category) => !editForm.slugs.includes(category.slug)
                      ).length === 0 && (
                        <p className={clsx("body-sm", styles.emptyCategories)}>
                          Todas as categorias foram selecionadas
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <label className={styles.modalField}>
            <span className="body-sm-bold">Status</span>
            <select
              className={styles.categorySelect}
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
              aria-label="Selecionar status"
            >
              <option value="">-- manter --</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(personaToDelete)}
        onClose={closeDeleteModal}
        title="Excluir perfil"
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
          Tem certeza que deseja excluir o perfil{" "}
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
