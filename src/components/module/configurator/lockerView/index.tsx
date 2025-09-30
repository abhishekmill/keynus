"use client";

import React, { Suspense, memo, useEffect, useRef, useState } from "react";
import { Canvas, Vector3 } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Preload, useProgress } from "@react-three/drei";
import { Object3D, Object3DEventMap } from "three";
import { Provider } from "react-redux";
import classNames from "classnames";
import gsap from "gsap";
import dynamic from "next/dynamic";

import AppCameraControl from "./_module/cameraControl";
import ConfiguratorCameraControlPanel from "../cameraControlPanel";

const DownLoad = dynamic(() => import("./_module/download"), {
  ssr: false,
});
const GroupDragSelection = dynamic(() => import("./_module/groupDragSelection"), {
  ssr: false,
});
const LoadingScreen = dynamic(() => import("../../../pages/configurator/loading"), {
  ssr: false,
});
const QuickMenu = dynamic(() => import("../quickMenu"), {
  ssr: false,
});
const SelectWrapper = dynamic(() => import("./selectionWrapper"), {
  ssr: false,
});
const LockerContent = dynamic(() => import("./lockerContent"), {
  ssr: false,
});

const EmptyContent = dynamic(() => import("./_module/emptyContent"), {
  ssr: false,
});

import {
  configuratorControlSelector,
  setAddNewHistory,
  setSelectedDoors,
  setSelectedCabinets,
  unsetSelectedDoors,
  unsetSelectedCabinets,
} from "@/store/configuratorControl";
import { configuratorSelector, resetLockerWall, setDefaultCabinet } from "@/store/configurator";
import { extractParent } from "@/utils/functions/three";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/store";
import { IGetLockerWall } from "../../../../utils/types";
import { setAccessoriesData } from "../../../../store/accessories";
import useConfirmTabClose from "../../../../utils/hooks/useConfirmTabClose";

import styles from "./styles.module.scss";
import { ErrorBoundaryComponent } from "@/components/ErrorBoundary";

type Props = {
  transText?: { [key: string]: string };
  serverLockerwallData: IGetLockerWall;
};

const LockerView: React.FC<Props> = ({ serverLockerwallData, transText }) => {
  const dispatch = useAppDispatch();
  const { progress } = useProgress();

  const loadingRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const [point, setPoint] = useState<Vector3>([0, 0, 0]);
  const [cameraControl, setCameraControl] = useState<"isRotateLeft" | "isRotateRight" | "isZoomIn" | "isZoomOut">();
  const [firstLoadingStatus, setFirstLoadingStatus] = useState(true);
  const [measureValues, setMeasureValues] = useState({
    height: 0,
    width: 0,
    depth: 0,
  });
  const beforeCabinetWidth = useRef<{ id: string; totalWidth: number }[]>([{ id: "0", totalWidth: 0 }]);

  const { lockerWallData, historicalTimestamp } = useAppSelector(configuratorSelector);
  const { ambientLight, cameraValue, isCenterView, selectedDoors, selectedCabinets, selectionControl, method } =
    useAppSelector(configuratorControlSelector);

  /**
   * Confirm when tab close
   */
  useConfirmTabClose(true);

  /**
   * Select a lockerwall item, show quick menu when single selection
   * @param point three js point
   * @param name selected item name
   */
  const onLockerClick = (point: Vector3, name: string) => {
    if (!selectionControl.isGroupSelection) {
      setPoint(point);
      setShown(true);
      dispatch(setSelectedCabinets([name]));
    } else {
      if (selectionControl.selectionMode === "click" && selectionControl.selectionType === "cabinet") {
        const newSelectedLockers = selectedCabinets.includes(name)
          ? selectedCabinets.filter((item) => item !== name)
          : [...selectedCabinets, name];
        dispatch(setSelectedCabinets(newSelectedLockers));
      }
    }
  };

  /**
   * Deselect item when click outside of lockerwall
   * @param event Mouse click event
   */
  const onPointerMissed = (event: MouseEvent) => {
    event.stopImmediatePropagation();
    if (selectedCabinets.length > 0) {
      dispatch(unsetSelectedCabinets());
    }
    if (selectedDoors.length > 0) {
      dispatch(unsetSelectedDoors());
    }
    setShown(false);
  };

  /**
   * Handle drag group selection
   * @param objects Selected 3D objects
   */
  const handleDragGroupSelection = (objects: Object3D<Object3DEventMap>[]) => {
    if (selectionControl.selectionType === "cabinet") {
      const selectedCabinets = objects
        .filter((obj) => obj.type === "Mesh" && obj.name !== "Text")
        .map((obj) => {
          const parent = extractParent(obj, "Locker");
          return parent?.name;
        })
        .filter((item) => item);
      const names = Array.from(new Set(selectedCabinets));
      dispatch(setSelectedCabinets(names as string[]));
    } else if (selectionControl.selectionType === "door") {
      const selectedDoors = objects
        .filter((obj) => obj.type === "Mesh" && obj.name !== "Text")
        .map((obj) => {
          const parent = extractParent(obj, "Door");
          return parent?.name;
        })
        .filter((item) => item);
      const names = Array.from(new Set(selectedDoors));
      dispatch(setSelectedDoors(names as string[]));
    }
  };

  /**
   * Save history for redo, undo action
   */
  useEffect(() => {
    if (lockerWallData && !historicalTimestamp) {
      dispatch(setAddNewHistory(lockerWallData));
    }

    let totalWidth = 0;
    let maxHeight = 0;
    let maxDepth = 0;

    Object.values(lockerWallData).forEach((item) => {
      totalWidth += item.width;
      if (item.height > maxHeight) {
        maxHeight = item.height;
      }
      if (item.depth > maxDepth) {
        maxDepth = item.depth;
      }
    });

    setMeasureValues({
      height: maxHeight,
      width: totalWidth,
      depth: maxDepth,
    });
  }, [lockerWallData]);

  useEffect(() => {
    if (progress === 100 && loadingRef?.current) {
      gsap.to(loadingRef.current, {
        duration: 0.5,
        opacity: 0,
        delay: 1.5,
        onComplete: () => setFirstLoadingStatus(false),
      });
    }
  }, [progress]);

  useEffect(() => {
    if (method === "reset") {
      if (!!serverLockerwallData && !!serverLockerwallData?.configuration3DJson) {
        dispatch(resetLockerWall(JSON.parse(serverLockerwallData.configuration3DJson)));
      }
      if (!!serverLockerwallData?.configurations && serverLockerwallData?.configurations?.length > 0) {
        dispatch(
          setDefaultCabinet({
            data: serverLockerwallData.configurations.map((item) => ({
              ...item.keyniusPIMArticle,
              id: item.keyniusPIMArticleId,
            })),
          }),
        );
      }
      if (serverLockerwallData.accessories) {
        dispatch(setAccessoriesData(serverLockerwallData.accessories));
      }
    }
  }, [serverLockerwallData]);

  return (
    <div className={styles.wrapper}>
      <div ref={loadingRef}>
        {firstLoadingStatus && Object.keys(lockerWallData)?.length > 0 && (
          <div className={classNames(styles.loadingWrapper)}>
            <LoadingScreen transText={transText} />
          </div>
        )}
      </div>
      {Object.keys(lockerWallData)?.length > 0 ? (
        <ErrorBoundaryComponent>
          <Suspense>
            <Canvas
              performance={{ min: 0.5 }}
              camera={cameraValue}
              gl={{
                powerPreference: "high-performance",
                alpha: true,
              }}
              className="bg-gray z-10"
              shadows
            >
              <SelectWrapper>
                <group onPointerMissed={onPointerMissed}>
                  <LockerContent
                    lockerWallData={lockerWallData}
                    beforeCabinetWidth={beforeCabinetWidth}
                    measureValues={measureValues}
                    onLockerClick={onLockerClick}
                  />
                </group>
              </SelectWrapper>

              {/* Camera control */}
              <AppCameraControl
                cameraControl={cameraControl}
                setCameraControl={setCameraControl}
                enabled={
                  !(selectionControl?.isGroupSelection && selectionControl?.selectionMode === "drag") && !isCenterView
                }
              />

              {/* Environment */}
              <Environment preset="city" background={false} />
              <ambientLight intensity={ambientLight} />
              <ContactShadows position={[0, -0.03, 0]} blur={0.3} resolution={512} opacity={0.3} smooth />

              {/* Group selection by mouse dragging */}
              {selectionControl.isGroupSelection && selectionControl.selectionMode === "drag" && (
                <GroupDragSelection onSelectionChanged={handleDragGroupSelection} />
              )}

              {/* Quick menu when click on locker wall */}
              <Html position={point}>
                <Provider store={store}>
                  <QuickMenu
                    open={shown}
                    onClose={() => setShown(false)}
                    transText={transText}
                    beforeCabinetWidth={beforeCabinetWidth}
                  />
                </Provider>
              </Html>
              <DownLoad />
              <Preload all />
            </Canvas>
            <ConfiguratorCameraControlPanel setCameraControl={setCameraControl} transText={transText} />
          </Suspense>
        </ErrorBoundaryComponent>
      ) : (
        <EmptyContent transText={transText} />
      )}
    </div>
  );
};

export default memo(LockerView);
