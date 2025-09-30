"use client";
import React from "react";

import Button from "../../../ui/button";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks/store";
import { configuratorControlSelector, setCenterView } from "../../../../store/configuratorControl";
import Tooltip from "../../../ui/Tooltip";

import styles from "./style.module.scss";

type Props = {
  setCameraControl: React.Dispatch<
    React.SetStateAction<"isRotateLeft" | "isRotateRight" | "isZoomIn" | "isZoomOut" | undefined>
  >;
  transText?: { [key: string]: string };
};

const ConfiguratorCameraControlPanel: React.FC<Props> = ({ setCameraControl, transText }) => {
  const { showCameraControlPanel } = useAppSelector(configuratorControlSelector);
  const dispatch = useAppDispatch();

  /**
   * Rotate camera to left
   */
  const rotateLeft = () => {
    setCameraControl("isRotateLeft");
  };

  /**
   * Rotate camera to right
   */
  const rotateRight = () => {
    setCameraControl("isRotateRight");
  };

  /**
   * Zoom in camera
   */
  const zoomOut = () => {
    setCameraControl("isZoomOut");
  };

  /**
   * Zoom out camera
   */
  const zoomIn = () => {
    setCameraControl("isZoomIn");
  };

  const onCenterView = () => {
    dispatch(setCenterView(true));
  };

  return (
    showCameraControlPanel && (
      <div className={styles.wrapper}>
        <div className={styles.contents}>
          <Tooltip message={transText?.turnLeft} position="top">
            <Button icon="ArrowCurveLeft" onClick={rotateLeft} />
          </Tooltip>
          <Tooltip message={transText?.turnRight} position="top">
            <Button icon="ArrowCurveRight" onClick={rotateRight} />
          </Tooltip>
          <Tooltip message={transText?.zoomOut} position="top">
            <Button icon="Minus" onClick={zoomOut} />
          </Tooltip>
          <Tooltip message={transText?.zoomIn} position="top">
            <Button icon="Plus" onClick={zoomIn} />
          </Tooltip>
          <Tooltip message={transText?.resetView} position="top">
            <Button icon="Eye" onClick={onCenterView} />
          </Tooltip>
        </div>
      </div>
    )
  );
};

export default ConfiguratorCameraControlPanel;
