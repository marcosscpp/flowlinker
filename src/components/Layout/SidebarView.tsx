import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components";
import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./SidebarView.module.scss";
import BottomNav from "./BottomNav";

interface SidebarViewProps {
  children: ReactNode;
}

const MOBILE_BREAKPOINT = 768;

const SidebarView = ({ children }: SidebarViewProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
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
        <Sidebar isExpanded={isExpanded} onToggle={handleToggle} isMobile={isMobile} />
      </aside>
      <main className={styles.main}>{children}</main>
      {isMobile && <BottomNav onMenuClick={handleOpenSidebar} />}
    </div>
  );
};

export default SidebarView;
