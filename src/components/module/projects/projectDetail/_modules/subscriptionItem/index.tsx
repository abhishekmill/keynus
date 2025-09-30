"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import AppConfirmModal from "../../../../_basic/confirmModal";
import Icon from "../../../../../ui/Icon";
import Selector, { TOption } from "../../../../../ui/selector";
import TextInput from "../../../../../ui/textInput";
import callServerAction from "@/utils/callServerAction";
import useDebounce from "@/utils/hooks/useDebounce";
import { ICurrency, ISubscription, ISubscriptionArticle } from "@/utils/types";
import { saveSubscription } from "@/app/actions/projects";
import { euPriceFormat } from "../../../../../../utils/functions";
import { useAppSelector } from "../../../../../../utils/hooks/store";
import { projectSelector } from "../../../../../../store/app";

import styles from "./style.module.scss";

type Props = {
  projectId: string;
  lockerNum: number;
  subscriptionArticleList: ISubscriptionArticle[];
  subscription?: ISubscription;
  subscriptionList: ISubscription[];
  setAddable: React.Dispatch<React.SetStateAction<boolean>>;
  setSubScriptionList: React.Dispatch<React.SetStateAction<ISubscription[]>>;
  transText?: { [key: string]: string };
  currency?: ICurrency;
};

const ProjectSubscriptionItem: React.FC<Props> = ({
  projectId,
  subscription,
  subscriptionList,
  subscriptionArticleList = [],
  transText,
  lockerNum,
  setAddable = () => {},
  setSubScriptionList = () => {},
  currency,
}) => {
  const { discountStatus } = useAppSelector(projectSelector);
  const [paymentList, setPaymentList] = useState<TOption[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [article, setArticle] = useState<TOption>({ label: "Select an option", value: "" });
  const [subscriptionCycle, setSubscriptionCycle] = useState<TOption>({ label: "Payment term", value: "" });
  const [pricePerLocker, setPricePerLocker] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [netPriceInput, setNetPriceInput] = useState("");
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Create a more specific debounce key that includes price
  const updateDebounce = useDebounce(`${discount}-${article.value}-${subscriptionCycle.value}-${pricePerLocker}`, 800);

  // Helper function to safely parse numbers and avoid NaN
  const safeParseNumber = (value: string | number, fallback: number = 0): number => {
    const parsed = typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;
    return isNaN(parsed) ? fallback : parsed;
  };

  // Helper function to clamp discount between 0 and 99
  const clampDiscount = (discountValue: number): number => {
    return Math.max(0, Math.min(99, discountValue));
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

  // Calculate net price based on discount and original price
  const calculateNetPrice = (): number => {
    const clampedDiscount = clampDiscount(discount);
    return (1 - clampedDiscount / 100) * pricePerLocker;
  };

  // Calculate total for this subscription line
  const calculateLineTotal = (): number => {
    const netPrice = calculateNetPrice();
    return netPrice * lockerNum;
  };

  const onSave = async (updatedData: ISubscription[]) => {
    try {
      setLoading(true);
      const res = await callServerAction(saveSubscription, {
        keyniusProjectId: projectId,
        subscriptions: updatedData.map((item) => ({
          keyniusPIMArticleId: item.article,
          quantity: item.lockers ?? lockerNum,
          pricePerUnit: item.pricePerLocker,
          discount: clampDiscount(item.discount),
          subscriptionCycle: item.subscriptionCycle,
        })),
      });

      const newSubscriptions = res.result.map((item: any) => ({
        id: item.id,
        article: item.keyniusPIMArticleId,
        articleName: item.keyniusPIMArticle?.articleName,
        discount: clampDiscount(item.discount),
        lockers: item.quantity,
        pricePerLocker: item.pricePerUnit,
        subscriptionCycle: item.subscriptionCycle,
      }));

      setSubScriptionList(newSubscriptions);
      setHasChanges(false);
      toast.success("Subscription updated successfully.");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to update.");
    } finally {
      setLoading(false);
      setAddable(false);
    }
  };

  const addPaymentList = (selectedArticle: string) => {
    const selectedArticleData = subscriptionArticleList.find((item) => item.id === selectedArticle);
    const paymentArray = selectedArticleData?.articleSubscriptionResult
      ?.sort((a, b) => a.price - b.price)
      .map((row) => ({ label: row.cycle, value: row.cycle }));

    if (paymentArray && paymentArray.length > 0) {
      setPaymentList(paymentArray);
      // Only auto-select if no current selection or if article changed
      if (!subscriptionCycle.value || selectedArticle !== article.value) {
        setSubscriptionCycle({ label: paymentArray[0].label, value: paymentArray[0].value });
      }
    } else {
      setPaymentList([]);
      setSubscriptionCycle({ label: "Payment term", value: "" });
    }
  };

  const handleDelete = async (id: string) => {
    const updatedList = subscriptionList.filter((item) => item.id !== id);
    await onSave(updatedList);
  };

  const handleNetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (inputValue === "") {
      setNetPriceInput("");
      setIsManualEdit(true);
      return;
    }

    // Remove currency symbols and format for parsing
    const rawValue = inputValue.replace(/[^\d.,]/g, "").replace(",", ".");
    const parsed = safeParseNumber(rawValue, 0);

    // Prevent net price from being negative during typing
    if (parsed < 0) {
      return;
    }

    setIsManualEdit(true);
    setNetPriceInput(inputValue);
    setHasChanges(true);
  };

  const handleNetPriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const rawValue = inputValue.replace(/[^\d.,]/g, "").replace(",", ".");
    const parsed = safeParseNumber(rawValue, 0);

    if (pricePerLocker > 0) {
      // Prevent net price from being higher than original price
      const maxNetPrice = pricePerLocker;
      const clampedNetPrice = Math.min(Math.max(parsed, 0), maxNetPrice);

      const newDiscount = calculateDiscountFromNetPrice(pricePerLocker, clampedNetPrice);
      setDiscount(newDiscount);
      setNetPriceInput(`€ ${euPriceFormat(clampedNetPrice)}`);
      setHasChanges(true);
    } else {
      setNetPriceInput(`€ ${euPriceFormat(Math.max(parsed, 0))}`);
    }

    setIsManualEdit(false);
  };

  const handleNetPriceFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d.,]/g, "").replace(",", ".");
    if (rawValue) {
      setNetPriceInput(rawValue);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Allow empty input
    if (val === "") {
      setDiscount(0);
      setHasChanges(true);
      return;
    }

    const parsedDiscount = safeParseNumber(val, 0);

    // Only allow values between 0 and 99
    if (parsedDiscount >= 0 && parsedDiscount <= 99) {
      setDiscount(parsedDiscount);
      setHasChanges(true);
    }
  };

  const handleDiscountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const parsedDiscount = safeParseNumber(val, 0);
    const clampedDiscount = clampDiscount(parsedDiscount);
    setDiscount(clampedDiscount);
  };

  // Initialize component state from subscription data
  useEffect(() => {
    if (subscription) {
      setAddable(false);

      const paymentArray = subscriptionArticleList
        .find((item) => item.id === subscription.article)
        ?.articleSubscriptionResult?.sort((a, b) => a.price - b.price)
        .map((row) => ({ label: row.cycle, value: row.cycle }));

      setPaymentList(paymentArray ?? []);
      setDiscount(clampDiscount(subscription.discount));
      setPricePerLocker(subscription.pricePerLocker);
      setArticle({
        label: subscription.articleName ?? "",
        value: subscription.article,
      });

      if (subscription.subscriptionCycle) {
        setSubscriptionCycle({
          label: subscription.subscriptionCycle,
          value: subscription.subscriptionCycle,
        });
      }
    }
  }, [subscription, subscriptionArticleList]);

  // Update price when article or cycle changes
  useEffect(() => {
    if (article?.value && subscriptionCycle?.value) {
      const selectedArticle = subscriptionArticleList.find((item) => item.id === article.value);
      const lockerPrice =
        selectedArticle?.articleSubscriptionResult.find((row) => row.cycle === subscriptionCycle.value)?.price ?? 0;

      if (lockerPrice !== pricePerLocker) {
        setPricePerLocker(lockerPrice);
        setHasChanges(true);
      }
    }
  }, [article.value, subscriptionCycle.value, subscriptionArticleList]);

  // Save changes when debounce triggers and there are actual changes
  useEffect(() => {
    if (hasChanges && article?.value && subscriptionCycle?.value && pricePerLocker > 0) {
      const clampedDiscount = clampDiscount(discount);

      if (subscription) {
        // Update existing subscription
        const updatedList = subscriptionList.map((sub) =>
          sub.id === subscription.id
            ? {
                ...sub,
                article: `${article.value}`,
                articleName: article.label,
                lockers: lockerNum,
                pricePerLocker: pricePerLocker,
                discount: clampedDiscount,
                subscriptionCycle: `${subscriptionCycle.value}`,
              }
            : sub,
        );
        onSave(updatedList);
      } else {
        // Add new subscription
        const newSubscription = {
          article: `${article.value}`,
          articleName: article.label,
          lockers: lockerNum,
          pricePerLocker: pricePerLocker,
          discount: clampedDiscount,
          subscriptionCycle: `${subscriptionCycle.value}`,
        };
        onSave([...subscriptionList, newSubscription]);
      }
    }
  }, [updateDebounce]);

  // Update net price display when discount or price changes (but not during manual edit)
  useEffect(() => {
    if (!isManualEdit) {
      const calculatedNet = calculateNetPrice();
      setNetPriceInput(`€ ${euPriceFormat(calculatedNet)}`);
    }
  }, [pricePerLocker, discount, isManualEdit]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.article}>
        <Selector
          value={article}
          setValue={(val) => {
            setArticle(val);
            addPaymentList(val.value.toString());
            setHasChanges(true);
          }}
          options={subscriptionArticleList.map((item) => ({ label: item.articleName, value: item.id }))}
          className={styles.selector}
        />
        <Selector
          value={subscriptionCycle}
          setValue={(val) => {
            setSubscriptionCycle(val);
            setHasChanges(true);
          }}
          options={paymentList}
          className={styles.selector}
        />
      </div>
      <div className={styles.lockers}>{lockerNum}</div>
      <p className={styles.price}>{`${currency?.symbol ?? "€"} ${euPriceFormat(pricePerLocker)}`}</p>
      <div className={styles.discount}>
        {!!discountStatus && (
          <TextInput
            type="text"
            name="discount"
            symbol="%"
            symbolPosition="after"
            value={discount.toString()}
            onChange={handleDiscountChange}
            onBlur={handleDiscountBlur}
            className={styles.input}
          />
        )}
      </div>
      <input
        type="text"
        className={styles.input}
        value={netPriceInput}
        onChange={handleNetPriceChange}
        onBlur={handleNetPriceBlur}
        onFocus={handleNetPriceFocus}
        placeholder="€ 0.00"
        disabled={!discountStatus}
      />

      <div className={styles.subTotal}>{`${currency?.symbol ?? "€"} ${euPriceFormat(calculateLineTotal())}`}</div>
      <button
        className={styles.trash}
        type="button"
        onClick={() => {
          setShowDeleteModal(true);
        }}
      >
        <Icon name="Trash" className={styles.icon} />
      </button>
      <AppConfirmModal
        title={transText?.deleteSubscriptionQuestionTitle}
        isOpen={showDeleteModal}
        confirmLoading={loading}
        setIsOpen={setShowDeleteModal}
        onOk={async () => {
          if (subscription?.id) {
            await handleDelete(subscription.id);
          } else {
            setAddable(false);
          }
        }}
        transText={transText}
      />
    </div>
  );
};

export default ProjectSubscriptionItem;
