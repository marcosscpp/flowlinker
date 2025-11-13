import { Sidebar } from "@/components";
import type { ReactNode } from "react";
import styles from "./SidebarView.module.scss";

interface SidebarViewProps {
  children: ReactNode;
}

const SidebarView = ({ children }: SidebarViewProps) => {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default SidebarView;
