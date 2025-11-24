import { useState } from "react";
import { Sidebar } from "@/components";
import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./SidebarView.module.scss";

interface SidebarViewProps {
  children: ReactNode;
}

const SidebarView = ({ children }: SidebarViewProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={styles.container}>
      <aside
        className={clsx(styles.sidebar, {
          [styles.expanded]: isExpanded,
          [styles.collapsed]: !isExpanded,
        })}
      >
        <Sidebar
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((prev) => !prev)}
        />
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default SidebarView;
