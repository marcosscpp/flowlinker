import { HugeiconsIcon } from "@hugeicons/react";
import clsx from "clsx";
import {
  Home09Icon,
  Analytics01Icon,
  UserMultiple03Icon,
  LaptopPhoneSyncFreeIcons,
  SparklesIcon,
  LogoutSquare01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Menu01Icon,
  Cancel01Icon,
  Settings01Icon,
  HelpCircleIcon,
  Megaphone01Icon,
} from "@hugeicons/core-free-icons";
import SidebarItem from "../UI/SidebarItem";
import Button from "../UI/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import FlowlinkerLogo from "@/assets/flowlinker-logo.svg";
import FlowlinkerIcon from "@/assets/flowlinker-favicon.svg";
import styles from "./Sidebar.module.scss";

const ICON_SIZE = "2rem"; // 32px

const SidebarIcon = ({ icon }: { icon: typeof Home09Icon }) => (
  <HugeiconsIcon icon={icon} size={ICON_SIZE} />
);

interface SidebarProps {
  isExpanded?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

const Sidebar = ({ isExpanded = true, onToggle, isMobile = false }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const getToggleIcon = () => {
    if (isMobile) {
      return isExpanded ? Cancel01Icon : Menu01Icon;
    }
    return isExpanded ? ArrowLeft01Icon : ArrowRight01Icon;
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.toggleButton}
        onClick={onToggle}
        aria-label={isExpanded ? "Fechar menu" : "Abrir menu"}
      >
        <HugeiconsIcon
          icon={getToggleIcon()}
          size="1.5rem"
        />
      </button>

      <div>
        <div className={styles.logo} data-tourid="sidebar-logo">
          {isExpanded ? (
            <img
              src={FlowlinkerLogo}
              alt="Flowlinker Logo"
              className={styles.logoImage}
            />
          ) : (
            <img
              src={FlowlinkerIcon}
              alt="Flowlinker Icon"
              className={styles.iconImage}
            />
          )}
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <SidebarItem
              to="/"
              status={isActive("/") ? "active" : "default"}
              isExpanded={isExpanded}
              traillingIcon={<SidebarIcon icon={Home09Icon} />}
              data-tourid="sidebar-home"
            >
              <span>Início</span>
            </SidebarItem>

            <SidebarItem
              to="/estatisticas"
              status={isActive("/estatisticas") ? "active" : "default"}
              isExpanded={isExpanded}
              traillingIcon={<SidebarIcon icon={Analytics01Icon} />}
              data-tourid="sidebar-stats"
            >
              <span>Estatísticas</span>
            </SidebarItem>

            <SidebarItem
              to="/perfis"
              status={isActive("/perfis") ? "active" : "default"}
              isExpanded={isExpanded}
              traillingIcon={<SidebarIcon icon={UserMultiple03Icon} />}
              data-tourid="sidebar-profiles"
            >
              <span>Perfis</span>
            </SidebarItem>

            <SidebarItem
              to="/dispositivos"
              status={isActive("/dispositivos") ? "active" : "default"}
              isExpanded={isExpanded}
              traillingIcon={<SidebarIcon icon={LaptopPhoneSyncFreeIcons} />}
              data-tourid="sidebar-devices"
            >
              <span>Dispositivos</span>
            </SidebarItem>

            <SidebarItem
              to="/campanhas"
              status={isActive("/campanhas") ? "active" : "default"}
              isExpanded={isExpanded}
              traillingIcon={<SidebarIcon icon={Megaphone01Icon} />}
              data-tourid="sidebar-campaigns"
            >
              <span>Campanhas</span>
            </SidebarItem>

            <SidebarItem
              to="/inteligencia-artificial"
              status={
                isActive("/inteligencia-artificial") ? "active" : "default"
              }
              isExpanded={isExpanded}
              traillingIcon={<SidebarIcon icon={SparklesIcon} />}
              data-tourid="sidebar-ai"
            >
              <span>IA</span>
            </SidebarItem>

            <SidebarItem
              to="/pagamentos"
              status={isActive("/pagamentos") ? "active" : "default"}
              isExpanded={isExpanded}
              traillingIcon={<SidebarIcon icon={Settings01Icon} />}
              data-tourid="sidebar-settings"
            >
              <span>Configurações</span>
            </SidebarItem>

            <SidebarItem
              to="/ajuda"
              status={isActive("/ajuda") ? "active" : "default"}
              isExpanded={isExpanded}
              traillingIcon={<SidebarIcon icon={HelpCircleIcon} />}
              data-tourid="sidebar-help"
            >
              <span>Ajuda</span>
            </SidebarItem>
          </ul>
        </nav>
      </div>

      <Button
        type="button"
        onClick={handleLogout}
        className={clsx(styles.logoutButton, !isExpanded && styles.center)}
        leftIcon={<HugeiconsIcon icon={LogoutSquare01Icon} />}
        fullWidth={true}
      >
        {isExpanded ? "Sair" : ""}
      </Button>
    </div>
  );
};

export default Sidebar;
