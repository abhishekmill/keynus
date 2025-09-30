"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

import AppConfirmModal from "../../../../_basic/confirmModal";
import Icon from "../../../../../ui/Icon";
import TextInput from "../../../../../ui/textInput";
import callServerAction from "@/utils/callServerAction";
import useDebounce from "@/utils/hooks/useDebounce";
import {
  deleteNumberingArticleToProject,
  deleteShopArticleToProject,
  saveProjectLockerwallPricing,
  updateArticle,
} from "@/app/actions/article";
import { useRouter } from "../../../../../../navigation";
import { IArticleNote, ICurrency } from "../../../../../../utils/types";
import { euPriceFormat } from "../../../../../../utils/functions";
import { useAppSelector } from "../../../../../../utils/hooks/store";
import { projectSelector } from "../../../../../../store/app";
import { revalidatePath } from "../../../../../../utils/cookie";
import { usePathname } from "next/navigation";

import styles from "./style.module.scss";

type Props = {
  id: string;
  lockerwallId?: string;
  articleId?: string;
  article: string;
  articleType?: string;
  pricePerUnit: number;
  netPricerPerUnit: number;
  discount: number;
  quantity?: number;
  transText?: { [key: string]: string };
  color?: string;
  currency?: ICurrency;
  type: "lockerwallArticle" | "article";
  note: string;
  isNumberingArticle?: boolean;
  setSelectedArticle: React.Dispatch<React.SetStateAction<IArticleNote | undefined>>;
};

const ProjectArticleItem: React.FC<Props> = ({
  id,
  lockerwallId,
  articleId,
  article,
  articleType,
  pricePerUnit,
  netPricerPerUnit,
  quantity = 0,
  discount,
  transText,
  color,
  currency,
  type,
  note,
  isNumberingArticle = false,
  setSelectedArticle,
}) => {
  const router = useRouter();
  const { discountStatus } = useAppSelector(projectSelector);
  const pathName = usePathname();

  const [netPrice, setNetPrice] = useState<string>(euPriceFormat(netPricerPerUnit || 0));
  const [perDiscount, setPerDiscount] = useState((discount || 0).toString());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const updatable = useRef<boolean>(false);
  const discountDebounce = useDebounce(perDiscount.toString(), 500);
  const priceDebounce = useDebounce(netPrice.toString(), 500);

  // Helper function to safely parse numbers and avoid NaN
  const safeParseNumber = (value: string | number, fallback: number = 0): number => {
    const parsed = typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;
    return isNaN(parsed) ? fallback : parsed;
  };

  // Helper function to clamp discount between 0 and 99
  const clampDiscount = (discountValue: number): number => {
    return Math.max(0, Math.min(99, discountValue));
  };

  // Helper function to calculate net price from discount
  const calculateNetPriceFromDiscount = (price: number, discountPercent: number): number => {
    const safePrice = safeParseNumber(price, 0);
    const clampedDiscount = clampDiscount(safeParseNumber(discountPercent, 0));
    return safePrice * (1 - clampedDiscount / 100);
  };

  // Helper function to calculate discount from net price
  const calculateDiscountFromNetPrice = (originalPrice: number, netPriceValue: number): number => {
    const safeOriginalPrice = safeParseNumber(originalPrice, 0);
    const safeNetPrice = safeParseNumber(netPriceValue, 0);

    if (safeOriginalPrice <= 0) return 0;

    // Ensure net price cannot be higher than original price (negative discount)
    if (safeNetPrice >= safeOriginalPrice) return 0;

    const calculatedDiscount = ((safeOriginalPrice - safeNetPrice) * 100) / safeOriginalPrice;
    return clampDiscount(calculatedDiscount);
  };

  // Calculate subtotal
  const calculateSubTotal = (): number => {
    const currentDiscount = clampDiscount(safeParseNumber(perDiscount, 0));
    const currentQuantity = safeParseNumber(quantity, 0);

    if (pricePerUnit === 0 || pricePerUnit === null || pricePerUnit === undefined) {
      // If original price is 0, use the current net price value
      const currentNetPriceValue = safeParseNumber(netPrice, 0);
      return currentNetPriceValue * currentQuantity;
    } else {
      // If original price exists, apply discount to original price
      const originalPrice = safeParseNumber(pricePerUnit, 0);
      return originalPrice * (1 - currentDiscount / 100) * currentQuantity;
    }
  };

  const onRemoveArticle = async () => {
    if (!id) return;
    setDeleteLoading(true);
    try {
      if (!!isNumberingArticle) {
        await callServerAction(deleteNumberingArticleToProject, {
          keyniusProjectLockerwallId: lockerwallId,
          keyniusPIMArticleId: articleId,
        });
        revalidatePath(pathName);
      } else {
        await callServerAction(deleteShopArticleToProject, id);
      }
      toast.success("The article deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.error ?? error?.errors?.[0] ?? "Something went wrong");
    }
    setDeleteLoading(false);
  };

  const onUpdateFunction = async () => {
    try {
      const safeDiscount = clampDiscount(safeParseNumber(perDiscount, 0));
      const currentNetPrice = safeParseNumber(netPrice, 0);

      if (type === "lockerwallArticle") {
        const res = await callServerAction(saveProjectLockerwallPricing, {
          keyniusProjectLockerwallId: lockerwallId ?? "0",
          articles: [
            {
              id: id,
              articleType: articleType,
              pricePerUnit: pricePerUnit,
              discount: safeDiscount.toString(),
            },
          ],
        });
        console.log("res", res);
        revalidatePath(`${pathName}`);
      } else {
        const updatedRes = await callServerAction(updateArticle, {
          id: id,
          quantity: quantity,
          discount: safeDiscount.toString(),
          netPricePerUnit: currentNetPrice,
        });

        console.log("updatedRes", updatedRes);
        revalidatePath(`${pathName}`);
      }

      toast.success("The article updated successfully");
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.error ?? error?.errors?.[0] ?? "Something went wrong");
    }
  };

  useEffect(() => {
    if (!!updatable.current) {
      updatable.current = false;
      onUpdateFunction();
    }
  }, [discountDebounce, priceDebounce]);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.article}
        role="button"
        onClick={() => {
          setSelectedArticle({
            id: articleId ?? "",
            addOnType: articleType,
            articleType: articleType,
            lockerWallId: lockerwallId,
            notes: note,
            name: article,
          });
        }}
      >
        {article}
        {note?.length > 0 && <Icon name="Filter" className={styles.noted} />}
      </div>
      <div className={styles.color}>
        {color && <Image src={color} alt="color" width={40} height={25} className="aspect-video rounded-md" />}
      </div>
      <div className={styles.amount}>{quantity}</div>
      <p className={styles.price}>
        {currency?.symbol ?? "€"} {euPriceFormat(pricePerUnit || 0)}
      </p>
      <div className={styles.discount}>
        {!!discountStatus && (
          <TextInput
            type="text"
            name="discount"
            symbol="%"
            symbolPosition="after"
            value={perDiscount}
            onChange={(e) => {
              const inputValue = e.target.value;

              // Allow empty input
              if (inputValue === "") {
                setPerDiscount("");
                return;
              }

              const newValue = safeParseNumber(inputValue, 0);
              const clampedValue = clampDiscount(newValue);

              // Only update if the value is within valid range
              if (newValue >= 0 && newValue <= 99) {
                updatable.current = true;
                setPerDiscount(newValue.toString());
                const newNetPrice = calculateNetPriceFromDiscount(pricePerUnit || 0, clampedValue);
                setNetPrice(euPriceFormat(newNetPrice));
              }
            }}
            onBlur={(e) => {
              const value = safeParseNumber(e.target.value, 0);
              const clampedValue = clampDiscount(value);
              setPerDiscount(clampedValue.toFixed(2));
            }}
            className={styles.input}
          />
        )}
      </div>
      <div className={styles.netPrice}>
        <TextInput
          type="text"
          name="netPrice"
          className={styles.input}
          symbol={currency?.symbol ?? "€"}
          symbolPosition="before"
          value={netPrice}
          disabled={!discountStatus}
          onBlur={(e: any) => {
            const value = safeParseNumber(e.target.value, 0);

            // Prevent net price from being 0 or negative
            if (value <= 0) {
              // Reset to a minimum value (0.01) or original net price
              const minValue = 0.01;
              setNetPrice(euPriceFormat(minValue));

              // Recalculate discount based on minimum value
              if (pricePerUnit > 0) {
                const newDiscount = calculateDiscountFromNetPrice(pricePerUnit, minValue);
                setPerDiscount(newDiscount.toFixed(2));
              }
            } else {
              setNetPrice(euPriceFormat(value));
            }
          }}
          onChange={(e: any) => {
            const inputValue = e.target.value.replace(",", ".");

            // Allow empty input
            if (inputValue === "") {
              setNetPrice("");
              return;
            }

            const newValue = safeParseNumber(inputValue, 0);

            // Prevent net price from being 0 (which would be 100% discount)
            if (newValue <= 0) {
              return; // Don't allow 0 or negative values
            }

            if (newValue > 0) {
              updatable.current = true;
              setNetPrice(inputValue);

              // Calculate discount only if original price exists and is greater than 0
              if (pricePerUnit > 0) {
                // Prevent net price from being higher than original price
                const maxNetPrice = safeParseNumber(pricePerUnit, 0);
                const clampedNetPrice = Math.min(newValue, maxNetPrice);

                if (newValue > maxNetPrice) {
                  setNetPrice(euPriceFormat(maxNetPrice));
                  setPerDiscount("0.00");
                } else {
                  const newDiscount = calculateDiscountFromNetPrice(pricePerUnit, clampedNetPrice);
                  setPerDiscount(newDiscount.toFixed(2));
                }
              }
            }
          }}
        />
      </div>
      <div className={styles.subTotal}>
        {currency?.symbol ?? "€"} {euPriceFormat(calculateSubTotal())}
      </div>
      {(type !== "lockerwallArticle" || isNumberingArticle) && (
        <button className={styles.trash} type="button" onClick={() => setShowDeleteModal(true)}>
          <Icon name="Trash" className={styles.icon} />
        </button>
      )}
      <AppConfirmModal
        title={transText?.deleteArticleQuestionTitle}
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        onOk={() => {
          onRemoveArticle();
        }}
        confirmLoading={deleteLoading}
        transText={transText}
      />
    </div>
  );
};

export default ProjectArticleItem;
