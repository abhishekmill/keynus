"use client";

import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Alert from "../../../ui/alert";
import Button from "../../../ui/button";
import TextInput from "../../../ui/textInput";

import styles from "./style.module.scss";

const schema = yup.object().shape({
  email: yup.string().email("Email is not valid").required("Email is a required field"),
  password: yup.string().required("Password is a required field"),
});

type Props = {
  transText: {
    [key: string]: string;
  };
};

const NewPasswordForm: React.FC<Props> = ({ transText }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    setLoading(false);
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onLogin)}>
      <h2 className={styles.heading}>{transText.heading}</h2>
      <TextInput
        name="password"
        type="password"
        label={transText.password}
        register={register}
        errorMsg={errors.password?.message}
      />
      <div>
        <TextInput
          name="passwordConfirm"
          type="password"
          label={transText.confirmPassword}
          register={register}
          errorMsg={errors.password?.message}
        />
      </div>
      <div className={styles.button}>
        <Button label={transText.updatePassword} isLoading={loading} />
      </div>
      <Alert message={errorMsg} className={styles.alert} />
    </form>
  );
};

export default NewPasswordForm;
