import { useEffect, useMemo, useState } from "react";
import { Button, Field } from "@/components";
import styles from "./ResetPassword.module.scss";
import { authService } from "@/services";
import { useLocation, Link } from "react-router-dom";

import FlowlinkerLogo from "@/assets/flowlinker-logo.svg";
import FlowlinkerIcon from "@/assets/flowlinker-icon.svg";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  SquareLock02Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const ResetPassword = () => {
  const query = useQuery();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState(false);
  const token = query.get("token") || "";

  useEffect(() => {
    if (!token) {
      setTokenError(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    try {
      await authService.resetPassword({ token, newPassword: password });
      setSuccess(true);
    } catch (err) {
      setError(
        "Token inválido ou expirado. Solicite um novo link de recuperação."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    // Token inválido ou ausente
    if (tokenError) {
      return (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>
            <HugeiconsIcon icon={AlertCircleIcon} size={64} strokeWidth={1.5} />
          </div>
          <header className={styles.header}>
            <h1 className="title-lg">Link inválido</h1>
            <p className="body-sm">
              O link de redefinição de senha é inválido ou expirou. Por favor,
              solicite um novo link de recuperação.
            </p>
          </header>
          <Link to="/esqueci-senha" className={styles.linkButton}>
            <Button fullWidth>Solicitar novo link</Button>
          </Link>
          <Link to="/login" className={styles.backLink}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            <span>Voltar para o login</span>
          </Link>
        </div>
      );
    }

    // Senha alterada com sucesso
    if (success) {
      return (
        <div className={styles.successState}>
          <div className={styles.successIcon}>
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={64}
              strokeWidth={1.5}
            />
          </div>
          <header className={styles.header}>
            <h1 className="title-lg">Senha alterada!</h1>
            <p className="body-sm">
              Sua senha foi redefinida com sucesso. Agora você pode fazer login
              com sua nova senha.
            </p>
          </header>
          <Link to="/login" className={styles.linkButton}>
            <Button fullWidth>Ir para o login</Button>
          </Link>
        </div>
      );
    }

    // Formulário de redefinição
    return (
      <>
        <header className={styles.header}>
          <h1 className="title-lg">Criar nova senha</h1>
          <p className="body-sm">
            Digite sua nova senha abaixo. Escolha uma senha forte com pelo menos
            8 caracteres.
          </p>
        </header>

        <form className={styles.form} noValidate onSubmit={handleSubmit}>
          <Field.Password
            label="Nova senha"
            name="password"
            placeholder="Mínimo de 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<HugeiconsIcon icon={SquareLock02Icon} />}
          />

          <Field.Password
            label="Confirmar nova senha"
            name="confirm"
            placeholder="Digite a senha novamente"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            leftIcon={<HugeiconsIcon icon={SquareLock02Icon} />}
          />

          {error && (
            <span className={styles.formError} role="alert">
              {error}
            </span>
          )}

          <div className={styles.passwordRequirements}>
            <p className="body-xs">Sua senha deve conter:</p>
            <ul className="body-xs">
              <li className={password.length >= 8 ? styles.valid : ""}>
                Mínimo de 8 caracteres
              </li>
              <li
                className={
                  password === confirm && confirm.length > 0 ? styles.valid : ""
                }
              >
                Confirmação correspondente
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting || !password || !confirm}
          >
            Redefinir senha
          </Button>
        </form>

        <footer className={styles.footer}>
          <Link to="/login" className={styles.backLink}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            <span>Voltar para o login</span>
          </Link>
        </footer>
      </>
    );
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

            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
