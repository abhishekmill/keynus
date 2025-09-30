"use client";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { FieldValues, useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { Bars } from "react-loader-spinner";

import AppModal from "../../../_basic/modal";
import Button from "../../../../ui/button";
import ImageUploader from "../../../_basic/imageUploader";
import TextArea from "../../../../ui/textarea";
import TextInput from "../../../../ui/textInput";
import { handleSavePDFCustomFields } from "../../../../../app/actions/projects";
import { toast } from "react-toastify";
import { IPdfFileData, IProjectTemplateList } from "../../../../../utils/types";
import { revalidatePath } from "../../../../../utils/cookie";

import styles from "./style.module.scss";

type Props = {
  id: string;
  templateList: IProjectTemplateList[];
  templateLoading: boolean;
  pdfFillData: IPdfFileData;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  keyniusPIMTemplateDocumentId: string;
  transText?: { [key: string]: string };
};

const PDFDataFillModal: React.FC<Props> = ({
  id,
  templateList,
  templateLoading,
  pdfFillData,
  isOpen,
  setIsOpen,
  transText,
  keyniusPIMTemplateDocumentId,
}) => {
  const pathName = usePathname();
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: FieldValues) => {
    try {
      const formData = new FormData();
      if (selectedTemplateId === "") {
        toast.warning("You should select document template.");
        return;
      } else {
        formData.append("keyniusPIMTemplateDocumentId", selectedTemplateId);
      }
      setLoading(true);

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (file) {
        formData.append("image1_1", file);
      }

      const res = await handleSavePDFCustomFields(id, formData);
      if (res.isSuccess) {
        revalidatePath(pathName);
        toast.success("Fields are saved!");
        setIsOpen(false);
      } else {
        throw Error("Failed to save");
      }
      setLoading(false);
    } catch (error) {
      console.log("error: ", error);
      setLoading(false);
      toast.error("Failed to save");
    }
  };

  useEffect(() => {
    reset({
      header1: pdfFillData.header1,
      header2: pdfFillData.header2,
      paragraph1_1: pdfFillData.paragraph1_1,
      paragraph1_2: pdfFillData.paragraph1_2,
      paragraph1_3: pdfFillData.paragraph1_3,
      paragraph2_1: pdfFillData.paragraph2_1,
    });
    setSelectedTemplateId(pdfFillData?.templateId ?? "");
  }, [pdfFillData]);

  return (
    <div className={styles.wrapper}>
      <AppModal size="xl" isOpen={isOpen} setIsOpen={setIsOpen} hasClose>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <h2 className={styles.heading}>{transText?.selectTemplate}</h2>
          <div className={styles.templateList}>
            {!!templateLoading ? (
              <Bars
                height="20"
                width="80"
                color="green"
                ariaLabel="bars-loading"
                visible={true}
                wrapperClass={styles.spinner}
              />
            ) : (
              templateList.map((item, index) => (
                <div
                  key={index}
                  className={classNames(
                    styles.templateBox,
                    selectedTemplateId === item.id || keyniusPIMTemplateDocumentId === item.id ? styles.activeBox : "",
                  )}
                  role="button"
                  onClick={() => {
                    setSelectedTemplateId(item.id);
                  }}
                >
                  <p>{item.name}</p>
                </div>
              ))
            )}
          </div>

          <h2 className={styles.heading}>{transText?.fillInFields}</h2>
          <p className={styles.desc}>{transText?.fillInFieldsDescription}</p>
          <div className={styles.pageWrapper}>
            <div className={styles.page}>
              <h2 className={styles.pageHeading}>{transText?.page} 1</h2>
              <div className={styles.formGroup}>
                <label className={styles.label}>{transText?.header} 1</label>
                <TextInput
                  name="header1"
                  register={register}
                  label={`${transText?.header} 1`}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>{transText?.paragraph} 1</label>
                <TextArea name="paragraph1_1" register={register} label={`${transText?.paragraph} 1`} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>{transText?.paragraph} 2</label>
                <TextArea name="paragraph1_2" register={register} label={`${transText?.paragraph} 2`} />
              </div>
              <div className={styles.formGroup}>
                <ImageUploader file={file} setFile={setFile} transText={transText} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>{transText?.paragraph} 3</label>
                <TextArea name="paragraph1_3" register={register} label={`${transText?.paragraph} 3`} />
              </div>
            </div>
            <div className={styles.page}>
              <h2 className={styles.pageHeading}>{transText?.page} 2</h2>
              <div className={styles.formGroup}>
                <label className={styles.label}>{transText?.header} 1</label>
                <TextInput
                  name="header2"
                  register={register}
                  label={`${transText?.header} 1`}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>{transText?.paragraph} 1</label>
                <TextArea name="paragraph2_1" register={register} label={`${transText?.paragraph} 1`} />
              </div>
            </div>
          </div>
          <div className={styles.submit}>
            <Button isLoading={loading} label={transText?.saveFields ?? ""} />
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default PDFDataFillModal;
