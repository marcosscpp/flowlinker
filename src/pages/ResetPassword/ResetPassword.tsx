import { useEffect, useMemo, useState } from "react";
import { Button, Field } from "@/components";
import styles from "./ResetPassword.module.scss";
import { authService } from "@/services";
import { useLocation, useNavigate } from "react-router-dom";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = query.get("token") || "";

  useEffect(() => {
    if (!token) {
      setError("Token inválido ou ausente.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await authService.resetPassword({ token, newPassword: password });
      setSuccess(true);
    } catch (err) {
      setError("Token inválido ou expirado.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header>
          <h1 className="title-md">Redefinir senha</h1>
          <p className="body-sm">Crie uma nova senha para sua conta.</p>
        </header>

        {success ? (
          <>
            <p className="body-sm">Senha alterada com sucesso.</p>
            <div className={styles.actions}>
              <Button onClick={() => navigate("/login")}>Ir para o login</Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <Field.Password
              label="Nova senha"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div style={{ marginTop: "0.75rem" }}>
              <Field.Password
                label="Confirmar nova senha"
                name="confirm"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
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
              <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting || !token}>
                Alterar senha
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;


