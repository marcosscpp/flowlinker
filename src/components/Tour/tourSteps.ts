import type { Step } from "react-joyride";

export const tourSteps: Step[] = [
  // Boas-vindas
  {
    target: "body",
    content: "Bem-vindo ao Flowlinker! Vamos fazer um tour rápido pela plataforma para você conhecer os principais recursos.",
    placement: "center",
    disableBeacon: true,
    title: "Bem-vindo! 👋",
  },

  // Sidebar - Logo
  {
    target: '[data-tourid="sidebar-logo"]',
    content: "Este é o logo do Flowlinker. Clique nele a qualquer momento para voltar à página inicial.",
    placement: "right",
    title: "Flowlinker",
  },

  // Sidebar - Início
  {
    target: '[data-tourid="sidebar-home"]',
    content: "Na página Início você encontra um resumo das suas atividades, métricas principais e ações recentes.",
    placement: "right",
    title: "Início",
  },

  // Sidebar - Estatísticas
  {
    target: '[data-tourid="sidebar-stats"]',
    content: "Aqui você visualiza estatísticas detalhadas: gráficos de desempenho, distribuição por rede social e mapa de calor de horários.",
    placement: "right",
    title: "Estatísticas",
  },

  // Sidebar - Perfis
  {
    target: '[data-tourid="sidebar-profiles"]',
    content: "Gerencie suas contas de redes sociais. Adicione, edite ou remova perfis do Facebook e Instagram.",
    placement: "right",
    title: "Perfis",
  },

  // Sidebar - Dispositivos
  {
    target: '[data-tourid="sidebar-devices"]',
    content: "Veja e gerencie os dispositivos conectados à sua conta. Monitore sessões ativas e desconecte dispositivos se necessário.",
    placement: "right",
    title: "Dispositivos",
  },

  // Sidebar - IA
  {
    target: '[data-tourid="sidebar-ai"]',
    content: "Use nossa inteligência artificial para gerar dicas de conteúdo personalizadas para suas redes sociais.",
    placement: "right",
    title: "Assistente de IA",
  },

  // Sidebar - Configurações
  {
    target: '[data-tourid="sidebar-settings"]',
    content: "Acesse suas configurações de pagamento, visualize faturas e atualize dados de cobrança.",
    placement: "right",
    title: "Configurações",
  },

  // Sidebar - Ajuda
  {
    target: '[data-tourid="sidebar-help"]',
    content: "Acesse a Central de Ajuda para refazer este tour, ver perguntas frequentes ou entrar em contato conosco.",
    placement: "right",
    title: "Ajuda",
  },

  // Home - KPIs
  {
    target: '[data-tourid="home-kpis"]',
    content: "Estes cards mostram suas métricas principais: contas ativas, compartilhamentos, pessoas atingidas e erros nas últimas 24 horas.",
    placement: "bottom",
    title: "Métricas Rápidas",
  },

  // Home - Atividades
  {
    target: '[data-tourid="home-activities"]',
    content: "Acompanhe as atividades mais recentes da sua conta em tempo real.",
    placement: "left",
    title: "Atividades Recentes",
  },

  // Home - Download
  {
    target: '[data-tourid="home-download"]',
    content: "Baixe o aplicativo desktop do Flowlinker para automatizar suas tarefas.",
    placement: "bottom",
    title: "Download do App",
  },

  // Finalização
  {
    target: "body",
    content: "Pronto! Agora você conhece os principais recursos do Flowlinker. Se precisar de ajuda, clique no menu Ajuda na barra lateral. Bom trabalho!",
    placement: "center",
    title: "Tour Concluído! 🎉",
  },
];

// Steps específicos por página (para tours futuros por página)
export const statsSteps: Step[] = [
  {
    target: '[data-tourid="stats-filter"]',
    content: "Use o filtro de período para visualizar estatísticas de diferentes intervalos de tempo.",
    placement: "bottom",
    title: "Filtro de Período",
  },
  {
    target: '[data-tourid="stats-charts"]',
    content: "Aqui estão os gráficos com suas estatísticas: resumo, ranking de personas, ações por dia, distribuição por rede social e mapa de calor.",
    placement: "top",
    title: "Gráficos e Métricas",
  },
];

export const profilesSteps: Step[] = [
  {
    target: '[data-tourid="profiles-add"]',
    content: "Clique aqui para adicionar um novo perfil de rede social.",
    placement: "bottom",
    title: "Adicionar Perfil",
  },
  {
    target: '[data-tourid="profiles-list"]',
    content: "Aqui você vê todos os seus perfis cadastrados. Você pode editar ou excluir cada um deles.",
    placement: "top",
    title: "Lista de Perfis",
  },
];

export const devicesSteps: Step[] = [
  {
    target: '[data-tourid="devices-list"]',
    content: "Veja todos os dispositivos conectados à sua conta. Você pode ativar/desativar ou renomear cada dispositivo.",
    placement: "top",
    title: "Dispositivos Conectados",
  },
];

export const aiSteps: Step[] = [
  {
    target: '[data-tourid="ai-form"]',
    content: "Preencha o formulário com informações do seu perfil para receber dicas personalizadas de conteúdo.",
    placement: "bottom",
    title: "Gerador de Dicas",
  },
];

export const billingSteps: Step[] = [
  {
    target: '[data-tourid="billing-action"]',
    content: "Clique aqui para acessar o portal de pagamentos da Stripe, onde você pode visualizar faturas e atualizar dados de cobrança.",
    placement: "bottom",
    title: "Portal de Pagamentos",
  },
];

export default tourSteps;
