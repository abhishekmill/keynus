"use server";
import { FieldValues } from "react-hook-form";
import { privateFetch } from "../../services/privateFetch";
import { api } from "../../utils/api";
import { blobToBase64 } from "../../utils/base64";

const baseUrl =
  process.env.NODE_ENV === "development" ? process.env.BACKEND_DEV_API_URL : process.env.BACKEND_PROD_API_URL;

export async function getProjects(searchParams?: { [key: string]: string | string[] | undefined }) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/GetPIMProjectList`);

  const response = await privateFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pageNumber: +(searchParams?.page ?? "1") - 1,
      pageSize: +(searchParams?.limit ?? "10"),
      projectStatus: searchParams?.status ?? "",
      filterPartnerId: searchParams?.partner ?? "",
      searchValue: searchParams?.search ?? "",
      sortProperty: searchParams?.sortBy ?? "",
      isDescending: searchParams?.order === "desc" ? true : false,
    }),
    cache: "no-cache",
  });

  return response;
}

export async function getProjectDetailsById(id: string) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/GetProjectDetails/${id}`);
  try {
    const response = await api.get(url, {
      isAuth: true,
    });

    return response;
  } catch (error) {
    console.log("ByIdError: ", error);
    return { isSuccess: false, ...error };
  }
}

export async function getProjectById(id: string) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/${id}`);

  const response = await privateFetch(url, {
    method: "GET",
    cache: "no-cache",
  });

  return response;
}

export async function getSubscriptionList() {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/GetSubscriptionsList`);

  const response = await api.get(url, {
    isAuth: true,
  });

  return response;
}

export async function saveSubscription(data: any) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/AddSubscriptionToProject`);

  const response = await api.post(url, {
    params: data,
    isAuth: true,
  });

  return response;
}

export async function createNewProject(projectData: FieldValues) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects`);

  const body = {
    partnerId: projectData?.partner?.length > 0 ? projectData?.partner : null,
    projectName: projectData?.projectName ?? null,
    projectNumber: projectData?.projectNumber?.length > 0 ? projectData?.projectNumber : null,
    customerName: projectData?.customerName?.length > 0 ? projectData?.customerName : null,
    address: {
      address1: null,
      address2: null,
      street: projectData?.street?.length > 0 ? projectData?.street : null,
      houseNumber: projectData?.houseNumber?.length > 0 ? projectData?.houseNumber : null,
      city: projectData?.city?.length > 0 ? projectData?.city : null,
      zip: projectData?.zipCode?.length > 0 ? projectData?.zipCode : null,
      country: projectData?.country ?? 0,
    },
    contactFirstName: projectData?.firstName?.length > 0 ? projectData?.firstName : null,
    contactLastName: projectData?.lastName?.length > 0 ? projectData?.lastName : null,
    contactEmail: projectData?.email?.length > 0 ? projectData?.email : null,
    contactPhone: projectData?.phone?.length > 0 ? projectData?.phone : null,
    expectedDeliveryDate: projectData?.expectedDeliveryDate?.length > 0 ? projectData?.expectedDeliveryDate : null,
    projectDetails: projectData?.projectDetails?.length > 0 ? projectData?.projectDetails : null,
    branch: projectData?.branch ?? "None",
    projectStatus: projectData?.projectStatus ?? "None",
  };
  const response = await privateFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-cache",
  });

  return response;
}

export async function updateProject(projectData: FieldValues) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects`);

  const body = {
    id: projectData.id,
    partnerId: projectData?.partner?.length > 0 ? projectData?.partner : null,
    projectName: projectData?.projectName ?? null,
    projectNumber: projectData?.projectNumber?.length > 0 ? projectData?.projectNumber : null,
    customerName: projectData?.customerName?.length > 0 ? projectData?.customerName : null,
    address: {
      address1: null,
      address2: null,
      street: projectData?.street?.length > 0 ? projectData?.street : null,
      houseNumber: projectData?.houseNumber?.length > 0 ? projectData?.houseNumber : null,
      city: projectData?.city?.length > 0 ? projectData?.city : null,
      zip: projectData?.zipCode?.length > 0 ? projectData?.zipCode : null,
      country: projectData?.country ?? 0,
    },
    contactFirstName: projectData?.firstName?.length > 0 ? projectData?.firstName : null,
    contactLastName: projectData?.lastName?.length > 0 ? projectData?.lastName : null,
    contactEmail: projectData?.email?.length > 0 ? projectData?.email : null,
    contactPhone: projectData?.phone?.length > 0 ? projectData?.phone : null,
    expectedDeliveryDate: projectData?.expectedDeliveryDate ? projectData?.expectedDeliveryDate : null,
    projectDetails: projectData?.projectDetails?.length > 0 ? projectData?.projectDetails : null,
    branch: projectData?.branch ?? "None",
    projectStatus: projectData?.projectStatus ?? "None",
    isDiscountPercentageEnable: projectData?.isDiscountPercentageEnable ?? false,
  };

  const response = await privateFetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-cache",
  });
  return response;
}

export async function getDocumentTemplateList(projectId: string) {
  const url = `${baseUrl}/KeyniusPIM/Projects/${projectId}/GetTemplateDocument?DocumentType=offer`;

  try {
    const response = await api.get(url, {
      isAuth: true,
    });
    return response;
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}

export async function handleDownloadPDF(projectId: string, lang?: "en" | "nl") {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/${projectId}/DownloadQuotationPDF`);

  const response = await privateFetch(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-User-Language": lang ?? "en",
      },
      cache: "no-cache",
    },
    true,
  );
  const base64String = await blobToBase64(response.blob);

  return { isSuccess: true, data: { blob: base64String, fileName: response.fileName } };
}

export async function handleSendPDF(projectId: string, emails: string, lang?: "en" | "nl") {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/${projectId}/EmailQuotationPDF`);

  const response = await privateFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-User-Language": lang ?? "en",
    },
    body: JSON.stringify({
      emails: emails,
    }),
    cache: "no-cache",
  });

  return response;
}

export async function handleSavePDFCustomFields(projectId: string, formData: FormData) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/${projectId}/SaveProjectCustomFieldDetails`);

  const response = await privateFetch(url, {
    method: "POST",
    headers: {
      accept: "text/plain",
    },
    body: formData,
    cache: "no-cache",
  });

  return response;
}

export async function getProjectHistory(id: string) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/${id}/GetProjectHistoryDetails`);

  try {
    const response = await api.get(url, {
      isAuth: true,
    });
    return response;
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}

export async function updateProjectPercent(data: any) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/UpdatePIMProjectCostDetails`);

  try {
    const response = await api.put(url, {
      isAuth: true,
      params: data,
    });

    return response;
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}
