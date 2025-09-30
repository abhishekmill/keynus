import React from "react";
import { useTranslations } from "next-intl";

import LoginForm from "../../../module/auth/loginForm";

const LoginPage = () => {
  const t = useTranslations();
  return (
    <LoginForm
      transText={{
        heading: t("Sign in"),
        email: t("Email"),
        password: t("Password"),
        forgotPassword: t("Forgot password?"),
        login: t("Login"),
      }}
    />
  );
};

export default LoginPage;
