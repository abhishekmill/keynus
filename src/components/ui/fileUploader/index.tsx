import React, { useRef } from "react";
import classNames from "classnames";

import UploadToCloud from "@/assets/image/uploadToCloud.svg";
import Button from "../button";

import styles from "./style.module.scss";

type Props = {
  className?: string;
};

const FileUploader: React.FC<Props> = ({ className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.content}>
        <UploadToCloud width={80} height={70} />
        <Button type="button" label="Upload" className={styles.button} onClick={() => fileInputRef.current?.click()} />
        <input
          type="file"
          className={styles.input}
          ref={fileInputRef}
          onChange={(e) => {
            console.log(e);
          }}
        />
      </div>
    </div>
  );
};

export default FileUploader;
