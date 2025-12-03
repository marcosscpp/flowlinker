import clsx from "clsx";
import styles from "./FullScreenLoader.module.scss";

interface FullScreenLoaderProps {
  variant?: "default" | "fixed";
}

const FullScreenLoader = ({ variant = "default" }: FullScreenLoaderProps) => {
  return (
    <div className={clsx(styles.container, { [styles.fixed]: variant === "fixed" })}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default FullScreenLoader;
