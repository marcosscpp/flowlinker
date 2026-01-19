import clsx from "clsx";
import styles from "./ListLoader.module.scss";

interface ListLoaderProps {
  text?: string;
  className?: string;
}

/**
 * Componente de loading elegante para listas
 * Exibe pontos pulsantes com texto opcional
 */
const ListLoader = ({ text = "Carregando", className }: ListLoaderProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.dotsWrapper}>
        <div className={styles.dot} />
        <div className={styles.dot} />
        <div className={styles.dot} />
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default ListLoader;
