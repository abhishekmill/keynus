"use client";
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useProgress } from "@react-three/drei";

const ProgressBar = dynamic(() => import("../../../ui/progressBar"), { ssr: false });

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
};
const LoadingScreen: React.FC<Props> = ({ transText }) => {
  const { progress } = useProgress();

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <Image src="/logo_black_middle.webp" alt="Logo" className={styles.loader} width={225} height={100} priority />
        </div>
        <div className={styles.message}>
          <span>{transText?.startConfiguration}</span>
        </div>
        <div className={styles.progressBar}>
          <ProgressBar percent={progress ?? 0} />{" "}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
