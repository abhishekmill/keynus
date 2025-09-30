"use client";

import React, { memo, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import dynamic from "next/dynamic";

import { ILockerWallItem } from "../../../../../utils/types";
import { configuratorControlSelector } from "../../../../../store/configuratorControl";
import { useAppSelector } from "../../../../../utils/hooks/store";

const Locker = dynamic(() => import("./locker"), {
  ssr: false,
});
type Props = {
  lockerWallData: {
    [key: string]: ILockerWallItem;
  };
  beforeCabinetWidth?: React.MutableRefObject<
    {
      id: string;
      totalWidth: number;
    }[]
  >;
  measureValues?: {
    height: number;
    width: number;
    depth: number;
  };
  // eslint-disable-next-line no-unused-vars
  onLockerClick?: (point: Vector3, name: string) => void;
  isNeedMeasureValues?: boolean;
  setCameraDisable?: React.Dispatch<React.SetStateAction<boolean>>;
};

const LockerContent: React.FC<Props> = ({
  lockerWallData,
  beforeCabinetWidth = { current: [] },
  measureValues = {
    height: 0,
    width: 0,
    depth: 0,
  },
  onLockerClick = () => {},
  isNeedMeasureValues = true,
}) => {
  const { nodes } = useGLTF("/models/KLogo.glb");

  const { roughness, selectedCabinets } = useAppSelector(configuratorControlSelector);
  const sortedLockerWallData = useMemo(
    () => Object.keys(lockerWallData).sort((a, b) => lockerWallData[a].position - lockerWallData[b].position),
    [lockerWallData],
  );

  return (
    <>
      {sortedLockerWallData.map((key: string, i: number) => (
        <Locker
          name={key}
          key={i}
          lockerPosition={i}
          data={lockerWallData[key]}
          lockerWallData={lockerWallData}
          lockerWallDataLength={Object.keys(lockerWallData).length}
          beforeCabinetWidth={beforeCabinetWidth}
          roughness={roughness}
          selected={selectedCabinets.includes(key)}
          measureValues={measureValues}
          isNeedMeasureValues={isNeedMeasureValues}
          onLockerClick={(point) => {
            onLockerClick(point, key);
          }}
          modelUrl={
            lockerWallData[key]?.cabinetUrl?.length > 0
              ? lockerWallData[key]?.cabinetUrl
              : "/models/oneSteelCabinet.glb"
          }
          kLogoNodes={nodes}
        />
      ))}
    </>
  );
};

useGLTF.preload("/models/KLogo.glb");

export default memo(LockerContent);
