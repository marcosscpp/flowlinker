import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home09Icon,
  CreditCardIcon,
  Analytics01Icon,
  UserMultiple03Icon,
  LaptopPhoneSyncFreeIcons,
  SparklesIcon,
  LogoutSquare01Icon,
} from "@hugeicons/core-free-icons";
import SidebarItem from "../UI/SidebarItem";
import Button from "../UI/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import FlowlinkerLogo from "@/assets/flowlinker-logo.svg";
import styles from "./Sidebar.module.scss";

const ICON_SIZE = "2rem"; // 32px

const SidebarIcon = ({ icon }: { icon: typeof Home09Icon }) => (
  <HugeiconsIcon icon={icon} size={ICON_SIZE} />
);

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logo}>
          <img
            src={FlowlinkerLogo}
            alt="Flowlinker Logo"
            className={styles.logoImage}
          />
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <SidebarItem
              to="/"
              status={isActive("/") ? "active" : "default"}
              isExpanded={true}
              traillingIcon={<SidebarIcon icon={Home09Icon} />}
            >
              <span>Início</span>
            </SidebarItem>

            <SidebarItem
              to="/pagamentos"
              status={isActive("/pagamentos") ? "active" : "default"}
              isExpanded={true}
              traillingIcon={<SidebarIcon icon={CreditCardIcon} />}
            >
              <span>Pagamentos</span>
            </SidebarItem>

            <SidebarItem
              to="/estatisticas"
              status={isActive("/estatisticas") ? "active" : "default"}
              isExpanded={true}
              traillingIcon={<SidebarIcon icon={Analytics01Icon} />}
            >
              <span>Estatísticas</span>
            </SidebarItem>

            <SidebarItem
              to="/personas"
              status={isActive("/personas") ? "active" : "default"}
              isExpanded={true}
              traillingIcon={<SidebarIcon icon={UserMultiple03Icon} />}
            >
              <span>Personas</span>
            </SidebarItem>

            <SidebarItem
              to="/dispositivos"
              status={isActive("/dispositivos") ? "active" : "default"}
              isExpanded={true}
              badgeValue={3}
              traillingIcon={<SidebarIcon icon={LaptopPhoneSyncFreeIcons} />}
            >
              <span>Dispositivos</span>
            </SidebarItem>

            <SidebarItem
              to="/inteligencia-artificial"
              status={
                isActive("/inteligencia-artificial") ? "active" : "default"
              }
              isExpanded={true}
              traillingIcon={<SidebarIcon icon={SparklesIcon} />}
            >
              <span>IA</span>
            </SidebarItem>
          </ul>
        </nav>
      </div>

      <Button
        type="button"
        onClick={handleLogout}
        className={styles.logoutButton}
        leftIcon={<HugeiconsIcon icon={LogoutSquare01Icon} />}
        fullWidth={true}
      >
        Sair
      </Button>
    </div>
  );
};

export default Sidebar;
