import React from "react";
import { useTranslations } from "next-intl";

import NewPasswordForm from "../../../module/auth/newPassword";

const NewPasswordPage = () => {
  const t = useTranslations();
  return (
    <NewPasswordForm
      transText={{
        heading: t("Create New Password"),
        email: t("Email"),
        password: t("Password"),
        confirmPassword: t("Confirm Password"),
        canYouRemember: t("Do you remember your password"),
        updatePassword: t("Update password"),
      }}
    />
  );
};

export default NewPasswordPage;
