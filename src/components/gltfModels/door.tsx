"use client";
import React, { Fragment, memo, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Select } from "@react-three/postprocessing";
import { useTexture } from "@react-three/drei";
import { toast } from "react-toastify";
import { Material } from "three";

import { IAccessoriesType, IDoor, INodes } from "@/utils/types";
import { configuratorControlSelector, setSelectedDoors } from "@/store/configuratorControl";
import { resetLockerWall } from "../../store/configurator";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/store";
import { doorLeftValue, doorRefXPosition, doorRefZPosition } from "../../utils/constant";
import Accessories from "./accessories";

type TProps = {
  nodes: INodes;
  name: string;
  doorName: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: boolean;
  textureUrl: string;
  roughness?: number;
  pinPosition: number;
  doorData: IDoor;
  availableAddAccessories: boolean;
  setAvailableAddAccessories: React.Dispatch<React.SetStateAction<boolean>>;
  yStartPos: number;
  yEndPos: number;
  materials: {
    [name: string]: Material;
  };
  cabinetBottomWidth: number;
  cabinetWidth: number;
  modelType: string;
};

const Door: React.FC<TProps> = ({
  nodes,
  name,
  doorName,
  position,
  scale,
  rotation,
  textureUrl,
  roughness = 0.18,
  pinPosition,
  doorData,
  yStartPos,
  yEndPos,
  materials,
  cabinetBottomWidth,
  cabinetWidth,
  modelType,
}) => {
  const doorRef = useRef<any>();
  const texture = useTexture(textureUrl);
  const dispatch = useAppDispatch();
  const { selectedDoors, history, selectionControl } = useAppSelector(configuratorControlSelector);
  const [accessoriesHeightList, setAccessoriesHeightList] = useState<IAccessoriesType>({
    smarty: 0,
    payment: 0,
    qrReader: 0,
  });
  const doorColumnPosition = doorName.includes("Left") ? 0 : 1; // Fixed: Left=0, Right=1
  const accessoriesCount = !!doorData?.accessories
    ? Object.values(doorData.accessories).filter((item) => (item?.columnPosition ?? 0) === doorColumnPosition + 1)
        ?.length
    : 0;
  const sumAccessoriesHeight = useMemo(
    () =>
      !!doorData.accessories
        ? Object.keys(doorData?.accessories)
            ?.map((key) =>
              doorData?.accessories?.[key as keyof IAccessoriesType]?.columnPosition === doorColumnPosition + 1
                ? accessoriesHeightList[key as keyof IAccessoriesType]
                : 0,
            )
            ?.reduce((sum, item) => sum + item, 0)
        : 0,
    [accessoriesHeightList, doorData.accessories],
  );
  const startPosition = useMemo(
    () => (yEndPos - yStartPos - sumAccessoriesHeight - 0.01 * accessoriesCount) / 2,
    [sumAccessoriesHeight],
  );
  let eachStartPoint = startPosition;

  /**
   * Add or remove a door id to selected doors in door group selection
   */
  const handleClickDoorForGroupSelection = () => {
    if (
      selectionControl.isGroupSelection &&
      selectionControl.selectionMode === "click" &&
      selectionControl.selectionType === "door"
    ) {
      const newSelectedDoors = selectedDoors.includes(name)
        ? selectedDoors.filter((item) => item !== name)
        : [...selectedDoors, name];

      dispatch(setSelectedDoors(newSelectedDoors));
    }
  };

  useEffect(() => {
    if (startPosition < 0) {
      toast.warning("we can't add accessories to the cabinet because door heigh is small than accessories height");
      dispatch(resetLockerWall(history[history.length - 2].data));
    }
  }, [startPosition]);

  useEffect(() => {
    gsap.to(doorRef.current.rotation, {
      y: rotation ? (Math.PI * 4) / 7 : 0,
      duration: 0.6,
      ease: "power3.inOut",
    });
    if (rotation && scale[2] > 0.01) {
      gsap.to(doorRef.current.position, {
        x: doorRefXPosition[modelType] * scale[2],
        z: position[2] - doorRefZPosition[modelType] * (scale[2] - 0.01),
        duration: 0.6,
        ease: "power3.inOut",
      });
    } else {
      gsap.to(doorRef.current.position, {
        x: position[0],
        z: position[2],
        duration: 0.6,
        ease: "power3.inOut",
      });
    }
  }, [rotation, position]);

  return (
    <Select enabled={selectedDoors.includes(name)}>
      <group dispose={null} ref={doorRef} name={name} position={position} onClick={handleClickDoorForGroupSelection}>
        {Object.keys(doorData.accessories)?.length > 0 &&
          startPosition > 0 &&
          Object.values(doorData.accessories)
            ?.sort((first, second) => first?.position - second?.position)
            ?.map((item, index: number) => {
              const type = Object.keys(accessoriesHeightList).find((key) => key === item?.type) ?? "smarty";
              const accessoriesHeight = accessoriesHeightList[type as keyof IAccessoriesType];
              const startPoint = eachStartPoint;
              eachStartPoint =
                startPoint + (doorColumnPosition + 1 === item?.columnPosition ? accessoriesHeight + 0.01 : 0);
              return (
                <Fragment key={index}>
                  {doorColumnPosition + 1 === item?.columnPosition && (
                    <Accessories
                      modelUrl={item.url}
                      modelType={modelType}
                      name={item.type}
                      texture={texture}
                      scale={scale}
                      roughness={roughness}
                      cabinetBottomWidth={cabinetBottomWidth}
                      accessoriesPosition={startPoint}
                      accessoriesHeightList={accessoriesHeightList}
                      setAccessoriesHeightList={setAccessoriesHeightList}
                    />
                  )}
                </Fragment>
              );
            })}
        <mesh geometry={nodes?.[doorName]?.geometry} name={name} scale={scale}>
          <meshStandardMaterial map={texture} roughness={roughness} />
        </mesh>
        {nodes?.[`${doorName}_Solid`]?.geometry && (
          <mesh
            geometry={nodes?.[`${doorName}_Solid`]?.geometry}
            scale={scale}
            material={materials[`${doorName}_Solid`]}
          />
        )}
        <mesh
          geometry={nodes?.[`${doorName}_Nosepin`]?.geometry}
          name={name}
          scale={[0.01, 0.01, 0.01]}
          position={[
            -0.005,
            pinPosition + (modelType.includes("wood") ? 0.101 : 0),
            cabinetWidth * (scale[2] - 0.01) * 100 -
              (doorName.includes("Door_Main_FrontLeft") ? doorLeftValue[modelType] : 0.6) * (scale[2] - 0.01),
          ]}
        >
          <meshStandardMaterial color={"#6E6C6F"} roughness={roughness} />
        </mesh>
      </group>
    </Select>
  );
};

export default memo(Door);
