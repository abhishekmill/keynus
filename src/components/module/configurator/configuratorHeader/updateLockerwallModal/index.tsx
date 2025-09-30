import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import AppModal from "../../../_basic/modal";
import Button from "@/components/ui/button";
import Selector from "@/components/ui/selector";
import TextArea from "@/components/ui/textarea";
import TextInput from "@/components/ui/textInput";
import { ILockCategory, ILockType } from "@/utils/types";
import { getLockerWallLockCategory, getLockerWallLockType } from "@/app/actions/lockerwall";

import styles from "./style.module.scss";

const schema = yup.object().shape({
  name: yup.string().required("Lockerwall Name is a required field"),
  floor: yup.string().required("Floor is a required field"),
  category: yup.string().required("Locker category is a required field"),
  type: yup.string().required("Locker type is a required field"),
  notes: yup.string().required("Note is a required field"),
});

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transText?: { [key: string]: string };
};

const UpdateLockerwallModal: React.FC<Props> = ({ transText, open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [lockCategories, setLockCategories] = useState<ILockCategory[]>([]);
  const [lockTypes, setLockTypes] = useState<ILockType[]>([]);
  const [lockTypeFetchLoading, setLockTypeFetchLoading] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      floor: "",
      type: "",
      notes: "",
    },
  });
  const watchCategory = watch("category");

  const onSave = async () => {
    setLoading(true);
  };

  const getLocksCategory = async () => {
    setLockTypeFetchLoading(true);
    const res = await getLockerWallLockCategory();
    if (res.isSuccess) {
      setLockCategories(res.result ?? []);
    }
    setLockTypeFetchLoading(false);
  };

  const getLocksType = async (categoryId: string) => {
    setLockTypeFetchLoading(true);
    const res = await getLockerWallLockType(categoryId);
    if (res.isSuccess) {
      setLockTypes(res.result ?? []);
    }
    setLockTypeFetchLoading(false);
  };

  useEffect(() => {
    getLocksCategory();
  }, []);

  useEffect(() => {
    if (watchCategory) {
      getLocksType(watchCategory);
    }
  }, [watchCategory]);

  return (
    <AppModal isOpen={open} setIsOpen={setOpen} size="lg" hasClose>
      <div className={styles.wrapper}>
        <h1 className={styles.heading}>{transText?.editLockerWall}</h1>
        <form className={styles.content} onSubmit={handleSubmit(onSave)}>
          <div className={styles.element}>
            <span className={styles.label}>{transText?.nameLabel}</span>
            <TextInput
              name="name"
              register={register}
              label={transText?.lockerwallName}
              className={styles.formElement}
              errorMsg={errors.name?.message}
            />
          </div>
          <div className={styles.element}>
            <span className={styles.label}>{transText?.floorLabel}</span>
            <TextInput
              name="floor"
              register={register}
              label={transText?.floor}
              className={styles.formElement}
              errorMsg={errors.floor?.message}
            />
          </div>
          <div className={styles.dropdownsElements}>
            <span className={styles.label}>{transText?.typeLabel}</span>
            <div className={styles.dropdowns}>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => {
                  const selectedCategory = lockCategories.find((item) => item.id === value);
                  return (
                    <Selector
                      label={transText?.lockerCategory}
                      options={lockCategories?.map((item) => ({ value: item.id, label: item.name }))}
                      value={{ label: selectedCategory?.name ?? "None", value: selectedCategory?.id ?? "" }}
                      setValue={(type) => {
                        onChange(type.value);
                      }}
                    />
                  );
                }}
              />
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => {
                  const selectedType = lockTypes.find((item) => item.id === value);
                  return (
                    <Selector
                      label={transText?.lockerType}
                      options={lockTypes?.map((item) => ({ value: item.id, label: item.name }))}
                      value={{ label: selectedType?.name ?? "None", value: selectedType?.id ?? "" }}
                      setValue={(type) => {
                        onChange(type.value);
                      }}
                      isLoading={lockTypeFetchLoading}
                    />
                  );
                }}
              />
            </div>
          </div>
          <div className={styles.textArea}>
            <span className={styles.label}>{transText?.notesLabel}</span>
            <TextArea
              name="notes"
              label={transText?.lockerwallNotes}
              className={styles.formElement}
              rows={6}
              register={register}
              errorMsg={errors.notes?.message}
            />
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              type="submit"
              label={transText?.saveLockerWall}
              variant="solid"
              className={styles.button}
              isLoading={loading}
            />
          </div>
        </form>
      </div>
    </AppModal>
  );
};

export default UpdateLockerwallModal;
