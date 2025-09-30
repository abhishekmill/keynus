"use client";

import React, { useEffect, useState } from "react";
import AppModal from "../../../../../_basic/modal";
import * as yup from "yup";
import { toast } from "react-toastify";

import Button from "../../../../../../ui/button";
import TextArea from "../../../../../../ui/textarea";
import callServerAction from "../../../../../../../utils/callServerAction";
import { FieldValues, useForm } from "react-hook-form";
import { IArticleNote } from "../../../../../../../utils/types";
import { SaveProjectAddOnNote } from "../../../../../../../app/actions/article";
import { revalidatePath } from "../../../../../../../utils/cookie";
import { yupResolver } from "@hookform/resolvers/yup";
import { SaveLockerwallArticleNote } from "../../../../../../../app/actions/lockerwall";

import styles from "./style.module.scss";

type Props = {
  selectedArticle: IArticleNote | undefined;
  setSelectedArticle: React.Dispatch<React.SetStateAction<IArticleNote | undefined>>;
  projectId: string;
  transText?: {
    [key: string]: string;
  };
};

const schema = yup.object().shape({
  notes: yup.string(),
});

const ArticleNoteModel: React.FC<Props> = ({ selectedArticle, setSelectedArticle, projectId, transText }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      if (selectedArticle?.lockerWallId) {
        await callServerAction(SaveLockerwallArticleNote, {
          projectId: projectId,
          params: {
            articleId: selectedArticle?.id ?? "",
            lockerwallId: selectedArticle?.lockerWallId ?? "",
            articleType: selectedArticle?.articleType,
            notes: data.notes,
          },
        });
      } else {
        await callServerAction(SaveProjectAddOnNote, {
          projectId: projectId,
          params: {
            articleId: selectedArticle?.id ?? "",
            addOnType: selectedArticle?.addOnType,
            notes: data.notes,
          },
        });
      }
      revalidatePath(`/projects/${projectId}`);
      toast.success("Note updated successfully");
      setIsLoading(false);
      setSelectedArticle(undefined);
    } catch (error: any) {
      toast.error(error?.errors?.[0] ?? "Something went wrong");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reset({ notes: selectedArticle?.notes });
  }, [selectedArticle]);

  return (
    <AppModal
      size="lg"
      isOpen={!!selectedArticle ? true : false}
      setIsOpen={() => {
        setSelectedArticle(undefined);
      }}
      hasClose
    >
      <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.heading}>{selectedArticle?.name ?? ""}</h1>
        <div className={styles.textWrapper}>
          <TextArea name="notes" label={transText?.articleNote} register={register} />
        </div>
        <div className={styles.buttonWrapper}>
          <Button label={transText?.save} className={styles.button} isLoading={isLoading} disabled={isLoading} />
        </div>
      </form>
    </AppModal>
  );
};

export default ArticleNoteModel;
