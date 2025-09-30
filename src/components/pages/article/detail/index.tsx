import React from "react";
import { useTranslations } from "next-intl";

import AppHeader from "../../../module/_basic/appHeader";
import ArticleDetailModule from "../../../module/article/articleDetailModule";
import ArticleTechnicalDetailModule from "../../../module/article/articleTechnicalDetailModule";
import PageContentLayout from "../../../layout/pageContentLayout";
import { IArticle } from "../../../../utils/types";

import styles from "./style.module.scss";

type Props = {
  articleData: IArticle;
  projectId: string;
  articleId: string;
  locale: string;
  projectName: string;
  fetchTimeInMs: number;
};

const ArticleDetailPage: React.FC<Props> = ({
  articleData,
  projectId,
  articleId,
  locale,
  projectName = "",
  fetchTimeInMs,
}) => {
  const t = useTranslations();

  return (
    <>
      <AppHeader
        heading={t("Article shop")}
        breadcrumb={[
          { label: t("Projects"), href: `/projects` },
          { label: projectName, href: `/projects/${projectId}` },
          { label: t("Article shop"), href: `/projects/${projectId}/articles` },
          { label: articleData?.articleName ?? "", href: `#` },
        ]}
        hasPrev
      />
      <PageContentLayout>
        <div className={styles.wrapper}>
          <ArticleDetailModule
            article={articleData}
            projectId={projectId}
            articleId={articleId}
            locale={locale}
            fetchTimeInMs={fetchTimeInMs}
            transText={{
              color: t("color"),
              discount: t("Discount"),
              quantity: t("Quantity"),
              addToProject: t("addToProject"),
            }}
          />
          <ArticleTechnicalDetailModule
            datasheetData={articleData.datasheets}
            certificateData={articleData.certificates}
            transText={{
              datasheet: t("Datasheet"),
              certificate: t("Certificate"),
              technicalDetails: t("Technical details"),
            }}
          />
        </div>
      </PageContentLayout>
    </>
  );
};

export default ArticleDetailPage;
