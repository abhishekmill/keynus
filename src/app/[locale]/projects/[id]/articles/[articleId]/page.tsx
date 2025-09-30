import React from "react";
import ArticleDetailPage from "@/components/pages/article/detail";
import { getArticleDetail } from "../../../../../actions/article";
import { getProjectById } from "../../../../../actions/projects";

type Props = {
  locale: string;
  id: string;
  articleId: string;
};

const Page = async ({ params }: { params: Props }) => {
  const start = performance.now();
  const [res, projectRes] = await Promise.all([getArticleDetail(params.articleId), getProjectById(params.id)]);
  const end = performance.now();
  const fetchTimeInMs = end - start;

  return (
    <ArticleDetailPage
      articleData={res.result}
      projectId={params?.id ?? ""}
      articleId={params?.articleId ?? ""}
      locale={params?.locale ?? ""}
      projectName={projectRes?.result?.projectName}
      fetchTimeInMs={fetchTimeInMs}
    />
  );
};

export default Page;
