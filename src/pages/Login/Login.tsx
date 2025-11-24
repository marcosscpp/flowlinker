import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components";

import FlowlinkerLogo from "@/assets/flowlinker-logo.svg";
import FlowlinkerIcon from "@/assets/flowlinker-icon.svg";

import styles from "./Login.module.scss";

import { Button } from "@/components";

import { HugeiconsIcon } from "@hugeicons/react";
import { Mail02Icon, SquareLock02Icon } from "@hugeicons/core-free-icons";
import { loginSchema, type LoginSchema } from "./login.schema";
import { useAuth } from "@/context";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, isLoading: isAuthLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (data: LoginSchema) => {
      try {
        await login({
          email: data.email,
          password: data.password,
        });
        reset();
        navigate("/", { replace: true });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Não foi possível fazer login";
        setError("root", { type: "manual", message });
      }
    },
    [login, navigate, reset, setError]
  );

  const rootError = errors.root?.message ?? authError ?? null;
  const isLoading = isSubmitting || isAuthLoading;

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
            <header className={styles.header}>
              <h1 className="title-lg">Bem-vindo ao FlowLinker</h1>
              <p className="body-sm">
                Conecte-se à sua jornada de automação e crescimento digital.
                Aqui, sua evolução digital começa agora.
              </p>
            </header>

            <form
              className={styles.form}
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <Field
                {...register("email")}
                error={Boolean(errors.email)}
                supportText={errors.email?.message}
                label="Email"
                type="email"
                placeholder="Email"
                id="email"
                leftIcon={<HugeiconsIcon icon={Mail02Icon} />}
              />
              <Field.Password
                {...register("password")}
                error={Boolean(errors.password)}
                supportText={errors.password?.message}
                label="Senha"
                placeholder="••••••••••••••••"
                id="password"
                leftIcon={<HugeiconsIcon icon={SquareLock02Icon} />}
              />

              {rootError ? (
                <span className={styles.formError} role="alert">
                  {rootError}
                </span>
              ) : null}

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Entrar
              </Button>
            </form>

            <footer className={styles.footer}>
              <span className="body-sm">
                Em caso de dúvidas ou problemas para acessar sua conta, {""}
                <a href="mailto:support@flowlinker.com">
                  entre em contato com o nosso suporte
                </a>
              </span>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
