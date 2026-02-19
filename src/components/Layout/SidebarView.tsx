import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components";
import type { ReactNode } from "react";
import clsx from "clsx";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import styles from "./SidebarView.module.scss";
import BottomNav from "./BottomNav";
import { BREAKPOINTS } from "@/constants";

interface SidebarViewProps {
  children: ReactNode;
}

const SidebarView = ({ children }: SidebarViewProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth <= BREAKPOINTS.mobile;
    setIsMobile(mobile);
    if (mobile) {
      setIsExpanded(false);
    }
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [checkMobile]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleOverlayClick = () => {
    if (isMobile && isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleOpenSidebar = () => {
    setIsExpanded(true);
  };

  const getToggleIcon = () => {
    if (isMobile) return Cancel01Icon;
    return isExpanded ? ArrowLeft01Icon : ArrowRight01Icon;
  };

  return (
    <div className={styles.container}>
      <div
        className={clsx(styles.overlay, {
          [styles.visible]: isMobile && isExpanded,
        })}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      <aside
        className={clsx(styles.sidebar, {
          [styles.expanded]: isExpanded,
          [styles.collapsed]: !isExpanded,
        })}
      >
        <Sidebar isExpanded={isExpanded} isMobile={isMobile} />
        {(!isMobile || isExpanded) && (
          <button
            type="button"
            className={clsx(styles.toggleButton, {
              [styles.toggleMobile]: isMobile,
            })}
            onClick={handleToggle}
            aria-label={isExpanded ? "Fechar menu" : "Abrir menu"}
          >
            <HugeiconsIcon icon={getToggleIcon()} size="1.5rem" />
          </button>
        )}
      </aside>
      <main className={styles.main}>{children}</main>
      {isMobile && <BottomNav onMenuClick={handleOpenSidebar} />}
    </div>
  );
};

export default SidebarView;
