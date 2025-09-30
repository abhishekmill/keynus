"use client";
import React, { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import * as yup from "yup";
import { usePathname } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import AppModal from "@/components/module/_basic/modal";
import Button from "@/components/ui/button";
import SwitchToggle from "../../../../../../../../../ui/toggle";
import NumberingDirectionCard from "./numberingDirectionCard";
import Selector from "../../../../../../../../../ui/selector";
import { ILockerwallArticle, INumbering } from "../../../../../../../../../../utils/types";
import { locationList } from "../../../../../../../../../../utils/constant";
import callServerAction from "../../../../../../../../../../utils/callServerAction";
import { saveNumberingArticleToLockerWall } from "../../../../../../../../../../app/actions/lockerwall";
import { revalidatePath } from "../../../../../../../../../../utils/cookie";

import styles from "./style.module.scss";

const schema = yup.object().shape({
  type: yup.object().required(),
  direction: yup.string().required(),
});

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  numberingArticleList: INumbering[];
  lockerwallArticle: ILockerwallArticle[] | undefined;
  lockerwallId: string;
  transText: {
    [key: string]: string;
  };
};

const NumberingModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  lockerwallId,
  lockerwallArticle,
  numberingArticleList,
  transText,
}) => {
  const { register, watch, control, handleSubmit } = useForm<any>({
    resolver: yupResolver(schema),
  });
  const pathname = usePathname();
  const watchDirection = watch("direction");
  const [isAdding, setIsAdding] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    setIsAdding(true);
    try {
      await callServerAction(saveNumberingArticleToLockerWall, {
        keyniusProjectLockerwallId: lockerwallId,
        keyniusPIMArticleId: data.type.value,
        location: data.location.value,
        position: data.direction,
        startingNumber: data.startingNumber,
        isSmartyIncluded: data.isSmartyIncluded,
      });
      revalidatePath(pathname);
      toast.success("Lockerwall number added successfully.");
      setIsOpen(false);
    } catch (error) {
      toast.error(error?.errors?.[0] ?? "Something went wrong");
      console.log("error: ", error);
    }
    setIsAdding(false);
  };

  useEffect(() => {
    if (lockerwallArticle) {
      const data = lockerwallArticle.filter((item) => item.accessoryType === "numberingTypeReference");
      console.log("data: ", data);
    }
  }, [lockerwallArticle]);

  return (
    <AppModal size="lg" isOpen={isOpen} setIsOpen={setIsOpen} hasClose>
      <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.heading}>{transText.lockerwallNumbering}</h1>
        <div className={styles.body}>
          <div className={styles.boxWrapper}>
            <p>{transText.numberTypeQuestion}</p>
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => {
                return (
                  <Selector
                    label={"Type"}
                    options={numberingArticleList?.map((item) => ({ label: item.articleName, value: item.id }))}
                    value={value ?? { label: "None", value: "" }}
                    setValue={(type) => onChange(type)}
                    className={styles.selector}
                  />
                );
              }}
            />
          </div>
          <div className={styles.boxWrapper}>
            <p>{transText.doorNumbering}</p>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => {
                return (
                  <Selector
                    label={"Location"}
                    options={locationList?.map((item) => ({ label: item.label, value: item.value }))}
                    value={value ?? { label: "None", value: "" }}
                    setValue={(type) => onChange(type)}
                    className={styles.selector}
                  />
                );
              }}
            />
          </div>

          <div className={styles.direction}>
            <NumberingDirectionCard
              value={"vertical"}
              label="Vertical"
              register={register("direction")}
              active={watchDirection}
            />
            <NumberingDirectionCard
              value={"horizontal"}
              label="Horizontal"
              register={register("direction")}
              active={watchDirection}
            />
          </div>
          <div className={styles.numberInput}>
            <p className={styles.label}>{transText.startingNumber}</p>
            <input type="text" className={styles.input} {...register("startingNumber")} />
          </div>
          <div className={styles.smartyInput}>
            <p className={styles.label}>{transText.includeSmarty}</p>
            <Controller
              name="isSmartyIncluded"
              control={control}
              render={({ field: { onChange, value = false } }) => (
                <SwitchToggle prefix="No" suffix="Yes" defaultValue={value} onChange={onChange} />
              )}
            />
          </div>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            type="submit"
            label={transText.add}
            className={styles.button}
            isLoading={isAdding}
            disabled={isAdding}
          />
        </div>
      </form>
    </AppModal>
  );
};

export default NumberingModal;
