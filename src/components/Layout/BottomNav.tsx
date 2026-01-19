import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home09Icon,
  Analytics01Icon,
  Megaphone01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { NavLink } from "react-router-dom";
import styles from "./BottomNav.module.scss";
import clsx from "clsx";

interface BottomNavProps {
  onMenuClick: () => void;
}

const BottomNav = ({ onMenuClick }: BottomNavProps) => {
  return (
    <nav className={styles.bottomNav}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          clsx(styles.navItem, { [styles.active]: isActive })
        }
        end
      >
        <HugeiconsIcon icon={Home09Icon} size="1.5rem" />
        <span>Início</span>
      </NavLink>

      <NavLink
        to="/estatisticas"
        className={({ isActive }) =>
          clsx(styles.navItem, { [styles.active]: isActive })
        }
      >
        <HugeiconsIcon icon={Analytics01Icon} size="1.5rem" />
        <span>Estatísticas</span>
      </NavLink>

      <NavLink
        to="/campanhas"
        className={({ isActive }) =>
          clsx(styles.navItem, { [styles.active]: isActive })
        }
      >
        <HugeiconsIcon icon={Megaphone01Icon} size="1.5rem" />
        <span>Campanhas</span>
      </NavLink>

      <button
        type="button"
        className={clsx(styles.navItem, styles.menuItem)}
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <HugeiconsIcon icon={Menu01Icon} size="1.5rem" />
        <span>Menu</span>
      </button>
    </nav>
  );
};

export default BottomNav;

