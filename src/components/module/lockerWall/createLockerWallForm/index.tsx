"use client";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useRouter } from "nextjs-toploader/app";

import Button from "@/components/ui/button";
import Selector from "@/components/ui/selector";
import TextArea from "@/components/ui/textarea";
import TextInput from "@/components/ui/textInput";
import { ILockCategory, ILockType } from "@/utils/types";
import { createNewLockerwall, getLockerWallLockType } from "@/app/actions/lockerwall";
import { defaultLockerWallData, resetLockerWall } from "../../../../store/configurator";
import { setMethod } from "../../../../store/configuratorControl";

import styles from "./style.module.scss";

const schema = yup.object().shape({
  name: yup.string().required("Lockerwall Name is a required field"),
  floor: yup.string().required("Floor is a required field"),
  category: yup.string().required("Locker category is a required field"),
  type: yup.string().required("Locker type is a required field"),
  notes: yup.string(),
});

type Props = {
  id: string;
  lockerCategories?: ILockCategory[];
  transText: { [key: string]: string };
};

const CreateLockerWallForm: React.FC<Props> = ({ transText, id, lockerCategories = [] }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [lockTypeFetchLoading, setLockTypeFetchLoading] = useState(false);
  const [lockTypes, setLockTypes] = useState<ILockType[]>([]);

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      floor: "",
      category: "",
      type: "",
      notes: "",
    },
  });

  const watchCategory = watch("category");

  /**
   * Create new lockerwall
   * @param data Hook form data
   */
  const onSave = async (data: FieldValues) => {
    dispatch(resetLockerWall(defaultLockerWallData.lockerWallData));
    try {
      setLoading(true);
      const res = await createNewLockerwall({ ...data, projectId: id });
      if (res.isSuccess) {
        dispatch(setMethod("reset"));
        router.push(`/projects/${id}/lockerwall/${res?.result?.id}/list`);
      } else {
        throw new Error(res?.message ?? res?.errors?.join(", ") ?? `Something went wrong`);
      }
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch lock type by lock category id
   * @param categoryId Lock category id
   */
  const getLockerWallType = async (categoryId: string) => {
    setLockTypeFetchLoading(true);
    const res = await getLockerWallLockType(categoryId);
    if (res.isSuccess) {
      setLockTypes(res.result ?? []);
    }
    setLockTypeFetchLoading(false);
  };

  useEffect(() => {
    if (watchCategory) {
      getLockerWallType(watchCategory);
    }
  }, [watchCategory]);

  return (
    <div className={styles.wrapper}>
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
            label={transText?.location}
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
                const selectedCategory = lockerCategories.find((item) => item.id === value);
                return (
                  <Selector
                    label={transText?.lockerCategory}
                    options={lockerCategories?.map((item) => ({ value: item.id, label: item.name }))}
                    value={{ label: selectedCategory?.name ?? "None", value: selectedCategory?.id ?? "" }}
                    errorMsg={errors.category?.message}
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
                    errorMsg={errors.type?.message}
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
          <Button type="submit" label={transText?.save} variant="solid" className={styles.button} isLoading={loading} />
        </div>
      </form>
    </div>
  );
};

export default CreateLockerWallForm;
