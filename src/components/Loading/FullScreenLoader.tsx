import styles from "./FullScreenLoader.module.scss";

const FullScreenLoader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default FullScreenLoader;
