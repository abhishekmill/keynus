"use client";
import React from "react";
import * as yup from "yup";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import RadioButton from "@/components/ui/radioButton";
import Button from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/store";
import { configuratorControlSelector, saveImageAction, updateIsSaveSeveralImage } from "@/store/configuratorControl";
import SwitchToggle from "../../../../ui/toggle";

import styles from "./style.module.scss";

const schema = yup.object().shape({
  imageType: yup.string().required(),
});

type Props = {
  transText?: { [key: string]: string };
};

const SaveImagePopup: React.FC<Props> = ({ transText }) => {
  const { isSaveSeveralImage } = useAppSelector(configuratorControlSelector);
  const dispatch = useAppDispatch();

  const { register, handleSubmit } = useForm({ resolver: yupResolver(schema) });

  /**
   * Dispatch selected image type to redux
   * @param data image type from radio
   */
  const onSave = (data: FieldValues) => {
    dispatch(saveImageAction(data.imageType));
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSave)}>
      <h5>{transText?.saveImage}</h5>
      <h5>{transText?.showAllAngles}</h5>
      <div className={styles.switchWrapper}>
        <p>{transText?.no}</p>
        <SwitchToggle
          defaultValue={isSaveSeveralImage}
          onChange={(e) => {
            dispatch(updateIsSaveSeveralImage(e));
          }}
        />
        <p>{transText?.yes}</p>
      </div>
      <h5>{transText?.chooseFormat}</h5>
      <div className={styles.radioWrapper}>
        <RadioButton name="imageType" value="jpg" label=".jpg" register={register} />
        <RadioButton name="imageType" value="png" label=".png" register={register} />
        <RadioButton name="imageType" value="pdf" label=".pdf" register={register} />
      </div>
      <Button type="submit" label={transText?.save} className={styles.button} />
    </form>
  );
};

export default SaveImagePopup;
