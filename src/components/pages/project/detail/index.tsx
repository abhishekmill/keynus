import React from "react";
import { getTranslations } from "next-intl/server";

import AppHeader from "../../../module/_basic/appHeader";
import ErrorScreen from "../../../module/error";
import PageContentLayout from "../../../layout/pageContentLayout";
import ProjectArticles from "../../../module/projects/projectDetail/articles";
import ProjectLockerWalls from "../../../module/projects/projectDetail/lockerwalls";
import ProjectQuote from "../../../module/projects/projectDetail/quote";
import ProjectSubscription from "../../../module/projects/projectDetail/subscription";
import callServerAction from "../../../../utils/callServerAction";
import { IProjectData } from "@/utils/types";
import { getProjectDetailsById, getSubscriptionList } from "@/app/actions/projects";
import { getNumberingArticlesList } from "../../../../app/actions/lockerwall";

type Props = {
  id: string;
};

// ProjectDetailPanel

const ProjectDetailPage: React.FC<Props> = async ({ id }) => {
  const t = await getTranslations();

  try {
    console.time("project detail API fetch time");
    const [res, subscriptionArticleList, numberingArticleList] = await Promise.all([
      callServerAction(getProjectDetailsById, id),
      callServerAction(getSubscriptionList),
      callServerAction(getNumberingArticlesList),
    ]);
    console.timeEnd("project detail API fetch time");

    console.log(id);

    // Calculate number of lockers
    const lockerNumber = (res.result as IProjectData).keyniusProjectLockerWalls.reduce((total, lockerwall) => {
      const lockerwallJson = JSON.parse(lockerwall.configuration3DJson);
      let lockers = 0;
      if (lockerwallJson && typeof lockerwallJson === "object") {
        const lockerNumberArray = Object.keys(lockerwallJson).map(
          (key) => Object.keys(lockerwallJson[key]?.doors).length * (lockerwallJson[key]?.column ?? 1),
        );
        lockers = lockerNumberArray.reduce((total, lockerNum) => total + lockerNum, 0);
      }
      return total + (lockers ?? 0);
    }, 0);

    // Get subscription list
    const subscriptions = (res.result as IProjectData)?.keyniusProjectAddOns
      .filter((item) => item.addOnType === "subscription")
      .map((row) => ({
        id: row.id,
        articleName: row.keyniusPIMArticle?.articleName ?? "",
        article: row.keyniusPIMArticleId,
        lockers: lockerNumber,
        pricePerLocker: row.pricePerUnit,
        discount: row.discount,
        subscriptionCycle: row.subscriptionCycle,
      }));

    // Get articles
    const articles = (res.result as IProjectData)?.keyniusProjectAddOns?.filter(
      (item) => item.addOnType === "shopArticle",
    );

    // calculate article total price
    const articleTotalPrice = articles?.reduce(
      (total, item) => total + (item?.quantity ?? 0) * (item?.pricePerUnit ?? 0) * (1 - (item?.discount ?? 0) / 100),
      0,
    );

    return (
      res.isSuccess && (
        <>
          <AppHeader
            heading={t("Project details")}
            breadcrumb={[
              { label: t("Projects"), href: "/projects" },
              { label: res?.result?.projectName, href: "#" },
            ]}
            navigation={[
              { type: "icon", icon: "Plus", label: t("New lockerwall"), href: `/projects/${id}/lockerwall` },
              { type: "icon", icon: "ShoppingBag", label: t("Shop"), href: `/projects/${id}/articles` },
              { type: "icon", icon: "DocumentText", label: t("History"), href: `/projects/${id}/history` },
              { type: "icon", icon: "Cog6Tooth", label: t("Project settings"), href: `/projects/${id}/update` },
            ]}
            hasPrev
            transText={{ searchHere: t("Search here") }}
          />
          <PageContentLayout className="space-y-16">
            <ProjectLockerWalls
              project={res?.result}
              articlePrice={articleTotalPrice}
              numberingArticleList={numberingArticleList?.result ?? []}
              transText={{
                Lockerwalls: t("Lockerwalls"),
                emptyLockerWall: t("There aren’t any lockerwall yet, start by creating a new one"),
              }}
              lockerWallTransText={{
                article: t("Article"),
                price: t("Price"),
                amount: t("Amount"),
                discount: t("Discount"),
                priceSubtotal: t("Price subtotal"),
                lockerWallNames: t("Lockerwall names"),
                projectTotal: t("Project total"),
                copyDesign: t("Copy design"),
                editLockerwall: t("Edit lockerwall"),
                quantity: t("Quantity"),
                notes: t("Notes"),
                pricePerUnit: t("Price per unit"),
                netPricePerUnit: t("Net price per unit"),
                location: t("Location"),
                amountOfLockers: t("Amount of lockers"),
                name: t("Name"),
                editLockerwallName: t("What’s the name of this lockerwall?"),
                editLockerwallLocation: t("What is the location of this lockerwall?"),
                editLockerwallNote: t("Any notes on this lockerwall?"),
                saveLockerwall: t("Save lockerwall"),
                yes: t("Yes"),
                no: t("No"),
                deleteArticleQuestionTitle: t("Are you sure you want to delete this article?"),
                save: t("Save"),
                articleNote: t("Article notes"),
                ArticleNotes: t("Article notes"),
                lockerwallNumbering: t("Lockerwall numbering"),
                numberTypeQuestion: t("What type of numbering do you want to add?"),
                doorNumbering: t("Where on the door will the numbering be?"),
                startingNumber: t("Starting number"),
                includeSmarty: t("Include Smarty"),
                add: t("ADD"),
              }}
            />
            <ProjectArticles
              articleList={articles}
              totalPrice={articleTotalPrice}
              currency={res?.result?.currancy}
              transText={{
                articles: t("Articles"),
                article: t("Article"),
                price: t("Price"),
                amount: t("Amount"),
                discount: t("Discount"),
                priceSubtotal: t("Price subtotal"),
                pricePerUnit: t("Price per unit"),
                netPricePerUnit: t("Net price per unit"),
                yes: t("Yes"),
                no: t("No"),
                color: t("color"),
                deleteArticleQuestionTitle: t("Are you sure you want to delete this article?"),
                save: t("Save"),
                articleNote: t("Article notes"),
              }}
            />
            <ProjectSubscription
              id={id}
              subscriptions={subscriptions}
              lockerNumber={lockerNumber}
              subscriptionArticleList={subscriptionArticleList?.result}
              currency={res?.result?.currancy}
              transText={{
                title: t("Subscription support"),
                description: t("The amount is based on the amount of lockers in your project"),
                deleteSubscriptionQuestionTitle: t("Are you sure you want to delete this this subscription?"),
                article: t("Article"),
                lockers: t("Lockers"),
                pricePerLocker: t("Price per locker"),
                discount: t("Discount"),
                netPricePerLocker: t("Net price per locker"),
                totalPerTerm: t("Total per term"),
                addSubscription: t("Add subscription"),
                save: t("Save"),
                yes: t("Yes"),
                no: t("No"),
              }}
            />
          </PageContentLayout>
          <ProjectQuote
            id={id}
            keyniusPIMTemplateDocumentId={res?.result?.keyniusPIMTemplateDocumentId}
            discountPercentage={res?.result?.discountPercentage ?? 0}
            vatPercentage={res?.result?.vatPercentage ?? 0}
            lockerData={res?.result?.keyniusProjectLockerWalls}
            currency={res?.result?.currancy}
            pdfFillData={{
              templateId: res?.result?.keyniusPIMPartnerDocumentId,
              header1: res?.result?.header1,
              paragraph1_1: res?.result?.paragraph1_1,
              paragraph1_2: res?.result?.paragraph1_2,
              paragraph1_3: res?.result?.paragraph1_3,
              imageURL1_1: res?.result?.imageURL1_1,
              header2: res?.result?.header2,
              paragraph2_1: res?.result?.paragraph2_1,
            }}
            transText={{
              lockerWalls: t("Lockerwalls"),
              articles: t("Articles"),
              totalVat: t("Total incl"),
              total: t("Total"),
              send: t("Send"),
              email: t("Email"),
              subtotal: t("Subtotal"),
              discount: t("Discount"),
              deliveryCost: t("Delivery costs"),
              vat: t("Vat"),
              fillInFields: t("fill in fields"),
              fillInFieldsDescription: t("fill in fields description"),
              page: t("Page"),
              header: t("Header"),
              paragraph: t("Paragraph"),

              uploadFile: t("Upload file"),
              maximumFileSize: t("Maximum file size"),
              saveFields: t("Save fields"),
              selectTemplate: t("Select template"),
            }}
          />
        </>
      )
    );
  } catch (error) {
    console.log("project-detail-error: ", error);
    return (
      <ErrorScreen
        message={
          error.errors?.[0] ?? error?.cause?.errno === -3008
            ? "Network Error. Please check your network."
            : "Something went wrong"
        }
      />
    );
  }
};

export default ProjectDetailPage;
