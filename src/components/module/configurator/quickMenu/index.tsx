"use client";

import React, { Fragment, memo } from "react";
import Tooltip from "rc-tooltip";
import classNames from "classnames";
import { Transition } from "@headlessui/react";

import Icon from "../../../ui/Icon";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks/store";
import { appendLockerData, configuratorSelector, removeLockerData } from "../../../../store/configurator";
import {
  addCabinet,
  configuratorControlSelector,
  unsetSelectedCabinets,
  updateIsGoToLockerwallPage,
} from "../../../../store/configuratorControl";
import { accessoriesSelector, removeSidePanelOfAccessories, setAccessoriesData } from "../../../../store/accessories";
import { ISideAccessoriesType } from "../../../../utils/types";

import styles from "./style.module.scss";

type Props = {
  open?: boolean;
  onClose?: () => void;
  transText?: { [key: string]: string };
  beforeCabinetWidth: React.MutableRefObject<
    {
      id: string;
      totalWidth: number;
    }[]
  >;
};
// tooltip Component and quick menu

const QuickMenu: React.FC<Props> = ({ open = true, transText, onClose = () => {}, beforeCabinetWidth }) => {
  const dispatch = useAppDispatch();

  const { lockerWallData } = useAppSelector(configuratorSelector);
  const { selectedCabinets } = useAppSelector(configuratorControlSelector);
  const { accessoriesData } = useAppSelector(accessoriesSelector);

  /**
   * Remove locker
   * @param e Button event
   */
  const removeLocker = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (selectedCabinets.length === 1) {
      const doorData = lockerWallData?.[selectedCabinets?.[0]]?.doors;
      if (doorData) {
        let originAccessories: any = accessoriesData;
        Object.values(doorData).forEach((doorItem) => {
          const accessoriesKeys = Object.keys(doorItem.accessories);
          accessoriesKeys.forEach((key: any) => {
            const selectedId = doorItem?.accessories?.[key as ISideAccessoriesType]?.id;
            const updatedData = accessoriesData.find((item) => item?.keyniusPIMArticleId === selectedId);
            if (updatedData) {
              originAccessories = [
                ...originAccessories.filter((item: any) => item?.keyniusPIMArticleId !== selectedId),
                ...(updatedData?.quantity !== 1 ? [{ ...updatedData, quantity: updatedData?.quantity - 1 }] : []),
              ];
            }
          });
        });
        dispatch(setAccessoriesData(originAccessories));
      }
      const sidePanelData = lockerWallData[selectedCabinets[0]]?.sidePanel;
      if (sidePanelData) {
        dispatch(removeSidePanelOfAccessories(sidePanelData?.id ?? ""));
      }
      dispatch(removeLockerData(selectedCabinets[0]));
      dispatch(unsetSelectedCabinets());
      beforeCabinetWidth.current = beforeCabinetWidth.current.filter((item) => item.id !== selectedCabinets[0]);
      onClose();
    }
  };

  /**
   * Remove locker
   * @param e Button event
   */
  const appendLocker = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, direction: "left" | "right") => {
    e.stopPropagation();

    if (selectedCabinets.length !== 1) return;
    let newPosition = 0;
    if (direction === "left") {
      newPosition = lockerWallData[selectedCabinets[0]].position - 1;
    } else if (direction === "right") {
      newPosition = lockerWallData[selectedCabinets[0]].position + 1;
    }
    const doorData = lockerWallData?.[selectedCabinets?.[0]]?.doors;
    if (doorData) {
      let originAccessories = accessoriesData;
      Object.values(doorData).forEach((doorItem) => {
        const accessoriesKeys = Object.keys(doorItem.accessories);
        accessoriesKeys.forEach((key: any) => {
          const selectedId = doorItem?.accessories?.[key as ISideAccessoriesType]?.id;
          const updatedData = accessoriesData.find((item) => item?.keyniusPIMArticleId === selectedId);
          if (updatedData) {
            originAccessories = [
              ...originAccessories.filter((item: any) => item?.keyniusPIMArticleId !== selectedId),
              { ...updatedData, quantity: updatedData?.quantity + 1 },
            ];
          }
        });
      });
      dispatch(setAccessoriesData(originAccessories));
    }
    dispatch(appendLockerData(lockerWallData[selectedCabinets[0]], newPosition, direction));
  };

  const onAppendStandardCabinet = (direction: "left" | "right") => {
    dispatch(addCabinet({ method: "add", position: direction }));
    dispatch(updateIsGoToLockerwallPage(true));
  };

  const onAppendCustomCabinet = (direction: "left" | "right") => {
    dispatch(addCabinet({ method: "add", position: direction }));
    dispatch(updateIsGoToLockerwallPage(true));
  };

  return (
    <Transition
      show={open}
      as={Fragment}
      enter="transition-all duration-300"
      enterFrom="opacity-0 -rotate-180 scale-0"
      enterTo="opacity-100 rotate-0 scale-100"
      leave="transition-all duration-300"
      leaveFrom="opacity-100 rotate-0 scale-100"
      leaveTo="opacity-0 -rotate-180 scale-0"
    >
      <div className={styles.dialog}>
        <Tooltip placement="top" trigger={["hover"]} overlay={<span>{transText?.removeCabinet}</span>}>
          <button
            type="button"
            disabled={Object.keys(lockerWallData).length <= 1}
            onClick={removeLocker}
            className={classNames(styles.button, styles.top)}
          >
            <Icon name="Trash" className={styles.icon} />
          </button>
        </Tooltip>
        <Tooltip placement="left" trigger={["hover"]} overlay={<span>{transText?.addStandardCabinetToLeft}</span>}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAppendStandardCabinet("left");
            }}
          >
            <div className={classNames(styles.button, styles.topLeft)}>
              <Icon name="Plus" className={styles.icon} />
            </div>
          </button>
        </Tooltip>
        <Tooltip placement="left" trigger={["hover"]} overlay={<span>{transText?.duplicateCurrentCabinetToLeft}</span>}>
          <button
            type="button"
            onClick={(e) => appendLocker(e, "left")}
            className={classNames(styles.button, styles.left)}
          >
            <Icon name="DocumentDuplicate" className={styles.icon} />
          </button>
        </Tooltip>
        <Tooltip placement="left" trigger={["hover"]} overlay={<span>{transText?.addCustomCabinetToLeft}</span>}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAppendCustomCabinet("left");
            }}
            className={classNames(styles.button, styles.bottomLeft)}
          >
            <Icon name="CogPlus" className={styles.icon} />
          </button>
        </Tooltip>
        <Tooltip placement="right" trigger={["hover"]} overlay={<span>{transText?.addCustomCabinetToRight}</span>}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAppendCustomCabinet("right");
            }}
            className={classNames(styles.button, styles.bottomRight)}
          >
            <Icon name="CogPlus" className={styles.icon} />
          </button>
        </Tooltip>
        <Tooltip
          placement="right"
          trigger={["hover"]}
          overlay={<span>{transText?.duplicateCurrentCabinetToRight}</span>}
        >
          <button
            type="button"
            onClick={(e) => appendLocker(e, "right")}
            className={classNames(styles.button, styles.right)}
          >
            <Icon name="DocumentDuplicate" className={styles.icon} />
          </button>
        </Tooltip>
        <Tooltip placement="right" trigger={["hover"]} overlay={<span>{transText?.addStandardCabinetToRight}</span>}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAppendStandardCabinet("right");
            }}
            className={classNames(styles.button, styles.topRight)}
          >
            <Icon name="Plus" className={styles.icon} />
          </button>
        </Tooltip>
        <div className={styles.ring}></div>
      </div>
    </Transition>
  );
};

export default memo(QuickMenu);
