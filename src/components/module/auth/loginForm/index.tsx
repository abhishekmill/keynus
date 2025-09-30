"use client";

import React, { useState } from "react";
import * as yup from "yup";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { JwtPayload } from "jwt-decode";
import { useRouter } from "nextjs-toploader/app";

import Alert from "../../../ui/alert";
import Button from "../../../ui/button";
import TextInput from "../../../ui/textInput";
import { Link } from "../../../../navigation";
import { login, setCookies } from "../../../../app/actions/auth";
import { decrypt } from "../../../../utils/jwt";
import { useAppDispatch } from "../../../../utils/hooks/store";
import { setUserRole } from "../../../../store/app";

import styles from "./style.module.scss";

const schema = yup.object().shape({
  email: yup.string().email("Email is not valid").required("Email is a required field"),
  password: yup.string().required("Password is a required field"),
});

type Props = {
  transText: {
    heading: string;
    email: string;
    password: string;
    forgotPassword: string;
    login: string;
  };
};

const LoginForm: React.FC<Props> = ({ transText }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onLogin = async (data: FieldValues) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await login({ email: data?.email, password: data?.password });
      if (res.isSuccess) {
        const user: JwtPayload | any = await decrypt(res.result.accessToken);
        const keyOfRole = Object.keys(user as Object).find((key: string) => key.includes("role"));
        if (keyOfRole && user?.[keyOfRole] !== "EntityBackOffice") {
          dispatch(setUserRole(user?.[keyOfRole]));
          await setCookies({ accessToken: res?.result?.accessToken, refreshToken: res?.result?.refreshToken });
          router.push("/projects");
          if (typeof window !== "undefined") {
            localStorage.setItem("email", data?.email ?? "");
          }
        } else {
          setErrorMsg("You are not authorized to access this application");
        }
      } else {
        throw new Error(res.message ?? "Something went wrong");
      }
      setLoading(false);
    } catch (error: any) {
      setErrorMsg(error?.message ?? "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onLogin)}>
      <div className={styles.logoWrapper}>
        <Image src="/logo_black.svg" width={120} height={100} alt="logo" priority />
      </div>
      <h2 className={styles.heading}>{transText.heading}</h2>
      <TextInput name={"email"} label={transText.email} register={register} errorMsg={errors.email?.message} />
      <div>
        <TextInput
          name="password"
          type="password"
          label={transText.password}
          register={register}
          errorMsg={errors.password?.message}
        />
        <div className={styles.forgotPasswordWrapper}>
          <Link href="/auth/reset-password">{transText.forgotPassword}</Link>
        </div>
      </div>
      <div className={styles.button}>
        <Button label={transText.login} isLoading={loading} />
      </div>
      <Alert message={errorMsg} className={styles.alert} />
    </form>
  );
};

export default LoginForm;
