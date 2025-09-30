import React from "react";
import { getTranslations } from "next-intl/server";

import AppHeader from "../../../module/_basic/appHeader";
import PageContentLayout from "../../../layout/pageContentLayout";
import { getProjectById } from "../../../../app/actions/projects";
import { getAllCountries } from "../../../../app/actions/country";
import { getAllPartners } from "../../../../app/actions/partner";
import ProjectCreateForm from "../../../module/projects/projectCreateForm";
import { getCookies } from "../../../../utils/cookie";

type Props = {
  id: string;
};

const UpdateProjectPage: React.FC<Props> = async ({ id }) => {
  const t = await getTranslations();
  const [accessToken] = await getCookies(["accessToken"]);

  /**
   * Fetch project by id, country list, partner list
   */
  const [projectRes, countriesRes, partnersRes] = await Promise.all([
    getProjectById(id),
    getAllCountries(),
    getAllPartners(),
  ]);

  return (
    <>
      <AppHeader
        hasPrev
        heading={projectRes.isSuccess ? projectRes?.result?.projectName : ""}
        breadcrumb={[
          { label: t("Projects"), href: "/projects" },
          { label: projectRes?.result?.projectName, href: `/projects/${id}` },
        ]}
      />
      <PageContentLayout>
        {projectRes.isSuccess && (
          <ProjectCreateForm
            type="update"
            accessToken={accessToken}
            project={projectRes?.result}
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
        )}
      </PageContentLayout>
    </>
  );
};

export default UpdateProjectPage;
