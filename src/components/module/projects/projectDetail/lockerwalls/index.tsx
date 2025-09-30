"use client";

import React, { useEffect } from "react";

import CustomDisclosure from "@/components/ui/disclosure";
import LockerwallList from "../_modules/lockerwallList";
import { INumbering, IProjectData } from "@/utils/types";
import { useAppDispatch, useAppSelector } from "../../../../../utils/hooks/store";
import { projectSelector, setDiscountStatus, setProjectPrice } from "../../../../../store/app";

import styles from "./style.module.scss";

type Props = {
  project: IProjectData;
  transText: { [key: string]: string };
  lockerWallTransText: { [key: string]: string };
  articlePrice: number;
  numberingArticleList: INumbering[];
};

const ProjectLockerWalls: React.FC<Props> = ({
  project,
  lockerWallTransText,
  articlePrice = 0,
  transText,
  numberingArticleList,
}) => {
  const { discountStatus } = useAppSelector(projectSelector);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (discountStatus !== project.isDiscountPercentageEnable)
      dispatch(setDiscountStatus(project.isDiscountPercentageEnable));
  }, [project]);

  useEffect(() => {
    const lockerTotalPrice =
      (project.keyniusProjectLockerWalls ?? [])
        .map((row) =>
          row.articles?.map((item) => {
            return Number(
              ((item?.amount ?? 0) * (item?.pricePerUnit ?? 0) * (1 - (item?.discount ?? 0) / 100)).toFixed(2),
            );
          }),
        )
        .flat(2)
        .reduce((total = 0, price) => total + (price ?? 0), 0) ?? 0;

    dispatch(
      setProjectPrice({
        lockerwall: lockerTotalPrice,
        article: articlePrice,
      }),
    );
  }, [project.keyniusProjectLockerWalls, articlePrice]);
  return (
    <CustomDisclosure title={transText?.Lockerwalls} buttonStyle={styles.button} defaultOpen>
      <div className={styles.wallsWrapper}>
        {project?.keyniusProjectLockerWalls && project.keyniusProjectLockerWalls?.length > 0 ? (
          <LockerwallList
            lockerwallList={project?.keyniusProjectLockerWalls}
            numberingArticleList={numberingArticleList}
            currency={project?.currancy}
            transText={lockerWallTransText}
          />
        ) : (
          <div className={styles.blankDataWrapper}>
            <div className={styles.message}>{transText?.emptyLockerWall}</div>
          </div>
        )}
      </div>
    </CustomDisclosure>
  );
};

export default ProjectLockerWalls;
