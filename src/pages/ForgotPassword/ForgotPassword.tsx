import { useState } from "react";
import { Button, Field } from "@/components";
import styles from "./ForgotPassword.module.scss";
import { authService } from "@/services";
import { Link } from "react-router-dom";

import FlowlinkerLogo from "@/assets/flowlinker-logo.svg";
import FlowlinkerIcon from "@/assets/flowlinker-icon.svg";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail02Icon,
  CheckmarkCircle02Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authService.requestPasswordReset({
        email,
        redirectBaseUrl: window.location.origin + "/redefinir-senha",
      });
      setSent(true);
    } catch (err) {
      setError("Não foi possível enviar o link de recuperação.");
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.box}>
        <div className={styles.ilustration}>
          <video
            src="/videos/flowlinker-motion-video.mp4"
            autoPlay
            muted
            loop
            className={styles.video}
          ></video>
          <div className={styles.icon}>
            <img src={FlowlinkerIcon} alt="Flowlinker Icon" />
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.content}>
            <div className={styles.logo}>
              <img src={FlowlinkerLogo} alt="Flowlinker Logo" />
            </div>

            {sent ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={64}
                    strokeWidth={1.5}
                  />
                </div>
                <header className={styles.header}>
                  <h1 className="title-lg">E-mail enviado!</h1>
                  <p className="body-sm">
                    Se o e-mail <strong>{email}</strong> estiver cadastrado em
                    nossa plataforma, você receberá um link para redefinir sua
                    senha em alguns instantes.
                  </p>
                </header>
                <div className={styles.tips}>
                  <p className="body-xs">
                    <strong>Não recebeu o e-mail?</strong>
                  </p>
                  <ul className="body-xs">
                    <li>Verifique sua caixa de spam</li>
                    <li>Certifique-se de que digitou o e-mail corretamente</li>
                    <li>Aguarde alguns minutos antes de tentar novamente</li>
                  </ul>
                </div>
                <Link to="/login" className={styles.backLink}>
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                  <span>Voltar para o login</span>
                </Link>
              </div>
            ) : (
              <>
                <header className={styles.header}>
                  <h1 className="title-lg">Esqueceu sua senha?</h1>
                  <p className="body-sm">
                    Não se preocupe! Digite seu e-mail abaixo e enviaremos um
                    link para você criar uma nova senha.
                  </p>
                </header>

                <form
                  className={styles.form}
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <Field
                    label="E-mail"
                    type="email"
                    name="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    leftIcon={<HugeiconsIcon icon={Mail02Icon} />}
                  />

                  {error && (
                    <span className={styles.formError} role="alert">
                      {error}
                    </span>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    isLoading={isSubmitting}
                    disabled={isSubmitting || !email}
                  >
                    Enviar link de recuperação
                  </Button>
                </form>

                <footer className={styles.footer}>
                  <Link to="/login" className={styles.backLink}>
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                    <span>Voltar para o login</span>
                  </Link>
                </footer>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
