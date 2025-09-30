"use client";
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/store";
import SelectWrapper from "../configurator/lockerView/selectionWrapper";
import { configuratorControlSelector, unsetSelectedDoors, unsetSelectedCabinets } from "@/store/configuratorControl";
import DownLoad from "../configurator/lockerView/_module/download";
import AppCameraControl from "../configurator/lockerView/_module/cameraControl";
import { ILockerWallItem } from "../../../utils/types";
import LockerContent from "../configurator/lockerView/lockerContent";
import { ErrorBoundaryComponent } from "@/components/ErrorBoundary";

type Props = {
  moduleData: { [key: string]: ILockerWallItem };
};

const ModuleForView: React.FC<Props> = ({ moduleData }) => {
  const dispatch = useAppDispatch();

  const [cameraControl, setCameraControl] = useState<"isRotateLeft" | "isRotateRight" | "isZoomIn" | "isZoomOut">();

  const { ambientLight, cameraValue, isCenterView, selectedDoors, selectedCabinets, selectionControl } =
    useAppSelector(configuratorControlSelector);

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
  };

  return (
    <ErrorBoundaryComponent>
      <Suspense>
        <Canvas
          performance={{ min: 0.5 }}
          camera={cameraValue}
          gl={{
            powerPreference: "high-performance",
            alpha: true,
          }}
          className="z-10"
          shadows
        >
          <SelectWrapper>
            <group onPointerMissed={onPointerMissed}>
              <LockerContent lockerWallData={moduleData} isNeedMeasureValues={false} />
            </group>
          </SelectWrapper>

          {/* Camera control */}
          <AppCameraControl
            cameraControl={cameraControl}
            setCameraControl={setCameraControl}
            enabled={
              !(selectionControl?.isGroupSelection && selectionControl?.selectionMode === "drag") && !isCenterView
            }
            zoomAble={0}
            defaultZoom={4}
          />

          {/* Environment */}
          <Environment preset="city" background={false} />
          <ambientLight intensity={ambientLight} />
          <ContactShadows position={[0, -0.03, 0]} blur={0.3} resolution={512} opacity={0.3} smooth />

          <DownLoad />
        </Canvas>
      </Suspense>
    </ErrorBoundaryComponent>
  );
};

export default ModuleForView;
