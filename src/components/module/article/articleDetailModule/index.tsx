"use client";
import React, { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Button from "@/components/ui/button";
import QuantityInput from "@/components/ui/quantityInput";
import TextInput from "../../../ui/textInput";
import callServerAction from "../../../../utils/callServerAction";
import { IArticle } from "../../../../utils/types";
import { addShopArticleToProject } from "../../../../app/actions/article";
import ArticleColorPanel from "./cabinetColorPanel";
import { euPriceFormat } from "../../../../utils/functions";
import { useAppSelector } from "../../../../utils/hooks/store";
import { projectSelector } from "../../../../store/app";

import styles from "./style.module.scss";

type Props = {
  article: IArticle;
  projectId: string;
  articleId: string;
  locale: string;
  fetchTimeInMs: number;
  transText: { [key: string]: string };
};

const ArticleDetailModule: React.FC<Props> = ({
  article,
  projectId = "",
  articleId = "",
  fetchTimeInMs,
  locale = "",
  transText,
}) => {
  console.log(`API fetch time: ${fetchTimeInMs} ms`);
  const router = useRouter();
  const { discountStatus } = useAppSelector(projectSelector);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState("");
  const [totalPrice, setTotalPrice] = useState(article.price ?? 0);

  const { handleSubmit, control } = useForm();

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      await callServerAction(addShopArticleToProject, {
        ...data,
        keyniusProjectId: projectId,
        keyniusPIMArticleId: articleId,
        pricePerUnit: article.price,
        quantity: quantity,
        ...(selectedColorId ? { keyniusPIMArticleColorId: selectedColorId } : null),
      });
      toast.success("article added successfully");
      router.push(`/${locale}/projects/${projectId}`);
      router.refresh();
    } catch (error) {
      console.error("error", error);
      toast.error(error?.error ?? "Something went wrong");
    }
    setIsLoading(false);
  };

  console.log("article", article);

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.viewWrapper}>
        <div className={styles.imageWrapper}>
          <Image
            src={
              !!article.primaryImageUrl && article.primaryImageUrl !== ""
                ? article?.primaryImageUrl
                : "/preview/sample_locker.webp"
            }
            alt={article.articleName}
            width={250}
            height={250}
            className={styles.image}
          />
        </div>
        <div className={styles.colorPanel}>
          <h5 className={styles.heading}>{transText?.color}</h5>
          <ArticleColorPanel
            colorList={article.colors}
            setSelectedColorId={setSelectedColorId}
            selectedColorId={selectedColorId}
          />
        </div>
      </div>
      <div className={styles.detailWrapper}>
        <div className={styles.detailContent}>
          <h3 className={styles.heading}>
            {article?.customArticleName ? article?.customArticleName : article?.articleName}
          </h3>
          <p className={styles.price}>
            {article?.currency?.symbol ?? "€"} {euPriceFormat(article?.price)}
          </p>
          <div className={styles.details}>
            <p>
              {article?.customFullDescription
                ? article?.customFullDescription
                : article?.descriptionFull
                  ? article?.descriptionFull
                  : ""}
            </p>
          </div>
        </div>
        <div className={styles.totalWrapper}>
          <div className={styles.total}>
            <div className={styles.priceWrapper}>
              <div className={styles.discountWrapper}>
                {!!discountStatus && (
                  <>
                    <span>{transText?.discount}</span>
                    <div className={styles.discountInputWrapper}>
                      <Controller
                        control={control}
                        name="discount"
                        render={({ field: { value = "", onChange } }) => {
                          return (
                            <TextInput
                              name="discount"
                              type="number"
                              className={styles.discountInput}
                              value={value}
                              onChange={(e) => {
                                onChange(e);
                                if (e.target.value.length > 0) {
                                  const remain = (article?.price ?? 0) * (1 - Number(e.target.value) / 100);
                                  setTotalPrice(remain);
                                } else {
                                  setTotalPrice(article?.price ?? 0);
                                }
                              }}
                            />
                          );
                        }}
                      />
                      <span>%</span>
                    </div>
                  </>
                )}
              </div>
              <span className={styles.price}>
                {article?.currency?.symbol ?? "€"} {euPriceFormat(totalPrice)}
              </span>
            </div>
            <div className={styles.actionWrapper}>
              <QuantityInput label={transText?.quantity} value={quantity} setValue={setQuantity} minimumValue={1} />
              <Button
                label={transText?.addToProject}
                icon="ShoppingBag"
                isPrefix
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ArticleDetailModule;
