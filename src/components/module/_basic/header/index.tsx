import Image from "next/image";
import { useTranslations } from "next-intl";

import AppContainer from "../container";
import LanguageSelector from "./languageSelector";
import AvatarPopUp from "./avatarPopUp";
import { Link } from "../../../../navigation";

import styles from "./style.module.scss";

const PageHeader = () => {
  const t = useTranslations();

  return (
    <header className={styles.wrapper}>
      <AppContainer className={styles.content}>
        <Link href="/" className={styles.imageWrapper}>
          <Image src="/logo.webp" alt="Logo" width={75} height={38} priority />
        </Link>
        <div className={styles.actions}>
          <LanguageSelector
            transText={{
              language: t("Language"),
            }}
          />
          <AvatarPopUp
            transText={{
              logout: t("Logout"),
            }}
          />
        </div>
      </AppContainer>
    </header>
  );
};

export default PageHeader;
