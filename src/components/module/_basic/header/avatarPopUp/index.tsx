"use client";
import React, { useState, useEffect } from "react";

import Dropdown from "../../../../ui/dropdown";
import Icon from "../../../../ui/Icon";
import { logout } from "../../../../../app/actions/auth";
import { useRouter } from "nextjs-toploader/app";

import styles from "./style.module.scss";

type PanelProps = {
  transText?: { [key: string]: string };
};

type Props = {
  transText?: { [key: string]: string };
};

const PopupPanel: React.FC<PanelProps> = ({ transText }) => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only access localStorage after component mounts on client
    setUserEmail(localStorage.getItem("email") || "");
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    if (typeof window !== "undefined") localStorage.clear();
    router.push("/en/auth/login");
  };

  return (
    <div className={styles.popUp}>
      <div className={styles.greenPanel}>
        <div className={styles.avatar}>
          <Icon name="User" className={styles.icon} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.userNameWrapper}>
          {/* Only render email after component has mounted */}
          <span>{mounted ? userEmail : ""}</span>
        </div>
        <button className={styles.logoutWrapper} onClick={handleLogout}>
          <span>{transText?.logout}</span>
        </button>
      </div>
    </div>
  );
};

const AvatarPopUp: React.FC<Props> = ({ transText }) => {
  return (
    <Dropdown options={[]} panel={<PopupPanel transText={transText} />}>
      <div className={styles.actionButton}>
        <Icon name="User" className={styles.icon} />
      </div>
    </Dropdown>
  );
};

export default AvatarPopUp;
