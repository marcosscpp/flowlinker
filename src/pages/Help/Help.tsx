import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Route01Icon,
  Mail02Icon,
  WhatsappIcon,
  HelpCircleIcon,
  PlayCircle02Icon,
  FacebookIcon,
  InstagramIcon,
  File02Icon,
  ShieldKeyIcon,
} from "@hugeicons/core-free-icons";
import { PageHeader, Button, Modal } from "@/components";
import { useTour } from "@/context";
import { useNavigate } from "react-router-dom";
import styles from "./Help.module.scss";

const getYouTubeEmbedUrl = (url: string): string => {
  const videoId = url.split("/").pop();
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
};

const VIDEO_TUTORIALS = [
  {
    id: "facebook",
    title: "Automação no Facebook",
    description:
      "Do cadastro à primeira campanha: aprenda a automatizar postagens em grupos de forma inteligente e segura.",
    icon: FacebookIcon,
    youtubeUrl: "https://youtu.be/wMHLg_PBuiE",
    topics: [
      "Cadastro de perfil com sistema de cookies",
      "Extração de grupos por palavras-chave",
      "Configuração de delays de segurança",
      "Monitoramento em tempo real",
    ],
  },
  {
    id: "instagram",
    title: "Escale Vendas no Instagram",
    description:
      "Use mensagens diretas de forma automatizada e segura para converter mais leads qualificados.",
    icon: InstagramIcon,
    youtubeUrl: "https://youtu.be/Sq7cv0wKoXs",
    topics: [
      "Extração de seguidores de perfis alvo",
      "Digitação humanizada de mensagens",
      "Rotação de contas para segurança",
      "Abordagem qualificada de leads",
    ],
  },
];

const GUIDES = [
  {
    title: "Sistema de Cookies",
    content:
      "O Flowlinker utiliza um sistema de acesso via cookies que guarda a sessão do navegador, evitando logins repetitivos e reduzindo o risco de bloqueios nas suas contas.",
  },
  {
    title: "Delays de Segurança",
    content:
      "Configure intervalos de tempo padronizados que mimetizam o comportamento humano. Isso protege sua conta e garante que suas ações pareçam naturais para as plataformas.",
  },
  {
    title: "Rotação de Perfis",
    content:
      "Recomendamos o uso de pelo menos três contas para alternar os envios. Isso reduz drasticamente o risco de punições e aumenta o alcance das suas campanhas.",
  },
  {
    title: "Extração Inteligente",
    content:
      "Extraia seguidores de perfis concorrentes ou grupos de nicho específicos. O sistema gera listas qualificadas para abordagens mais efetivas.",
  },
];

const Help = () => {
  const { resetTour } = useTour();
  const navigate = useNavigate();
  const [videoModal, setVideoModal] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
  }>({ isOpen: false, title: "", url: "" });

  const handleStartTour = () => {
    navigate("/");
    setTimeout(() => {
      resetTour();
    }, 100);
  };

  const handleDownloadTerms = () => {
    const link = document.createElement("a");
    link.href = "/files/termo-de-uso-contas-redes-sociais.docx";
    link.download = "termo-de-uso-contas-redes-sociais.docx";
    link.click();
  };

  const openVideoModal = (title: string, url: string) => {
    setVideoModal({ isOpen: true, title, url });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, title: "", url: "" });
  };

  return (
    <section className={styles.container}>
      <PageHeader
        title="Central de Ajuda"
        subtitle="Tutoriais, guias e suporte para dominar o Flowlinker"
      />

      <div className={styles.content}>
        {/* Video Tutorials Section */}
        <div className={styles.sectionHeader}>
          <HugeiconsIcon icon={PlayCircle02Icon} size="1.5rem" />
          <h2 className="body-lg-semibold">Tutoriais em Vídeo</h2>
        </div>

        <div className={styles.videosGrid}>
          {VIDEO_TUTORIALS.map((tutorial) => (
            <article key={tutorial.id} className={styles.videoCard}>
              <header className={styles.videoHeader}>
                <div
                  className={`${styles.platformIcon} ${styles[tutorial.id]}`}
                >
                  <HugeiconsIcon icon={tutorial.icon} size="1.75rem" />
                </div>
                <div>
                  <h3 className="body-lg-semibold">{tutorial.title}</h3>
                  <p className="body-sm">{tutorial.description}</p>
                </div>
              </header>

              <ul className={styles.topicsList}>
                {tutorial.topics.map((topic, index) => (
                  <li key={index} className="body-sm">
                    {topic}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={styles.watchButton}
                onClick={() => openVideoModal(tutorial.title, tutorial.youtubeUrl)}
              >
                <HugeiconsIcon icon={PlayCircle02Icon} size="1.25rem" />
                Assistir Tutorial
              </button>
            </article>
          ))}
        </div>

        {/* Guides Section */}
        <div className={styles.sectionHeader}>
          <HugeiconsIcon icon={File02Icon} size="1.5rem" />
          <h2 className="body-lg-semibold">Guia Rápido</h2>
        </div>

        <div className={styles.guidesGrid}>
          {GUIDES.map((guide, index) => (
            <article key={index} className={styles.guideCard}>
              <h3 className="body-md-semibold">{guide.title}</h3>
              <p className="body-sm">{guide.content}</p>
            </article>
          ))}
        </div>

        {/* Legal Section */}
        <article className={styles.legalCard}>
          <header>
            <div className={styles.legalIcon}>
              <HugeiconsIcon icon={ShieldKeyIcon} size="1.75rem" />
            </div>
            <div>
              <h3 className="body-lg-semibold">
                Segurança Jurídica e LGPD
              </h3>
              <p className="body-sm">
                Ao utilizar ferramentas de automação e gerenciar contas de
                terceiros, é fundamental manter a transparência e segurança
                jurídica.
              </p>
            </div>
          </header>
          <div className={styles.legalContent}>
            <p className="body-sm">
              O uso do Flowlinker deve ser acompanhado por um{" "}
              <strong>Termo de Autorização e Responsabilidade</strong>. Este
              documento garante que:
            </p>
            <ul className={styles.legalList}>
              <li className="body-sm">
                O uso das contas seja limitado à finalidade de compartilhamento
                e automação
              </li>
              <li className="body-sm">
                O usuário da ferramenta assuma a responsabilidade integral pelo
                conteúdo e pelas interações
              </li>
              <li className="body-sm">
                Todas as ações estejam em conformidade com a Lei Geral de
                Proteção de Dados (LGPD)
              </li>
              <li className="body-sm">
                Sigilo absoluto sobre dados de acesso seja mantido
              </li>
            </ul>
            <Button
              variant="secondary"
              onClick={handleDownloadTerms}
              leftIcon={<HugeiconsIcon icon={File02Icon} />}
            >
              Baixar Termo de Uso
            </Button>
          </div>
        </article>

        {/* Quick Actions Section */}
        <div className={styles.sectionHeader}>
          <HugeiconsIcon icon={Route01Icon} size="1.5rem" />
          <h2 className="body-lg-semibold">Primeiros Passos</h2>
        </div>

        <div className={styles.actionsGrid}>
          <article className={styles.helpCard} data-tourid="help-tour">
            <header>
              <div className={styles.cardIcon}>
                <HugeiconsIcon icon={Route01Icon} size="1.75rem" />
              </div>
              <p className="body-lg-semibold">Tour pela Plataforma</p>
            </header>
            <div className={styles.cardBody}>
              <p className="body-sm">
                Conheça os principais recursos do Flowlinker com um tour guiado
                interativo.
              </p>
              <Button onClick={handleStartTour} className={styles.tourButton}>
                Iniciar Tour
              </Button>
            </div>
          </article>

          <article className={styles.helpCard}>
            <header>
              <div className={styles.cardIcon}>
                <HugeiconsIcon icon={Mail02Icon} size="1.75rem" />
              </div>
              <p className="body-lg-semibold">Email</p>
            </header>
            <div className={styles.cardBody}>
              <p className="body-sm">
                Envie suas dúvidas ou sugestões por email. Respondemos em até 24
                horas úteis.
              </p>
              <a
                href="mailto:suporte@flowlinker.com"
                className={styles.contactLink}
              >
                suporte@flowlinker.com
              </a>
            </div>
          </article>

          <article className={styles.helpCard}>
            <header>
              <div className={styles.cardIcon}>
                <HugeiconsIcon icon={WhatsappIcon} size="1.75rem" />
              </div>
              <p className="body-lg-semibold">WhatsApp</p>
            </header>
            <div className={styles.cardBody}>
              <p className="body-sm">
                Atendimento rápido pelo WhatsApp para suporte técnico e dúvidas.
              </p>
              <a
                href="https://wa.me/5511947715632"
                target="_blank"
                rel="noreferrer noopener"
                className={styles.contactLink}
              >
                +55 11 94771-5632
              </a>
            </div>
          </article>
        </div>

        {/* FAQ Section */}
        <article className={styles.faqCard}>
          <header>
            <div className={styles.faqIcon}>
              <HugeiconsIcon icon={HelpCircleIcon} size="1.75rem" />
            </div>
            <p className="body-lg-semibold">Perguntas Frequentes</p>
          </header>
          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary className="body-md-semibold">
                Como adicionar um novo perfil?
              </summary>
              <p className="body-sm">
                Acesse a página "Perfis" no menu lateral e clique em "Adicionar
                Perfil". Preencha os dados solicitados (nome, usuário, senha e
                rede social) e salve. O sistema utilizará cookies para manter
                sua sessão ativa.
              </p>
            </details>
            <details className={styles.faqItem}>
              <summary className="body-md-semibold">
                Como funciona o limite de dispositivos?
              </summary>
              <p className="body-sm">
                Cada plano possui um limite de dispositivos conectados. Você
                pode visualizar e gerenciar seus dispositivos na página
                "Dispositivos". Caso precise de mais dispositivos, considere
                fazer upgrade do seu plano.
              </p>
            </details>
            <details className={styles.faqItem}>
              <summary className="body-md-semibold">
                O que são os delays de segurança?
              </summary>
              <p className="body-sm">
                Delays são intervalos de tempo entre ações que mimetizam o
                comportamento humano. Eles são essenciais para proteger suas
                contas de bloqueios e punições das plataformas.
              </p>
            </details>
            <details className={styles.faqItem}>
              <summary className="body-md-semibold">
                Por que usar rotação de perfis?
              </summary>
              <p className="body-sm">
                A rotação alterna o uso de múltiplas contas para distribuir as
                ações. Isso reduz significativamente o risco de bloqueios e
                permite maior escala nas suas campanhas.
              </p>
            </details>
            <details className={styles.faqItem}>
              <summary className="body-md-semibold">
                Como alterar meus dados de pagamento?
              </summary>
              <p className="body-sm">
                Acesse "Configurações" no menu lateral e clique em "Abrir portal
                de pagamentos". Você será redirecionado para o portal seguro da
                Stripe onde poderá gerenciar seus dados.
              </p>
            </details>
            <details className={styles.faqItem}>
              <summary className="body-md-semibold">
                O Flowlinker está em conformidade com a LGPD?
              </summary>
              <p className="body-sm">
                Sim. Recomendamos que você utilize o Termo de Autorização e
                Responsabilidade disponível nesta página ao gerenciar contas de
                terceiros, garantindo conformidade legal e transparência.
              </p>
            </details>
          </div>
        </article>
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        title={videoModal.title}
        size="lg"
      >
        <div className={styles.videoContainer}>
          {videoModal.isOpen && (
            <iframe
              src={getYouTubeEmbedUrl(videoModal.url)}
              title={videoModal.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.videoIframe}
            />
          )}
        </div>
      </Modal>
    </section>
  );
};

export default Help;
