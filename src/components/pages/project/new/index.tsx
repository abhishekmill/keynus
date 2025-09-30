import React from "react";
import { getTranslations } from "next-intl/server";

import AppHeader from "../../../module/_basic/appHeader";
import PageContentLayout from "../../../layout/pageContentLayout";
import ProjectCreateForm from "../../../module/projects/projectCreateForm";
import { getAllCountries } from "../../../../app/actions/country";
import { getAllPartners } from "../../../../app/actions/partner";
import { getCookies } from "../../../../utils/cookie";

const CreateNewProjectPage = async () => {
  const t = await getTranslations();

  /* Fetch countries and partners */
  const [countriesRes, partnersRes] = await Promise.all([getAllCountries(), getAllPartners()]);
  const [accessToken] = await getCookies(["accessToken"]);

  return (
    <>
      <AppHeader
        heading={t("New project")}
        breadcrumb={[
          { label: t("Projects"), href: "/projects" },
          { label: t("New project"), href: "#" },
        ]}
        hasPrev
      />
      <PageContentLayout>
        <ProjectCreateForm
          type="create"
          accessToken={accessToken}
          countries={countriesRes?.isSuccess ? countriesRes?.result : []}
          partners={partnersRes?.isSuccess ? partnersRes?.result : []}
          transText={{
            partnerInformation: t("Partner information"),
            partner: t("Partner"),
            customerInformation: t("Customer information"),
            projectName: t("Project name"),
            customerName: t("Customer name"),
            country: t("Country"),
            city: t("City"),
            zipCode: t("ZIP code"),
            streetName: t("Street name"),
            houseNumber: t("House number"),
            contactDetails: t("Contact details"),
            firstName: t("First name"),
            lastName: t("Last name"),
            email: t("Email"),
            phone: t("Phone"),
            projectDetails: t("Project details"),
            expectedDeliveryDate: t("Expected delivery date"),
            otherInformation: t("Other information"),
            branch: t("Branch"),
            saveProject: t("Save project"),
            projectNumber: t("Project number"),
            projectStatus: t("Project status"),
            showDiscount: t("Show discount"),
            on: t("On"),
            off: t("Off"),
          }}
        />
      </PageContentLayout>
    </>
  );
};

export default CreateNewProjectPage;
