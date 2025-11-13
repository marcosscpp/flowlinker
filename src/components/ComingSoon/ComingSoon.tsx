import comingSoonImage from "@/assets/coming-soon-ilustration.png";
import styles from "./ComingSoon.module.scss";

const ComingSoon = () => {
  return (
    <div className={styles.container}>
      <img
        src={comingSoonImage}
        alt="Funcionalidade em Desenvolvimento"
        className={styles.image}
      />
      <p className={`title-xl ${styles.text}`}>
        Funcionalidade em Desenvolvimento
      </p>
    </div>
  );
};

export default ComingSoon;
