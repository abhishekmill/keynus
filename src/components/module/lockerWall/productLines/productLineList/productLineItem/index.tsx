"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";

import ProductSortableHeader from "../../productSortableHeaderItem";
import Icon from "../../../../../ui/Icon";
import { IArticleConfigureLockerWall, IDoor } from "../../../../../../utils/types";
import { useAppDispatch, useAppSelector } from "../../../../../../utils/hooks/store";
import {
  addDefaultCabinet,
  appendLockerData,
  configuratorSelector,
  defaultLockerWallData,
  resetLockerWall,
  updateLockerwallArticleId,
} from "../../../../../../store/configurator";
import { addCabinet, configuratorControlSelector } from "../../../../../../store/configuratorControl";
import callServerAction from "../../../../../../utils/callServerAction";
import { getArticleDetail } from "../../../../../../app/actions/article";
import { materialMap } from "../../../../../../utils/materialMap";

import styles from "./style.module.scss";
import { useSearchParams } from "next/navigation";

// CustomProducts Component

export type SortableField =
  | "categoryName"
  | "articleName"
  | "customArticleName"
  | "height"
  | "width"
  | "depth"
  | "compartments";

type Props = {
  name: string;
  projectId: string;
  lockerWallId: string;
  transText: { [key: string]: string };
  cabinets: IArticleConfigureLockerWall[];
  index: number;
};

const ProductLineItem: React.FC<Props> = ({ name, projectId, lockerWallId, transText, cabinets, index = 0 }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { lockerWallData } = useAppSelector(configuratorSelector);
  const { position, method, selectedCabinets } = useAppSelector(configuratorControlSelector);

  // const updateQuery = useCallback(
  //   (key: string, value: string) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     if (value) params.set(key, value);
  //     else params.delete(key);
  //     router.push(`?${params.toString()}`);
  //   },
  //   [router, searchParams],
  // );

  const handleSort = useCallback(
    (field: SortableField, descending: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sortProperty", field);
      params.set("isDescending", String(descending));
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const onArticleDetails = async (id: string) => {
    try {
      const res = await callServerAction(getArticleDetail, id);
      dispatch(addDefaultCabinet({ ...res.result, cabinetUrl: res.result?.renderCabinetBaseUrl }));

      const compartments = res.result?.cabinet?.compartments ?? 1;
      const columns = res.result?.cabinet?.columns ?? 1;
      const doorData: Record<string, IDoor> = {};

      console.log(compartments, columns);

      Array.from({ length: compartments / columns }).forEach((_, index) => {
        const mainDoorId = `Door_${uuidv4()}`;

        doorData[mainDoorId] = {
          type: "Normal",
          isOpened: false,
          texture: materialMap.egger_mfc[9],
          height: 120,
          accessories: {},
          separateDoors: [
            {
              isOpened: false,
              texture: materialMap.egger_mfc[9],
            },
            {
              isOpened: false,
              texture: materialMap.egger_mfc[9],
            },
          ],
        };
      });

      const baseData = {
        ...Object.values(defaultLockerWallData.lockerWallData)[0],
        doors: doorData,
        articleId: res.result?.id ?? "",
        price: res.result?.price ?? 0,
        height: Number(res.result?.dimension?.height ?? 0),
        width: Number(res.result?.dimension?.width ?? 0),
        depth: Number(res.result?.dimension?.depth ?? 0),
        cabinetUrl: res.result?.renderCabinetBaseUrl ?? "",
        hasCabinetStandardAttribute: res.result?.hasCabinetStandardAttribute ?? false,
        isCustom: false,
      };

      if (method === "add") {
        dispatch(addCabinet({ method: "add", position }));
        const base = lockerWallData[selectedCabinets?.[0]];
        const newPosition = position === "left" ? base.position - 1 : base.position + 1;
        dispatch(appendLockerData(baseData, newPosition, position));
      } else {
        dispatch(updateLockerwallArticleId(id));
        dispatch(resetLockerWall({ [Object.keys(defaultLockerWallData.lockerWallData)[0]]: baseData }));
      }

      router.push(`/projects/${projectId}/lockerwall/${lockerWallId}/configurator`);
    } catch (err) {
      console.error("Error getting article detail", err);
    }
  };

  const customCabinets = useMemo(() => cabinets.filter((c) => c.isDefaultCabinet), [cabinets]);
  const standardCabinets = useMemo(() => cabinets.filter((c) => !c.isDefaultCabinet), [cabinets]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>{name}</h2>

      <div className={styles.list}>
        {customCabinets.map((item) => (
          <Link
            key={item.id}
            href={`/projects/${projectId}/lockerwall/${lockerWallId}/custom?id=${item.id}`}
            className={styles.tr}
          >
            <span className={classNames(styles.td, styles.span3)}>
              {item.customArticleName ? item.customArticleName : item.articleName}
            </span>
            <span className={classNames(styles.td, styles.span1)}>{transText.custom}</span>
            <div className={classNames(styles.td, styles.span3)}>
              <Icon name="PlusCircle" className={styles.icon} />
            </div>
          </Link>
        ))}

        {index === 0 ? (
          <div className={styles.tHeader}>
            <div className={classNames(styles.th, styles.span3)}>
              <ProductSortableHeader
                label="Cabinet Name"
                name="articleName"
                active={searchParams.get("sortProperty") === "articleName"}
                isDescending={searchParams.get("isDescending") === "true"}
                onSort={handleSort}
              />
            </div>
            {(["height", "width", "depth", "doors"] as SortableField[]).map((key) => (
              <div className={classNames(styles.th, styles.span1)} key={key}>
                <ProductSortableHeader
                  label={transText[key] || key}
                  name={key}
                  active={searchParams.get("sortProperty") === key}
                  isDescending={searchParams.get("isDescending") === "true"}
                  onSort={handleSort}
                />
              </div>
            ))}

            <div className={classNames(styles.th, styles.span1)}>Article Number</div>
          </div>
        ) : (
          <div className={styles.tHeader}>
            <div className={classNames(styles.th, styles.span3)}>Cabinet Name</div>
            {(["height", "width", "depth", "doors"] as SortableField[]).map((key) => (
              <div className={classNames(styles.th, styles.span1)} key={key}>
                {transText[key] || key}
              </div>
            ))}
          </div>
        )}

        {standardCabinets.length === 0 ? (
          <div className={styles.emptyState}>No articles found matching your criteria.</div>
        ) : (
          standardCabinets.map((item) => (
            <div key={item.id} role="button" onClick={() => onArticleDetails(item.id)} className={styles.tr}>
              <div className={classNames(styles.td, styles.span3)}>
                {item.customArticleName ? item.customArticleName : item.articleName}
              </div>
              <div className={classNames(styles.td, styles.span1)}>
                {item.articleAllAttributeValuesResult?.height} mm
              </div>
              <div className={classNames(styles.td, styles.span1)}>
                {item.articleAllAttributeValuesResult?.width} mm
              </div>
              <div className={classNames(styles.td, styles.span1)}>
                {item.articleAllAttributeValuesResult?.depth} mm
              </div>
              <div className={classNames(styles.td, styles.span1)}>
                {item.articleAllAttributeValuesResult?.compartments}
              </div>
              <div className={classNames(styles.td, styles.span1)}>{item.articleNumber}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductLineItem;
