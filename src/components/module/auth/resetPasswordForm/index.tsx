"use client";

import React, { useState } from "react";
import * as yup from "yup";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Alert from "../../../ui/alert";
import Button from "../../../ui/button";
import TextInput from "../../../ui/textInput";
import { resetPassword } from "../../../../app/actions/auth";

import styles from "./style.module.scss";

const schema = yup.object().shape({
  email: yup.string().email("Email is not valid").required("Email is a required field"),
});

type Props = {
  transText: {
    [key: string]: string;
  };
};

const ResetPasswordForm: React.FC<Props> = ({ transText }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const emailWatch = watch("email");

  const onSendEmail = async (data: FieldValues) => {
    setLoading(true);
    setErrorMsg("");
    const res = await resetPassword({ email: data?.email });
    if (res.isSuccess) {
      setIsEmailSent(true);
    } else {
      setErrorMsg(res.message);
    }
    setLoading(false);
  };

  return isEmailSent ? (
    <div className={styles.waitingMessageWrapper}>
      <span className={styles.message}>
        We sent an email to <span className={styles.email}>{emailWatch}</span> with a link to reset your password!
      </span>
    </div>
  ) : (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSendEmail)}>
      <h2 className={styles.heading}>{transText.heading}</h2>
      <div className={styles.inputWrapper}>
        <TextInput name="email" label={transText.email} register={register} errorMsg={errors.email?.message} />
      </div>
      <div className={styles.button}>
        <Button label={transText.resetPassword} isLoading={loading} />
      </div>
      <Alert message={errorMsg} className={styles.alert} />
    </form>
  );
};

export default ResetPasswordForm;
