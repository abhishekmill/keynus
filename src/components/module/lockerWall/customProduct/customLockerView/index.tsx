"use client";
import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { FieldValues, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";

import Button from "../../../../ui/button";
import ModuleForView from "../../../ModuleForView";
import PageContentLayout from "../../../../layout/pageContentLayout";
import TextInput from "../../../../ui/textInput";
import { IDoor, IKeyniusPIMArticle, ILockerWallItem } from "../../../../../utils/types";
import {
  addDefaultCabinet,
  appendLockerData,
  configuratorSelector,
  defaultLockerWallData,
  resetLockerWall,
} from "../../../../../store/configurator";
import { useAppSelector } from "../../../../../utils/hooks/store";
import { addCabinet, configuratorControlSelector } from "../../../../../store/configuratorControl";

import styles from "./style.module.scss";

type Props = {
  transText: { [key: string]: string };
  customData: IKeyniusPIMArticle;
};

type IDoorListType = { number: number; value: number };

const schema = yup.object().shape({
  height: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("You must insert height"),
  width: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("You must insert width"),
  depth: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("You must insert depth"),
  doorCount: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("You must insert door count"),
});

const CustomLockerView: React.FC<Props> = ({ transText, customData }) => {
  const pathName = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const { lockerWallData } = useAppSelector(configuratorSelector);
  const { method, position, selectedCabinets } = useAppSelector(configuratorControlSelector);
  const doorCount = useWatch({ control, name: "doorCount" });
  const doorHeight = useWatch({ control, name: "height" });

  const [modelData, setModelData] = useState<{ [key: string]: ILockerWallItem }>(defaultLockerWallData.lockerWallData);
  const [doorList, setDoorList] = useState<IDoorListType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const initialLoaded = useRef(false);

  const onSubmit = async (data: FieldValues) => {
    const updatedModelData = onUpdateModel(doorList);
    dispatch(addDefaultCabinet({ ...customData, renderCabinetBaseUrl: customData?.renderCabinetBaseUrl }));
    const sumDoorHeight = doorList.reduce((acc, item) => acc + item.value, 0);
    if (data.height === 0 || data.width === 0 || data.depth === 0) {
      toast.error("Height, width and depth must be greater than 0");
      return;
    } else if (sumDoorHeight !== data.height) {
      toast.error("Sum of door heights must be the same as the cabinet height");
      return;
    }
    setIsLoading(true);
    try {
      let newPosition = 0;
      if (position === "left") {
        newPosition = selectedCabinets
          ? lockerWallData[selectedCabinets[0]]?.position - 1
          : Object.keys(lockerWallData).length + 1;
      } else if (position === "right") {
        newPosition = selectedCabinets
          ? lockerWallData[selectedCabinets[0]]?.position + 1
          : Object.keys(lockerWallData).length + 1;
      }
      const newLockerWallData = {
        ...Object.values(updatedModelData)?.[0],
        articleId: customData?.id ?? "",
        price: customData.price ?? 0,
        height: data.height ?? 0,
        width: data.width ?? 0,
        depth: data.depth ?? 0,
        cabinetUrl: customData?.renderCabinetBaseUrl ?? "",
        isCustom: true,
      };
      if (method === "add") {
        dispatch(appendLockerData(newLockerWallData, newPosition, position));
      } else {
        dispatch(resetLockerWall({ [`Locker_${uuidv4()}`]: newLockerWallData }));
      }

      dispatch(addCabinet({ method: "add", position: "none" }));
      const newUrl = pathName.replace("custom", "configurator");
      router.push(newUrl);
    } catch (error) {
      toast.error(error?.errors?.[0] ?? error.error ?? "Something went wrong");
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const onUpdateModel = (doorList: { number: number; value: number }[]) => {
    const updatedModelData: { [key: string]: any } = [];

    // check
    Object.keys(defaultLockerWallData.lockerWallData).forEach((key) => {
      const newDoors: { [key: string]: IDoor } = {};
      doorList.map((item) => {
        newDoors[`Door_${uuidv4()}`] = {
          ...Object.values(defaultLockerWallData.lockerWallData[key].doors)?.[0],
          height: item.value,
        };
      });
      updatedModelData[key] = {
        ...defaultLockerWallData.lockerWallData[key],
        articleId: customData?.id,
        cabinetUrl: customData?.renderCabinetBaseUrl ?? "/models/Cabinet.glb",
        doors: {
          ...newDoors,
        },
      };
    });
    setModelData(updatedModelData);
    return updatedModelData;
  };

  useEffect(() => {
    const createDoorArray = Array.from({ length: doorCount }, (_, index) => ({
      number: index,
      value: Number((doorHeight / doorCount).toFixed(2)),
    }));
    setDoorList(createDoorArray);
  }, [doorCount, doorHeight]);

  useEffect(() => {
    reset({
      doorCount: 1,
      height: +(customData.dimension?.height ?? 0),
      width: +(customData.dimension?.width ?? 0),
      depth: +(customData.dimension?.depth ?? 0),
    });
  }, [customData]);

  useEffect(() => {
    if (!initialLoaded.current) {
      initialLoaded.current = true;
    } else {
      onUpdateModel(doorList);
    }
  }, [doorList]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageContentLayout className="relative flex items-start justify-between h-full w-full">
        <div className={styles.lockerControllerWrapper}>
          <div className={styles.content}>
            <h2 className={styles.heading}>{transText?.customCabinet}</h2>
            <p className={styles.description}>{transText?.description}</p>
            <h5 className={styles.headingDimension}>{transText?.cabinetDimensions}</h5>
            <div className={styles.formWrapper}>
              <TextInput
                name={"height"}
                type="number"
                label={transText?.height}
                className={styles.formElement}
                register={register}
                errorMsg={errors.height?.message}
              />
              <TextInput
                name={"width"}
                max={customData?.cabinet?.compartments === "2" ? 1200 : 800}
                type="number"
                label={transText?.width}
                className={styles.formElement}
                register={register}
                errorMsg={errors.width?.message}
              />
              <TextInput
                name={"depth"}
                type="number"
                label={transText?.depth}
                className={styles.formElement}
                register={register}
                errorMsg={errors.depth?.message}
              />
            </div>

            <h5 className={styles.headingDimension}>{transText?.doors}</h5>
            <div className={styles.formWrapper}>
              <TextInput
                name={"doorCount"}
                register={register}
                type="number"
                label={"Door Count"}
                className={styles.formElement}
              />
            </div>
          </div>
        </div>
        <div className={styles.lockerViewWrapper}>
          <div className={styles.content}>
            <div className={styles.viewWrapper}>
              <div className={styles.propertyWrapper}>
                <h5 className={styles.heading}>{transText?.doorDimensions}</h5>
                <div className={styles.properties}>
                  {doorList?.map((_, index) => (
                    <TextInput
                      key={index}
                      name={"doorNumber"}
                      type="number"
                      label={`Door ${index + 1}`}
                      className={styles.formElement}
                      onChange={(e) => {
                        setDoorList((prev) => {
                          return prev.map((item) =>
                            item.number === index ? { number: item.number, value: +e.target.value } : item,
                          );
                        });
                      }}
                      value={doorList?.[index]?.value}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.previewWrapper}>
                <ModuleForView moduleData={modelData} />
              </div>
            </div>
            <div className={styles.buttonWrapper}>
              <Button
                label={transText?.startConfigurator}
                className={styles.button}
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </PageContentLayout>
    </form>
  );
};

export default CustomLockerView;
