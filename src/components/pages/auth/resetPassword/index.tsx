import React from "react";
import { useTranslations } from "next-intl";

import ResetPasswordForm from "../../../module/auth/resetPasswordForm";

const ResetPasswordPage = () => {
  const t = useTranslations();
  return (
    <ResetPasswordForm
      transText={{
        heading: t("Reset password"),
        email: t("Email"),
        canYouRemember: t("Do you remember your password"),
        resetPassword: t("Reset password"),
      }}
    />
  );
};

export default ResetPasswordPage;
