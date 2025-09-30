"use client";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { usePathname } from "../../../../../navigation";
import Button from "@/components/ui/button";
import Selector from "@/components/ui/selector";
import { IPartner } from "@/utils/types";
import { projectStatus } from "@/utils/constant";
import { decrypt } from "../../../../../utils/jwt";

import styles from "./style.module.scss";

type Props = {
  partners: IPartner[];
  accessToken: string;
  transText: { [key: string]: string };
  salesFilter?: string[];
  page: "archivedProjects" | "projects";
};

interface JWTPayload {
  [key: string]: any;
}

const ProjectTableFilter: React.FC<Props> = ({ transText, partners, accessToken, salesFilter = [], page }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { control, reset, watch } = useForm();
  const status = watch("status");
  const partner = watch("partner");
  const salesRep = watch("salesRep");
  const [userRole, setUserRole] = useState<JWTPayload | string>();

  const fetchUserData = async () => {
    const user: JWTPayload | null = await decrypt(accessToken);
    const keyOfRole = Object.keys(user as Object).find((key: string) => key.includes("role"));
    if (keyOfRole) {
      setUserRole(user?.[keyOfRole]);
    }
  };

  // Pre select all dropdowns when page load
  useEffect(() => {
    reset({
      status: searchParams.get("status") ?? "",
      partner: searchParams.get("partner") ?? "",
      salesRep: searchParams.get("salesRep") ?? "",
    });
    fetchUserData();
  }, []);

  // Handle route when dropdowns are changed
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    if (partner) {
      params.set("partner", partner);
    } else {
      params.delete("partner");
    }

    if (salesRep) {
      params.set("salesRep", salesRep);
    } else {
      params.delete("salesRep");
    }

    // Redirect
    if (status || partner || salesRep) {
      router.push(`${pathname}?${params?.toString()}`);
    }
  }, [status, partner, salesRep]);

  const handleRefresh = () => {
    router.push(`${pathname}`);
  };

  return (
    <div className={styles.filterWrapper}>
      <div className={styles.dropdowns}>
        <Controller
          name="status"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedStatus = projectStatus.find((status) => status.value === value);
            return (
              <Selector
                label={transText.status}
                options={projectStatus}
                value={{ label: selectedStatus?.label ?? "None", value: selectedStatus?.value ?? "none" }}
                setValue={(status) => {
                  onChange(status.value);
                }}
                className={styles.selector}
              />
            );
          }}
        />
        {userRole !== "PartnerSalesRepresentative" && (
          <Controller
            name="partner"
            control={control}
            render={({ field: { onChange, value } }) => {
              const selectedPartner = partners.find((partner) => partner.id === value);
              return (
                <Selector
                  label={transText.partner}
                  options={[
                    { label: "All", value: "" },
                    ...partners.map((item) => ({ label: item.name, value: item.id })),
                  ]}
                  value={{ label: selectedPartner?.name ?? "All", value: selectedPartner?.id ?? "" }}
                  setValue={(partner) => {
                    onChange(partner.value);
                  }}
                  className={styles.selector}
                />
              );
            }}
          />
        )}
        <Controller
          name="salesRep"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedPartner = salesFilter.find((partner) => partner === value);
            return (
              <Selector
                label={transText.salesRepresentative}
                options={[{ label: "All", value: "" }, ...salesFilter.map((item) => ({ label: item, value: item }))]}
                value={{ label: selectedPartner ?? "All", value: selectedPartner ?? "" }}
                setValue={(partner) => {
                  onChange(partner.value);
                }}
                className={styles.selector}
              />
            );
          }}
        />
        <Button label="" icon="ArrowCircle" onClick={handleRefresh} className={styles.refresh} />
      </div>
      {page === "projects" && (
        <Button
          label=""
          icon="Box"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set("status", "archived");
            router.push(`/archivedProjects?${params?.toString()}`);
          }}
          className={styles.archiveBtn}
        />
      )}
    </div>
  );
};

export default ProjectTableFilter;
