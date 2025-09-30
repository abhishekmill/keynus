"use client";

import React, { memo, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Texture } from "three";
import gsap from "gsap";

import { IAccessoriesType } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../utils/hooks/store";
import { configuratorSelector, removeDirectionSmarty } from "../../store/configurator";
import { pivotPosition } from "../../utils/constant";

type Props = {
  modelUrl: string;
  name: string;
  texture: Texture;
  roughness: number;
  scale: [number, number, number];
  cabinetBottomWidth: number;
  accessoriesPosition: number;
  accessoriesHeightList: IAccessoriesType;
  setAccessoriesHeightList: React.Dispatch<React.SetStateAction<IAccessoriesType>>;
  modelType: string;
};

const Accessories: React.FC<Props> = ({
  name,
  modelUrl,
  texture,
  roughness,
  scale,
  cabinetBottomWidth,
  accessoriesPosition,
  accessoriesHeightList,
  setAccessoriesHeightList,
  modelType,
}) => {
  const accessoryRef = useRef<any>();
  const dispatch = useAppDispatch();
  const { lockerWallData } = useAppSelector(configuratorSelector);

  const { nodes, materials } = useGLTF(modelUrl);
  useGLTF.preload(modelUrl);

  const boundingBox = nodes?.["body"]?.geometry?.boundingBox;
  const selectedAccessoriesHeight = ((boundingBox?.max?.y ?? 0) - (boundingBox?.min?.y ?? 0)) / 100;
  const selectedAccessoriesWidth = ((boundingBox?.max?.z ?? 0) - (boundingBox?.min?.z ?? 0)) / 100;

  useEffect(() => {
    if (selectedAccessoriesHeight !== accessoriesHeightList[name as keyof IAccessoriesType]) {
      setAccessoriesHeightList((prev) => ({ ...prev, [name]: selectedAccessoriesHeight }));
    }
  }, [selectedAccessoriesHeight]);

  useEffect(() => {
    if ("0Static" in nodes) return; // left or right accessory don't need animation
    gsap.to(accessoryRef.current.position, {
      x: 0,
      z: (cabinetBottomWidth - selectedAccessoriesWidth * 0.8) / 2 - scale[2] * pivotPosition[modelType],
      duration: 0.6,
      ease: "power3.inOut",
    });
  }, [lockerWallData, nodes]);

  useEffect(() => {
    const isLeft = "left" in nodes;
    const isRight = "right" in nodes;
    const lockerKeys = Object.keys(lockerWallData).sort(
      (a, b) => lockerWallData[a].position - lockerWallData[b].position,
    );

    if (isLeft && lockerKeys[0] !== undefined) {
      lockerKeys.forEach((key, index) => {
        if (index > 0) {
          dispatch(removeDirectionSmarty(key));
        }
      });
    }
    if (isRight && lockerKeys.length > 1) {
      lockerKeys.forEach((key, index) => {
        if (index !== lockerKeys.length - 1) {
          dispatch(removeDirectionSmarty(key));
        }
      });
    }
  }, [lockerWallData, nodes]);
  return (
    <group ref={accessoryRef} position={[-0.01, accessoriesPosition, 0]}>
      {Object.keys(nodes).map((key) =>
        materials[key] ? (
          <mesh
            key={key}
            geometry={nodes?.[key]?.geometry}
            name={name}
            scale={[0.008, 0.008, 0.008]}
            material={materials[key]}
          />
        ) : (
          <mesh key={key} geometry={nodes?.[key]?.geometry} name={name} scale={[0.008, 0.008, 0.008]}>
            <meshStandardMaterial map={texture} roughness={roughness} />
          </mesh>
        ),
      )}
    </group>
  );
};

export default memo(Accessories);
