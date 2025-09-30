"use client";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import AppModal from "@/components/module/_basic/modal";
import Button from "@/components//ui/button";
import TextArea from "@/components/ui/textarea";
import TextInput from "../../../../../../../../../ui/textInput";
import callServerAction from "../../../../../../../../../../utils/callServerAction";
import { ILockerwall } from "../../../../../../../../../../utils/types";
import { updateLockerwall } from "../../../../../../../../../../app/actions/lockerwall";
import { usePathname } from "../../../../../../../../../../navigation";

import styles from "./style.module.scss";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  lockerwall: ILockerwall;
  transText?: {
    [key: string]: string;
  };
};

const schema = yup.object().shape({
  name: yup.string(),
  location: yup.string(),
  notes: yup.string(),
});

const NotesModal: React.FC<Props> = ({ isOpen, setIsOpen, lockerwall, transText }) => {
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const pathname = usePathname();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    if (
      data?.notes === lockerwall?.notes &&
      data?.name === lockerwall?.lockerWallName &&
      data?.location === lockerwall?.floor
    ) {
      toast.warning("you should change something");
      return;
    }
    setIsLoading(true);
    try {
      await callServerAction(updateLockerwall, {
        id: lockerwall?.id,
        projectId: lockerwall?.keyniusProjectId,
        floor: data.location,
        ...data,
      });
      toast.success("Note updated successfully");
      setIsOpen(false);
      router.replace(`${pathname}`);
      router.refresh();
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.error ?? "Something went wrong");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    reset({
      name: lockerwall?.lockerWallName ?? "",
      notes: lockerwall?.notes ?? "",
      location: lockerwall?.floor ?? "",
    });
  }, []);

  return (
    <AppModal size="lg" isOpen={isOpen} setIsOpen={setIsOpen} hasClose>
      <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.heading}>{transText?.editLockerwall ?? ""}</h1>
        <div className={styles.inputWrapper}>
          <p>{transText?.editLockerwallName ?? ""}</p>
          <TextInput name="name" label="Lockerwall name" className={styles.input} register={register} />
        </div>
        <div className={styles.inputWrapper}>
          <p>{transText?.editLockerwallLocation ?? ""}</p>
          <TextInput name="location" label="Location" className={styles.input} register={register} />
        </div>
        <div className={styles.textWrapper}>
          <p>{transText?.editLockerwallNote ?? ""}</p>
          <TextArea name="notes" label="Lockerwall notes" register={register} />
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            label={transText?.saveLockerwall ?? ""}
            className={styles.button}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </form>
    </AppModal>
  );
};

export default NotesModal;
