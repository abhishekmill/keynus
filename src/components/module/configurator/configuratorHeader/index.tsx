"use client";

import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import AppConfirmModal from "../../_basic/confirmModal";
import AppContainer from "../../_basic/container";
import Button from "../../../ui/button";
import DimensionPopUp from "./dimensionsPopup";
import Dropdown from "../../../ui/dropdown";
import Icon, { IconType } from "../../../ui/Icon";
import SaveImagePopup from "./saveImagePopup";
import Tooltip from "../../../ui/Tooltip";
import UpdateLockerwallModal from "./updateLockerwallModal";
import callServerAction from "../../../../utils/callServerAction";
import { IGetLockerWall, ILockerWallItem } from "../../../../utils/types";
import {
  configuratorControlSelector,
  setSelectionControl,
  unsetSelectedObjects,
  updateHistory,
  updateIsGoToLockerwallPage,
} from "@/store/configuratorControl";
import { saveLockerwallConfiguration } from "../../../../app/actions/configurator";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/store";
import { usePathname } from "../../../../navigation";
import {
  configuratorSelector,
  resetLockerWall,
  setCurrency,
  setHistoricalTimestamp,
  setLockerwallSaved,
  updateAvailableImageSave,
} from "@/store/configurator";
import { createNewLockerwall, deleteLockerwall } from "../../../../app/actions/lockerwall";
import { accessoriesSelector } from "../../../../store/accessories";
import { revalidatePath } from "../../../../utils/cookie";

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
  lockerWallId: string;
  serverLockerwallData: IGetLockerWall;
};

const ConfiguratorHeader: React.FC<Props> = ({ transText, lockerWallId, serverLockerwallData }) => {
  const router = useRouter();
  const pathName = usePathname();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { history, configurationMode, isGoToLockerwallPage, selectionControl } =
    useAppSelector(configuratorControlSelector);
  const { accessoriesData } = useAppSelector(accessoriesSelector);
  const { historicalTimestamp, lockerWallData, lockerWallImage, isLockerWallSaved } =
    useAppSelector(configuratorSelector);

  const isSavedLockerwall = useRef<boolean>(false);
  const initialLoad = useRef<boolean>(false);
  const changedLockerwall = useRef<boolean>(false);
  // const [changedLockerwall, setChangedLockerwall] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [requiredSave, setRequiredSave] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [tooltipCenter, setTooltipCenter] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveCancelLoading, setSaveCancelLoading] = useState(false);

  const onSaveToServer = async () => {
    setSaveLoading(true);
    let jsonData: { [key: string]: ILockerWallItem } = {};
    let configuratorData: any = [];
    if (!lockerWallId) {
      toast.error("Something went wrong.");
      setSaveLoading(false);
      return;
    }

    Object.keys(lockerWallData).forEach((key) => {
      jsonData[key] = lockerWallData[key];
      const findPosition = configuratorData.findIndex(
        (item: any) => item.keyniusPimArticleId === lockerWallData[key]?.articleId,
      );
      if (findPosition !== -1) {
        configuratorData[findPosition].quantity += 1;
      } else {
        configuratorData.push({
          keyniusPimArticleId: lockerWallData[key]?.articleId,
          isCustom: lockerWallData[key]?.isCustom,
          columns: 1,
          compartment: Object.keys(lockerWallData[key].doors).length,
          doorType: "none",
          quantity: 1,
        });
      }
    });

    try {
      if (configurationMode === "copy") {
        const res = await callServerAction(createNewLockerwall, {
          name: serverLockerwallData.lockerWallName,
          floor: serverLockerwallData.floor,
          category: serverLockerwallData?.lockCategoryId,
          type: serverLockerwallData?.lockTypeId,
          notes: serverLockerwallData.notes,
          projectId: serverLockerwallData.keyniusProjectId,
        });
        if (!res?.result?.id) {
          toast.error("We can't get lockerwall Id. Please try again");
          return;
        } else {
          await callServerAction(saveLockerwallConfiguration, {
            keyniusProjectLockerwallId: res.result.id,
            configuration3DJson: JSON.stringify(jsonData),
            configurations: configuratorData,
            accessories: accessoriesData,
            imageBase64: lockerWallImage,
          });
        }
      } else {
        await callServerAction(saveLockerwallConfiguration, {
          keyniusProjectLockerwallId: lockerWallId,
          configuration3DJson: JSON.stringify(jsonData),
          configurations: configuratorData,
          accessories: accessoriesData,
          imageBase64: lockerWallImage,
        });
      }
      revalidatePath(`/projects/${params.id}`);
      dispatch(setLockerwallSaved(false));
      changedLockerwall.current = true;
      toast.success(`Lockerwall ${configurationMode === "copy" ? "copied" : "updated"} successfully.`);
      if (isSavedLockerwall.current) {
        isSavedLockerwall.current = false;
        router.replace(`/projects/${params.id}`);
        router.refresh();
      }
    } catch (error) {
      console.error("error: ", error);
      toast.error(error.error ?? error.errors?.[0] ?? "Something went wrong");
    }
    setSaveLoading(false);
    setShowSaveConfirmModal(false);
  };

  const onCancelSave = async () => {
    setSaveCancelLoading(true);
    if (!serverLockerwallData?.configuration3DJson && !changedLockerwall.current) {
      try {
        await callServerAction(deleteLockerwall, serverLockerwallData.id);
        revalidatePath(`/projects/${params.id}`);
      } catch (error) {
        console.error("error: ", error);
      }
    }
    router.push(`/projects/${params.id}`);
  };

  useEffect(() => {
    if (!!isLockerWallSaved) {
      setShowSaveConfirmModal(true);
      onSaveToServer();
    }
  }, [isLockerWallSaved]);

  useEffect(() => {
    if (isGoToLockerwallPage) {
      dispatch(updateIsGoToLockerwallPage(false));
      const customUrl = pathName.split("/").slice(0, -1).join("/").concat("/list");
      router.push(customUrl);
    }
  }, [isGoToLockerwallPage]);

  useEffect(() => {
    if (!!selectionControl.isGroupSelection) {
      dispatch(setSelectionControl({ ...selectionControl, isGroupSelection: false }));
    }
    dispatch(setCurrency(serverLockerwallData?.currency));
    if (!!window && window.screen.width > 1600) {
      setTooltipCenter(true);
    }
  }, []);

  /**
   * Set camera view to center
   */

  /**
   * Redo
   */
  const onRedo = () => {
    dispatch(unsetSelectedObjects());

    let index = 1;
    if (history.length > 2) {
      if (historicalTimestamp === undefined) {
        index = history.length - 1;
      } else {
        const currentIndex = history.findIndex((item) => item.timeStamp === historicalTimestamp);
        if (currentIndex < history.length - 1) {
          index = currentIndex + 1;
        } else {
          index = history.length - 1;
        }
      }
    }
    dispatch(resetLockerWall(history[index].data));
    dispatch(setHistoricalTimestamp(history[index].timeStamp));
  };

  /**
   * Undo
   */
  const onUndo = () => {
    dispatch(unsetSelectedObjects());
    let index = 1;

    if (history.length > 2) {
      if (historicalTimestamp === undefined) {
        index = history.length - 1;
      } else {
        const currentIndex = history.findIndex((item) => item.timeStamp === historicalTimestamp);
        if (currentIndex > 1) {
          index = currentIndex - 1;
        }
      }
    }
    dispatch(resetLockerWall(history[index].data));
    dispatch(setHistoricalTimestamp(history[index].timeStamp));
  };

  const onreset = () => {
    dispatch(updateHistory([history?.[0], history?.[1]]));
    dispatch(resetLockerWall(history?.[1]?.data ?? history?.[0]?.data));
  };

  useEffect(() => {
    const handler = setTimeout(() => (initialLoad.current = true), 2000);
    return () => {
      clearTimeout(handler);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <AppContainer className={styles.containerWrapper}>
        <div className={styles.buttonGroup}>
          <Tooltip message={transText?.backToProjectPage} position={tooltipCenter ? "bottom" : "bottomLeft"}>
            <Button
              icon={"ArrowLeft"}
              onClick={() => {
                // if (!!changedLockerwall) {
                setRequiredSave(true);
                // } else {
                //   router.replace(`/projects/${params.id}`);
                //   router.refresh();
                // }
              }}
            />
          </Tooltip>
        </div>
        <div className={styles.buttonGroup}>
          <Tooltip message={transText?.unDo} position="bottom">
            <Button icon="ArrowUturnLeft" color="primary" onClick={onUndo} disabled={history.length < 0} />
          </Tooltip>
          <Tooltip message={transText?.reDo} position="bottom">
            <Button icon="ArrowUturnRight" color="primary" onClick={onRedo} disabled={history.length < 0} />
          </Tooltip>
          <Tooltip message={transText?.reset} position="bottom">
            <Button
              icon="ArrowCircle"
              color="lightDanger"
              onClick={() => {
                setShowResetConfirmModal(true);
              }}
            />
          </Tooltip>
        </div>
        <div className={styles.saveAction}>
          <div className={styles.buttonGroup}>
            <Tooltip message={transText?.dimension} position="bottom">
              <Dropdown panel={<DimensionPopUp transText={transText} />}>
                <div className={styles.itemButton}>
                  <Icon name={"CubeTransparent"} className={styles.icon} />
                </div>
              </Dropdown>
            </Tooltip>
          </div>
          <div className={classNames(styles.buttonGroup, styles.save)}>
            {[
              {
                label: "Save Lockerwall",
                icon: "Save",
                type: "button",
              },
              {
                label: "Save Image",
                icon: "Photo",
                type: "dropdown",
              },
            ].map((item) => (
              <div key={item.label}>
                {item.type === "button" ? (
                  <Tooltip message={transText?.save} position="bottom">
                    <Button
                      key={item.label}
                      icon={item.icon as IconType}
                      onClick={() => {
                        setShowSaveConfirmModal(true);
                      }}
                    />
                  </Tooltip>
                ) : (
                  <>
                    <Tooltip message={transText?.export} position="bottom">
                      <Dropdown panel={<SaveImagePopup transText={transText} />}>
                        <div className={styles.itemButton}>
                          <Icon name={item.icon as IconType} className={styles.icon} />
                        </div>
                      </Dropdown>
                    </Tooltip>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </AppContainer>
      <AppConfirmModal
        title={transText?.saveLockerwall}
        isOpen={showSaveConfirmModal}
        setIsOpen={setShowSaveConfirmModal}
        onOk={() => {
          dispatch(updateAvailableImageSave(true));
        }}
        transText={transText}
        confirmLoading={saveLoading}
      />
      <AppConfirmModal
        title={transText?.resetLockerwall}
        isOpen={showResetConfirmModal}
        setIsOpen={setShowResetConfirmModal}
        onOk={() => onreset()}
        transText={transText}
      />
      <AppConfirmModal
        title={transText?.wantToSaveLockerWall}
        isOpen={requiredSave}
        setIsOpen={setRequiredSave}
        cancelLoading={saveCancelLoading}
        hasCancelFunction={true}
        onOk={() => {
          isSavedLockerwall.current = true;
          dispatch(updateAvailableImageSave(true));
        }}
        onCancel={() => onCancelSave()}
        transText={transText}
      />
      <UpdateLockerwallModal open={showUpdateModal} setOpen={setShowUpdateModal} transText={transText} />
    </div>
  );
};

export default ConfiguratorHeader;
