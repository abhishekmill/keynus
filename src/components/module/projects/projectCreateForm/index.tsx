"use client";

import React, { useEffect, useState } from "react";
import * as yup from "yup";
import classNames from "classnames";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import Button from "../../../ui/button";
import DatePicker from "../../../ui/datePicker";
import Selector from "../../../ui/selector";
import SwitchToggle from "../../../ui/toggle";
import TextArea from "../../../ui/textarea";
import TextInput from "../../../ui/textInput";
import { ICountry, IPartner, IProject } from "../../../../utils/types";
import { branches, projectStatus } from "../../../../utils/constant";
import { createNewProject, updateProject } from "../../../../app/actions/projects";
import { useRouter } from "../../../../navigation";
import callServerAction from "../../../../utils/callServerAction";
import { decrypt } from "../../../../utils/jwt";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks/store";
import { projectSelector, setUserRole } from "../../../../store/app";
import { logout } from "../../../../app/actions/auth";

import styles from "./style.module.scss";

const schema = yup.object().shape({
  partner: yup.string(),
  isDiscountPercentageEnable: yup.boolean(),
  projectName: yup.string().required("Project name is a required field"),
  customerName: yup.string(),
  country: yup.number(),
  city: yup.string(),
  zipCode: yup.string(),
  street: yup.string(),
  houseNumber: yup.string(),
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string().email("Email is not valid"),
  phone: yup.string(),
  projectNumber: yup.string(),
  expectedDeliveryDate: yup.date(),
  projectStatus: yup.string(),
  projectDetails: yup.string(),
  branch: yup.string(),
});

interface JwtPayload {
  [key: string]: any;
}

type Props = {
  project?: IProject;
  type: "create" | "update";
  countries: ICountry[];
  partners: IPartner[];
  transText?: { [key: string]: string };
  accessToken?: string;
};

const ProjectCreateForm: React.FC<Props> = ({
  transText,
  countries = [],
  partners = [],
  project,
  type = "create",
  accessToken = undefined,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userRole } = useAppSelector(projectSelector);
  const [loading, setLoading] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleProject = async (data: FieldValues) => {
    try {
      setLoading(true);
      const res =
        type === "create"
          ? await callServerAction(createNewProject, data)
          : await callServerAction(updateProject, { id: project?.id, ...data });
      toast.success(`Project ${type === "create" ? "created" : "updated"} successfully`);
      router.push(`/projects/${res.result.id}`);
      router.refresh();
    } catch (error: any) {
      console.error("error: ", error);
      toast.error(error?.errors?.[0] ?? error?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!!project && type === "update") {
      reset({
        partner: !!project?.partnerId ? project?.partnerId : "",
        isDiscountPercentageEnable: project.isDiscountPercentageEnable ?? false,
        projectName: !!project?.projectName ? project.projectName : "",
        customerName: !!project?.customerName ? project?.customerName : "",
        country: !!project?.address.country ? project?.address.country : undefined,
        city: !!project?.address?.city ? project?.address.city : "",
        zipCode: !!project?.address?.zip ? project?.address.zip : "",
        street: !!project?.address?.street ? project?.address.street : "",
        houseNumber: !!project?.address?.houseNumber ? project?.address.houseNumber : "",
        firstName: !!project?.contactFirstName ? project?.contactFirstName : "",
        lastName: !!project?.contactLastName ? project?.contactLastName : "",
        email: !!project?.contactEmail ? project?.contactEmail : "",
        phone: !!project?.contactPhone ? project?.contactPhone : "",
        projectNumber: !!project?.projectNumber ? project?.projectNumber : "",
        expectedDeliveryDate: !!project?.expectedDeliveryDate ? project?.expectedDeliveryDate : undefined,
        projectStatus: !!project?.projectStatus
          ? projectStatus?.find((status) => status.value.toLowerCase() === project.projectStatus.toLowerCase())?.value
          : "",
        projectDetails: !!project?.projectDetails ? project?.projectDetails : "",
        branch: !!project?.branch ? project?.branch : "",
      });
    }
  }, [project]);

  useEffect(() => {
    const checkUserRole = async () => {
      if (accessToken) {
        const user: JwtPayload | null = await decrypt(accessToken);
        const keyOfRole = Object.keys(user as Object).find((key: string) => key.includes("role"));
        if (keyOfRole) {
          dispatch(setUserRole(user?.[keyOfRole]));
        }
      } else {
        await logout();
        if (typeof window !== "undefined") localStorage.clear();
        router.push("/auth/login");
      }
    };
    if (!userRole) {
      checkUserRole();
    }
  }, [userRole]);

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(handleProject)}>
      {userRole !== "PartnerSalesRepresentative" && (
        <div className={styles.formSection}>
          <p className={styles.heading}>{transText?.partnerInformation}</p>
          <div className={styles.formElementGroup}>
            <div className={classNames(styles.formElement, styles.spanHalf)}>
              <Controller
                name="partner"
                control={control}
                render={({ field: { onChange, value } }) => {
                  const selectedPartner = partners?.find((item) => item.id === value);
                  return (
                    <Selector
                      label={transText?.partner}
                      options={partners.map((item) => ({ label: item.name, value: item.id }))}
                      value={{ label: selectedPartner?.name ?? "None", value: selectedPartner?.id ?? "" }}
                      setValue={(partner) => {
                        onChange(partner?.value);
                      }}
                      errorMsg={errors.partner?.message}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className={styles.formSection}>
        <p className={styles.heading}>{transText?.showDiscount}</p>
        <div className={styles.formElementGroup}>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <Controller
              name="isDiscountPercentageEnable"
              control={control}
              render={({ field: { onChange, value = false } }) => {
                return (
                  <SwitchToggle
                    prefix={transText?.off}
                    suffix={transText?.on}
                    defaultValue={value}
                    onChange={onChange}
                  />
                );
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <p className={styles.heading}>{transText?.customerInformation}</p>
        <div className={styles.formElementGroup}>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <TextInput
              name="projectName"
              label={transText?.projectName}
              register={register}
              errorMsg={errors.projectName?.message}
              required
            />
          </div>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <TextInput
              name="customerName"
              label={transText?.customerName}
              register={register}
              errorMsg={errors.customerName?.message}
            />
          </div>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <Controller
              name="country"
              control={control}
              render={({ field: { onChange, value = "" } }) => {
                const country = countries?.find((country) => country.id === +value);
                return (
                  <Selector
                    label={transText?.country}
                    options={countries?.map((country) => ({ label: country.name, value: `${country.id}` }))}
                    value={{ label: country?.name ?? "None", value: country?.id ?? "" }}
                    setValue={(item) => {
                      onChange(+item.value);
                    }}
                    errorMsg={errors.country?.message}
                  />
                );
              }}
            />
          </div>
          <div></div>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <TextInput name="city" label={transText?.city} register={register} errorMsg={errors.city?.message} />
          </div>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <TextInput
              name="zipCode"
              label={transText?.zipCode}
              register={register}
              errorMsg={errors.zipCode?.message}
            />
          </div>
          <div className={classNames(styles.formElement, styles.spanDoubleSemi)}>
            <TextInput
              name="street"
              label={transText?.streetName}
              register={register}
              errorMsg={errors.street?.message}
            />
          </div>
          <div className={classNames(styles.formElement, styles.spanSemi)}>
            <TextInput
              name="houseNumber"
              label={transText?.houseNumber}
              register={register}
              errorMsg={errors.houseNumber?.message}
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <p className={styles.heading}>{transText?.contactDetails}</p>
        <div className={styles.formElementGroup}>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <TextInput
              name="firstName"
              label={transText?.firstName}
              register={register}
              errorMsg={errors.firstName?.message}
            />
          </div>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <TextInput
              name="lastName"
              label={transText?.lastName}
              register={register}
              errorMsg={errors.lastName?.message}
            />
          </div>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <TextInput name="email" label={transText?.email} register={register} errorMsg={errors.email?.message} />
          </div>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <TextInput name="phone" label={transText?.phone} register={register} errorMsg={errors.phone?.message} />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <p className={styles.heading}>{transText?.projectDetails}</p>
        <div className={styles.formElementGroup}>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <TextInput
              name="projectNumber"
              label={transText?.projectNumber}
              register={register}
              errorMsg={errors.projectNumber?.message}
            />
          </div>
          <div></div>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <Controller
              control={control}
              name="expectedDeliveryDate"
              render={({ field: { value = "", onChange } }) => (
                <DatePicker
                  label={transText?.expectedDeliveryDate}
                  value={value}
                  onChange={onChange}
                  errorMsg={errors.expectedDeliveryDate?.message}
                />
              )}
            />
          </div>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <Controller
              name="projectStatus"
              control={control}
              render={({ field: { onChange, value } }) => {
                const selectedStatus = projectStatus?.find((status) => status.value === value);
                return (
                  <Selector
                    label={transText?.projectStatus}
                    options={projectStatus}
                    value={{ label: selectedStatus?.label ?? "None", value: selectedStatus?.value ?? "None" }}
                    setValue={(status) => {
                      onChange(status.value);
                    }}
                    errorMsg={errors.projectStatus?.message}
                  />
                );
              }}
            />
          </div>
          <div className={classNames(styles.formElement, styles.spanFull)}>
            <TextArea
              name="projectDetails"
              label={transText?.projectDetails}
              rows={5}
              register={register}
              errorMsg={errors.projectDetails?.message}
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <p className={styles.heading}>{transText?.otherInformation}</p>
        <div className={styles.formElementGroup}>
          <div className={classNames(styles.formElement, styles.spanHalf)}>
            <Controller
              name="branch"
              control={control}
              render={({ field: { onChange, value } }) => {
                const selectedBranch = branches?.find((branch) => branch.value?.toLowerCase() === value?.toLowerCase());
                return (
                  <Selector
                    label={transText?.branch}
                    options={branches}
                    value={{ label: selectedBranch?.label ?? "None", value: selectedBranch?.value ?? "None" }}
                    setValue={(branch) => {
                      onChange(branch.value);
                    }}
                    errorMsg={errors.branch?.message}
                  />
                );
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <div>
          <Button type="submit" label={transText?.saveProject} isLoading={loading} />
        </div>
      </div>
    </form>
  );
};

export default ProjectCreateForm;
