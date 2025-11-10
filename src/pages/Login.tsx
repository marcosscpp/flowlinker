import { Field } from "@/components";
import { Label } from "@/components";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail02Icon } from "@hugeicons/core-free-icons";

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <Field
        label="Email"
        error={true}
        type="email"
        placeholder="Email"
        id="email"
        name="email"
        supportText="Email is required"
        leftIcon={<HugeiconsIcon icon={Mail02Icon} size={24} strokeWidth={1.5} />}
      />
      <Field.Password
        label="Senha"
        error={true}
        placeholder="••••••••••••••••"
        id="password"
        name="password"
      />
    </div>
  );
};

export default Login;
