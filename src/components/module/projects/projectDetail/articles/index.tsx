"use client";
import React from "react";

import CustomDisclosure from "../../../../ui/disclosure";
import { ICurrency, IProjectAddOn } from "../../../../../utils/types";

import ProjectArticleList from "../_modules/articleList";

type Props = {
  articleList: IProjectAddOn[];
  totalPrice: number;
  transText: { [key: string]: string };
  currency?: ICurrency;
};

const ProjectArticles: React.FC<Props> = ({ transText, articleList, totalPrice, currency }) => {
  return (
    <CustomDisclosure title={transText?.articles} defaultOpen>
      <ProjectArticleList
        articleList={articleList}
        totalPrice={totalPrice}
        currency={currency}
        articleType="article"
        projectId={articleList?.[0]?.keyniusProjectId ?? ""}
        transText={transText}
      />
    </CustomDisclosure>
  );
};

export default ProjectArticles;
