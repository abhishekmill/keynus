import React, { memo, useEffect, useRef, useState } from "react";
import { CameraControls } from "@react-three/drei";
import { useDispatch } from "react-redux";
import * as THREE from "three";

import { configuratorControlSelector, setCenterView } from "@/store/configuratorControl";
import { useAppSelector } from "@/utils/hooks/store";
import { useThree } from "@react-three/fiber";

const { DEG2RAD } = THREE.MathUtils;

type Props = {
  cameraControl: "isRotateLeft" | "isRotateRight" | "isZoomIn" | "isZoomOut" | undefined;
  setCameraControl: React.Dispatch<
    React.SetStateAction<"isRotateLeft" | "isRotateRight" | "isZoomIn" | "isZoomOut" | undefined>
  >;
  enabled?: boolean;
  zoomAble?: number;
  defaultZoom?: number;
};

const AppCameraControl: React.FC<Props> = ({
  cameraControl,
  setCameraControl,
  enabled = true,
  zoomAble = 1,
  defaultZoom = 0,
}) => {
  const [enableCamera, setEnableCamera] = useState(false);
  const cameraControlRef = useRef<any>();
  const dispatch = useDispatch();
  const { camera } = useThree();
  const { isCenterView } = useAppSelector(configuratorControlSelector);

  const handleCameraControl = (mode: "isRotateLeft" | "isRotateRight" | "isZoomIn" | "isZoomOut" | undefined) => {
    if (!enabled) {
      setEnableCamera(true);
    }

    switch (mode) {
      case "isRotateLeft":
        cameraControlRef.current?.rotate(15 * DEG2RAD, 0, true);
        break;
      case "isRotateRight":
        cameraControlRef.current?.rotate(-15 * DEG2RAD, 0, true);
        break;
      case "isZoomIn":
        cameraControlRef.current?.zoom(camera.zoom / 2, true);
        break;
      case "isZoomOut":
        cameraControlRef.current?.zoom(-camera.zoom / 2, true);
        break;
      default:
        break;
    }
    setCameraControl(undefined);

    if (!enabled) {
      setEnableCamera(false);
    }
  };

  useEffect(() => {
    cameraControlRef.current?.setPosition(1.0, 0.4, 0, false);
    cameraControlRef.current?.setTarget(0, 0.4, 0, false);
  }, []);

  useEffect(() => {
    if (defaultZoom !== 0) {
      cameraControlRef.current?.zoom(camera.zoom / defaultZoom, true);
    }
  }, [defaultZoom]);

  useEffect(() => {
    if (isCenterView && cameraControlRef.current) {
      cameraControlRef.current?.reset(true);
      cameraControlRef.current?.setPosition(1.0, 0.4, 0, true);
      cameraControlRef.current?.setTarget(0, 0.4, 0, true);
      dispatch(setCenterView(false));
    }
  }, [isCenterView]);

  useEffect(() => {
    handleCameraControl(cameraControl);
  }, [cameraControl]);

  return (
    <CameraControls
      enabled={enabled || enableCamera}
      ref={cameraControlRef}
      dollySpeed={zoomAble}
      maxPolarAngle={zoomAble === 1 ? Math.PI : Math.PI / 2}
      minPolarAngle={zoomAble === 1 ? 0 : Math.PI / 2}
    />
  );
};

export default memo(AppCameraControl);
