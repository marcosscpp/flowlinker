import { useState } from "react";
import { Button, Field } from "@/components";
import styles from "./ForgotPassword.module.scss";
import { authService } from "@/services";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await authService.requestPasswordReset({
        email,
        redirectBaseUrl: window.location.origin + "/redefinir-senha",
      });
      setSent(true);
    } catch (err) {
      // Silencia a existência do e-mail conforme requisito; mostra mensagem genérica
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header>
          <h1 className="title-md">Esqueci minha senha</h1>
          <p className="body-sm">
            Informe seu e-mail para receber o link de redefinição.
          </p>
        </header>

        {sent ? (
          <p className="body-sm">
            Se o e-mail existir, você receberá um link para redefinir sua senha.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <Field
              label="E-mail"
              type="email"
              name="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error ? <p className="body-sm" style={{ color: "var(--color-red-600)" }}>{error}</p> : null}
            <div className={styles.actions} style={{ marginTop: "1rem" }}>
              <Button
                type="button"
                variant="danger"
                onClick={() => navigate("/login")}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                Enviar link
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;


