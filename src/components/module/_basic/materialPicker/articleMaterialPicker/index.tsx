import React from "react";
import Image from "next/image";
import classNames from "classnames";

import styles from "./style.module.scss";
type MaterialItem = {
  textureUrl: string;
};
type Props = {
  materials: MaterialItem[];

  activeMaterials?: string[];
  // eslint-disable-next-line no-unused-vars
  onChange: (val: string) => void;
};

const ArticleMaterialPicker: React.FC<Props> = ({ materials, activeMaterials = [], onChange }) => {
  return (
    <div className={styles.wrapper}>
      {materials?.map((mat, index) => (
        <button
          type="button"
          key={index}
          className={classNames(styles.button, {
            [styles.active]: activeMaterials?.includes(mat.textureUrl),
          })}
          onClick={() => onChange(mat.textureUrl)}
        >
          <Image
            src={mat.textureUrl}
            alt={`Material-${mat.textureUrl}`}
            fill
            sizes="(60px, 60px)"
            className={styles.image}
          />
        </button>
      ))}
    </div>
  );
};

export default ArticleMaterialPicker;
