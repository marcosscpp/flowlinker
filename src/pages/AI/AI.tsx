import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  InstagramIcon,
  Clock05Icon,
  Calendar03Icon,
  FavouriteIcon,
  Comment01Icon,
  Share01Icon,
  Bookmark01Icon,
  MoreHorizontalIcon,
  Image01Icon,
  Video01Icon,
  GridIcon,
} from "@hugeicons/core-free-icons";
import { PageHeader, Button, Field, Loader } from "@/components";
import { dicasPostService, type Dica } from "@/services";
import styles from "./AI.module.scss";

interface FormData {
  instagram: string;
  nicho: string;
  descricao: string;
}

const initialFormData: FormData = {
  instagram: "",
  nicho: "",
  descricao: "",
};

const formatIcons: Record<string, typeof Image01Icon> = {
  Stories: Video01Icon,
  Carrossel: GridIcon,
  Reels: Video01Icon,
  Post: Image01Icon,
};

const formatLabels: Record<string, string> = {
  Stories: "Story",
  Carrossel: "Carrossel",
  Reels: "Reels",
  Post: "Post",
};

interface PostMockupProps {
  dica: Dica;
  username: string;
}

const PostMockup = ({ dica, username }: PostMockupProps) => {
  const FormatIcon = formatIcons[dica.formatoSugerido] || Image01Icon;
  const formatLabel = formatLabels[dica.formatoSugerido] || dica.formatoSugerido;

  return (
    <article className={styles.postMockup}>
      {/* Post Header */}
      <header className={styles.postHeader}>
        <div className={styles.postUser}>
          <div className={styles.avatar}>
            <HugeiconsIcon icon={InstagramIcon} size="1.25rem" />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.username}>{username}</span>
            <span className={styles.postType}>{formatLabel}</span>
          </div>
        </div>
        <button type="button" className={styles.moreButton}>
          <HugeiconsIcon icon={MoreHorizontalIcon} size="1.25rem" />
        </button>
      </header>

      {/* Post Content Placeholder */}
      <div className={styles.postContent}>
        <div className={styles.contentPlaceholder}>
          <HugeiconsIcon icon={FormatIcon} size="3rem" />
          <h4 className="body-lg-semibold">{dica.titulo}</h4>
          <p className="body-sm">{dica.descricao}</p>
        </div>
        <div className={styles.formatBadge}>
          <HugeiconsIcon icon={FormatIcon} size="1rem" />
          <span>{formatLabel}</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className={styles.postActions}>
        <div className={styles.actionsLeft}>
          <button type="button" className={styles.actionButton}>
            <HugeiconsIcon icon={FavouriteIcon} size="1.5rem" />
          </button>
          <button type="button" className={styles.actionButton}>
            <HugeiconsIcon icon={Comment01Icon} size="1.5rem" />
          </button>
          <button type="button" className={styles.actionButton}>
            <HugeiconsIcon icon={Share01Icon} size="1.5rem" />
          </button>
        </div>
        <button type="button" className={styles.actionButton}>
          <HugeiconsIcon icon={Bookmark01Icon} size="1.5rem" />
        </button>
      </div>

      {/* Post Caption */}
      <div className={styles.postCaption}>
        <p>
          <span className={styles.captionUsername}>{username}</span>{" "}
          <span className={styles.captionText}>
            {dica.hashtags.map((tag) => `#${tag}`).join(" ")}
          </span>
        </p>
      </div>

      {/* Post Meta Info */}
      <div className={styles.postMeta}>
        <div className={styles.metaInfo}>
          <HugeiconsIcon icon={Clock05Icon} size="1rem" />
          <span>Melhor horário: {dica.horarioIdeal}</span>
        </div>
        <div className={styles.metaInfo}>
          <span className={styles.trendBadge}>{dica.tendenciaRelacionada}</span>
        </div>
      </div>
    </article>
  );
};

const AI = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const {
    mutate: fetchDicas,
    data: dicasResponse,
    isPending,
    isError,
    error,
    reset,
  } = useMutation({
    mutationFn: () => dicasPostService.getDicas(formData),
  });

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.instagram || !formData.nicho || !formData.descricao) {
      return;
    }
    fetchDicas();
  };

  const handleNewSearch = () => {
    reset();
    setFormData(initialFormData);
  };

  const isFormValid = formData.instagram && formData.nicho && formData.descricao;

  return (
    <section className={styles.container}>
      <PageHeader
        title="Assistente de IA"
        subtitle="Gere dicas de posts personalizadas para o seu perfil usando inteligência artificial."
      />

      {!dicasResponse ? (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <HugeiconsIcon icon={SparklesIcon} size="2rem" className={styles.sparklesIcon} />
            <div>
              <h2 className="body-lg-semibold">Gerar Dicas de Post</h2>
              <p className="body-sm">Preencha os dados abaixo para receber sugestões personalizadas</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Field
              label="Instagram"
              name="instagram"
              placeholder="@seuperfil"
              value={formData.instagram}
              onChange={handleInputChange("instagram")}
              leftIcon={<HugeiconsIcon icon={InstagramIcon} />}
              showLeftIcon
            />

            <Field
              label="Nicho"
              name="nicho"
              placeholder="Ex: Fitness, Moda, Gastronomia..."
              value={formData.nicho}
              onChange={handleInputChange("nicho")}
            />

            <div className={styles.textareaField}>
              <label htmlFor="descricao" className="body-sm-bold">
                Descrição do perfil
              </label>
              <textarea
                id="descricao"
                name="descricao"
                className={styles.textarea}
                placeholder="Descreva seu perfil, público-alvo, tipo de conteúdo que produz..."
                value={formData.descricao}
                onChange={handleInputChange("descricao")}
                rows={4}
              />
            </div>

            {isError && (
              <div className={styles.errorMessage}>
                <p className="body-sm">Erro ao gerar dicas: {error?.message || "Tente novamente"}</p>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={!isFormValid || isPending}
              leftIcon={<HugeiconsIcon icon={SparklesIcon} />}
            >
              {isPending ? "Gerando dicas..." : "Gerar Dicas com IA"}
            </Button>

            {isPending && (
              <div className={styles.loadingContainer}>
                <Loader size="md" />
                <p className="body-sm">A IA está analisando seu perfil e gerando dicas personalizadas...</p>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsInfo}>
              <HugeiconsIcon icon={InstagramIcon} size="1.5rem" />
              <span className="body-lg-semibold">{dicasResponse.instagram}</span>
              <div className={styles.dateBadge}>
                <HugeiconsIcon icon={Calendar03Icon} size="1rem" />
                <span className="body-sm">{dicasResponse.data}</span>
              </div>
            </div>
            <Button onClick={handleNewSearch}>Nova Consulta</Button>
          </div>

          <div className={styles.messageCard}>
            <HugeiconsIcon icon={SparklesIcon} size="1.5rem" className={styles.sparklesIcon} />
            <p className="body-lg">{dicasResponse.mensagem}</p>
          </div>

          <div className={styles.dicasGrid}>
            {dicasResponse.dicas.map((dica) => (
              <PostMockup key={dica.numero} dica={dica} username={dicasResponse.instagram} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default AI;
