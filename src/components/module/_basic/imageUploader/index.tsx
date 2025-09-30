import React, { useRef, useState } from "react";
import Image from "next/image";

import Button from "../../../ui/button";

import styles from "./style.module.scss";

type Props = {
  file: File | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  transText?: { [key: string]: string };
};

const ImageUploader: React.FC<Props> = ({ file, setFile, transText }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const maxFileSize = 2 * 1024 * 1024;
    const allowedTypes = ["image/png", "image/jpeg"];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setError("Only PNG and JPEG files are allowed.");
        return;
      }

      if (file.size > maxFileSize) {
        setError("File size must be less than 2MB.");
        return;
      }

      setFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);

      setError(null);
      console.log("File uploaded successfully:", file);
    }
  };

  const onDownload = () => {
    if (imageSrc) {
      const link = document.createElement("a");
      link.href = imageSrc as string;
      link.download = file?.name || "downloaded-image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const onDelete = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }

    setImageSrc(null);
    setError(null);
    setFile(undefined);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <input type="file" className={styles.input} ref={fileInputRef} onChange={handleFileChange} />
        <Button
          type="button"
          label={transText?.uploadFile ?? ""}
          className={styles.button}
          onClick={() => fileInputRef.current?.click()}
        />
        <label className={styles.label}>{`(${transText?.maximumFileSize}: 2MB)`}</label>
        <label className={styles.error}>{error}</label>
      </div>
      {imageSrc && <Image src={imageSrc as string} fill alt="File" className={styles.image} />}
      <div className={styles.actions}>
        <Button type="button" icon="Download" onClick={onDownload} />
        <Button type="button" icon="Trash" color="danger" onClick={onDelete} />
      </div>
    </div>
  );
};

export default ImageUploader;
