import React from "react";
import { useTranslations } from "next-intl";

import AppHeader from "../../module/_basic/appHeader";
import PageContentLayout from "../../layout/pageContentLayout";
import ArticleShopFilterPanel from "../../module/article/articleShopFilterPanel";
import Pagination from "../../module/_basic/pagination";
import ProductTable from "@/components/module/_basic/productTable";

import { IArticle, IArticleFilter, IArticleList, IProjectData } from "../../../utils/types";
import styles from "./style.module.scss";

type ActualArticleData = {
  id: string;
  articleName: string;
  customArticleName: string;
  articleImage: string;
  articleNumber?: string;
  buyOutPrice?: number;
  articlePrice?: {
    buyOutPrice?: number;
  };
};

type Props = {
  res: IArticleList;
  filterRes: IArticleFilter;
  projectData: IProjectData;
};

const importOrder = ["branch", "usecase", "material"] as const;

const ArticleShopPage: React.FC<Props> = ({ res, filterRes, projectData }) => {
  const t = useTranslations();
  const articles = Array.isArray(res.result) ? (res.result as ActualArticleData[]) : [];

  const sortedFilterData = importOrder.reduce<Partial<IArticleFilter>>((acc, key) => {
    if (key in filterRes && filterRes[key] !== undefined) {
      acc[key] = filterRes[key];
    }
    return acc;
  }, {});

  const hasArticles = Array.isArray(articles) && articles.length > 0;

  const productTableData = React.useMemo(() => {
    return articles.map((item) => ({
      label: item?.customArticleName ?? item?.articleName ?? "N/A",
      articleId: item?.id ?? "",
      articleNumber: item?.articleNumber ?? "N/A",
      price: item?.buyOutPrice ?? item?.articlePrice?.buyOutPrice ?? 0,
      currencySymbol: "€",
      productId: item?.id ?? "",
    }));
  }, [articles]);

  return (
    <>
      <AppHeader
        heading={t("Article shop")}
        breadcrumb={[
          { label: t("Projects"), href: `/projects` },
          { label: projectData.projectName, href: `/projects/${projectData.id}` },
          { label: t("Article shop"), href: `#` },
        ]}
        hasPrev
        hasSearch
        transText={{ searchHere: t("Search here") }}
      />

      <PageContentLayout className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.filterWrapper}>
            <ArticleShopFilterPanel
              transText={{
                filter: t("Filter"),
                branch: t("Branch"),
                usecase: t("Use case"),
                material: t("Material"),
              }}
              filterData={sortedFilterData as IArticleFilter}
            />
          </div>

          <div className={styles.tableWrapper}>
            <div className={styles.tableContent}>
              {hasArticles ? (
                <ProductTable data={productTableData} projectId={projectData.id} />
              ) : (
                <p className={styles.noResults}>{t("No results, use a different search filter")}</p>
              )}
            </div>

            {res?.totalCount && res.totalCount > 0 && (
              <Pagination transText={{ itemsPerPage: t("items per page") }} length={res.totalCount} />
            )}
          </div>
        </div>
      </PageContentLayout>
    </>
  );
};

export default ArticleShopPage;
