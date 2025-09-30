"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

import AppContainer from "../../../_basic/container";
import Button from "../../../../ui/button";
import PDFDataFillModal from "../pdfDataFillModal";
import TextInput from "../../../../ui/textInput";
import callServerAction from "../../../../../utils/callServerAction";
import useDebounce from "../../../../../utils/hooks/useDebounce";
import { ICurrency, ILockerwall, IPdfFileData, IProjectTemplateList } from "../../../../../utils/types";
import { euPriceFormat } from "../../../../../utils/functions";
import {
  getDocumentTemplateList,
  handleDownloadPDF,
  handleSendPDF,
  updateProjectPercent,
} from "../../../../../app/actions/projects";
import { projectSelector } from "../../../../../store/app";
import { useAppSelector } from "../../../../../utils/hooks/store";

import styles from "./style.module.scss";

type Props = {
  id: string;
  transText: { [key: string]: string };
  lockerData: ILockerwall[];
  currency?: ICurrency;
  discountPercentage: number;
  vatPercentage: number;
  pdfFillData: IPdfFileData;
  keyniusPIMTemplateDocumentId: string;
};

const ProjectQuote: React.FC<Props> = ({
  id,
  transText,
  currency,
  pdfFillData,
  discountPercentage,
  vatPercentage,
  keyniusPIMTemplateDocumentId,
}) => {
  const params = useParams();
  const { articlePrice, lockerWallPrice } = useAppSelector((state) => state.project);
  const { discountStatus } = useAppSelector(projectSelector);
  const dummyProjectQuoteData: { [key: string]: string } = {
    [transText.lockerWalls]: lockerWallPrice?.toFixed(2),
    [transText.articles]: articlePrice?.toFixed(2),
  };

  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountPrice, setDiscountPrice] = useState<string>("0");
  const [vatDiscount, setVatDiscount] = useState(0);
  const [emails, setEmails] = useState("");
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [pdfModelIsOpen, setPdfModelIsOpen] = useState(false);
  const [templateList, setTemplateList] = useState<IProjectTemplateList[]>([]);
  const [templateLoading, setTemplateLoading] = useState(false);

  const initialRender = useRef(true);
  const initialVatRender = useRef(true);
  const discountPercentDebounce = useDebounce(discountPercent.toString(), 500);
  const vatPercentDebounce = useDebounce(vatDiscount.toString(), 500);
  const subtotal = useMemo(() => lockerWallPrice + articlePrice, [lockerWallPrice, articlePrice]);
  const totalPrice = useMemo(
    () => Number((subtotal - Number(discountPrice.replace(/\./g, "").replace(",", "."))).toFixed(2)),
    [subtotal, discountPrice],
  );
  const vatValue = useMemo(() => (totalPrice / 100) * vatDiscount, [subtotal, vatDiscount]);

  const updatePercent = async (type: "discount" | "vat") => {
    try {
      await callServerAction(updateProjectPercent, {
        ...(type === "discount" ? { discountPercentage: discountPercent } : { vatPercentage: vatDiscount }),
        id: id,
      });
      toast.success("Discount updated successfully");
    } catch (error) {
      toast.error(error?.errors?.[0] ?? "Something went wrong");
    }
  };

  const onDownloadPDF = async () => {
    try {
      setIsLoadingDownload(true);
      const res = await handleDownloadPDF(id, (params?.locale as "en" | "nl") ?? "en");

      if (res.isSuccess) {
        const byteCharacters = atob(res.data.blob);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(offset, offset + 1024);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }

        const blob = new Blob(byteArrays, { type: "application/pdf" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = res.data.fileName;
        link.click();
        document.body.removeChild(link);
      } else {
        throw Error("Failed to download");
      }

      setIsLoadingDownload(false);
    } catch (error) {
      setIsLoadingDownload(false);
    }
  };

  const onSendPDF = async () => {
    if (emails) {
      try {
        setIsLoadingSend(true);
        const res = await handleSendPDF(id, emails, (params?.locale as "en" | "nl") ?? "en");
        if (res.isSuccess) {
          toast.success("Email is sent successfully");
        } else {
          throw Error("Failed");
        }
        setIsLoadingSend(false);
      } catch (error) {
        toast.error("Failed to send email");
        setIsLoadingSend(false);
      }
    }
  };

  const getTemplateList = async () => {
    setTemplateLoading(true);
    try {
      const res = await callServerAction(getDocumentTemplateList, id);
      setTemplateList(res?.result);
    } catch (error: any) {
      console.log("template list error", error);
      toast.error(error?.errors?.[0] ?? "Something went wrong");
    }
    setTemplateLoading(false);
  };

  useEffect(() => {
    if (!!initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (discountPercentage !== discountPercent) updatePercent("discount");
  }, [discountPercentDebounce]);

  useEffect(() => {
    if (!!initialVatRender.current) {
      initialVatRender.current = false;
      return;
    }
    if (vatPercentage !== vatDiscount) updatePercent("vat");
  }, [vatPercentDebounce]);

  useEffect(() => {
    setDiscountPercent(discountPercentage);
    setVatDiscount(vatPercentage);
  }, [discountPercentage, vatPercentage]);

  useEffect(() => {
    setDiscountPrice(euPriceFormat((subtotal * discountPercentage) / 100));
  }, [subtotal, discountPercentage]);

  useEffect(() => {
    getTemplateList();
  }, []);

  return (
    <div className={styles.wrapper}>
      <AppContainer>
        <div className={styles.valuesList}>
          <div className={styles.list}>
            {Object.keys(dummyProjectQuoteData).map((key) => (
              <div key={key} className={styles.quoteItem}>
                <div className={styles.label}>{key}</div>
                <div className={styles.value}>
                  {currency?.symbol ?? "€"} {euPriceFormat(dummyProjectQuoteData?.[key] ?? 0)}
                </div>
              </div>
            ))}
            <div className={styles.divider}></div>
            <div className={styles.subTotal}>
              <p className={styles.label}>{transText?.subtotal}</p>
              <p className={styles.value}>
                {currency?.symbol ?? "€"} {euPriceFormat(subtotal)}
              </p>
            </div>
            {!!discountStatus && (
              <>
                <div className={styles.divider}></div>
                <div className={styles.discountContent}>
                  <p className={styles.label}>{transText?.discount}</p>
                  <div className={styles.discountInputWrapper}>
                    <TextInput
                      name="discount"
                      className={styles.discountInput}
                      type="text"
                      value={discountPercent}
                      onChange={(e: any) => {
                        const newValue = e.target.value;
                        if (+newValue <= 100 && +newValue >= 0) {
                          setDiscountPercent(Number(newValue));
                          setDiscountPrice(euPriceFormat(subtotal * (newValue / 100)));
                        }
                      }}
                    />{" "}
                    %
                  </div>
                  <TextInput
                    name="discountPrice"
                    className={styles.discountPrice}
                    symbol={currency?.symbol ?? "€"}
                    symbolPosition="before"
                    type="text"
                    value={discountPrice}
                    onBlur={(e: any) => {
                      setDiscountPrice(euPriceFormat(e.target.value.replace(/\./g, "").replace(",", ".")));
                    }}
                    onChange={(e: any) => {
                      const newValue = e.target.value.replace(/\./g, "").replace(",", ".");
                      if (!isNaN(newValue) && newValue.trim() !== "" && +newValue <= subtotal && +newValue >= 0) {
                        setDiscountPrice(e.target.value);
                        setDiscountPercent(Number(((newValue * 100) / subtotal).toFixed(2)));
                      }
                    }}
                  />
                </div>
              </>
            )}
            <div className={styles.divider}></div>
            <div className={styles.totalContent}>
              <p>{transText?.total}</p>
              <TextInput
                name="total"
                type="text"
                className={styles.totalInput}
                symbol={currency?.symbol ?? "€"}
                symbolPosition="before"
                value={euPriceFormat(totalPrice)}
                readOnly
              />
            </div>
            <div className={styles.divider}></div>
            <div className={styles.vatContent}>
              <p className={styles.label}>{transText?.vat}</p>
              {!!discountStatus && (
                <div className={styles.discountInputWrapper}>
                  <TextInput
                    name="vat"
                    className={styles.discountInput}
                    type="number"
                    value={vatDiscount}
                    onChange={(e: any) => {
                      setVatDiscount(e.target.value);
                    }}
                  />{" "}
                  %
                </div>
              )}
              <p className={styles.subVatPrice}>{euPriceFormat(vatValue)}</p>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.totalPriceContent}>
              <div>{transText?.totalVat}</div>
              <div className={styles.value}>{euPriceFormat(totalPrice + vatValue)}</div>
            </div>
          </div>
        </div>

        <div className={styles.sendQuote}>
          <TextInput name="email" label={transText?.email} onChange={(e) => setEmails(e.target.value)} />
          <div className={styles.buttonWrap}>
            <Button icon="Download" isLoading={isLoadingDownload} onClick={onDownloadPDF} className={styles.button} />
            <div className={styles.sentWrapper}>
              <Button label={transText?.fillInFields ?? ""} onClick={() => setPdfModelIsOpen(true)} />
              {!!pdfModelIsOpen && (
                <PDFDataFillModal
                  id={id}
                  keyniusPIMTemplateDocumentId={keyniusPIMTemplateDocumentId}
                  templateList={templateList}
                  templateLoading={templateLoading}
                  pdfFillData={pdfFillData}
                  isOpen={pdfModelIsOpen}
                  setIsOpen={setPdfModelIsOpen}
                  transText={transText}
                />
              )}
              <div className={styles.line}></div>
              <Button
                label={transText?.send}
                className={styles.button}
                disabled={!emails}
                isLoading={isLoadingSend}
                onClick={onSendPDF}
              />
            </div>
          </div>
        </div>
      </AppContainer>
    </div>
  );
};

export default ProjectQuote;
