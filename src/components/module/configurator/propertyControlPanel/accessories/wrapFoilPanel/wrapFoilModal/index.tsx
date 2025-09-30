import React from "react";
import TextArea from "../../../../../../ui/textarea";

import styles from "./style.module.scss";
import Button from "../../../../../../ui/button";
import FileUploader from "../../../../../../ui/fileUploader";

const WrapFoilModalContent = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Foil/wrap</h2>
      <FileUploader className={styles.uploader} />
      <div className={styles.description}>
        <span>Any notes on this foil/wrap</span>
      </div>
      <TextArea name="notes" label="Foil/wrap notes" />
      <div className={styles.actionWrapper}>
        <div>
          <p>price</p>
          <h2 className={styles.price}>€ 123.4512</h2>
        </div>
        <Button label="Add foil/wrap" />
      </div>
    </div>
  );
};

export default WrapFoilModalContent;
