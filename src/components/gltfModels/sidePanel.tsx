"use client";
import React, { memo, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { toast } from "react-toastify";
import { Texture } from "three";

import { ILockerWallItem } from "../../utils/types";
import { useAppDispatch } from "../../utils/hooks/store";
import { addSidePanelToLockerWall, removeSidePanelOfMiddle } from "../../store/configurator";
import { addAccessoryData, removeSidePanelOfAccessories } from "../../store/accessories";
import { pivotPosition } from "../../utils/constant";

type TProps = {
  lockerwallId: string;
  scale: [number, number, number];
  texture: Texture;
  lockerWallData: {
    [key: string]: ILockerWallItem;
  };
  defaultSidePanelUrl?: string;
  modelType: string;
  cabinetWidth: number;
};

const SidePanel: React.FC<TProps> = ({
  lockerwallId,
  texture,
  scale,
  lockerWallData,
  defaultSidePanelUrl = "/models/steel_left_sidePanel",
  modelType,
  cabinetWidth,
}) => {
  const { nodes, materials } = useGLTF(defaultSidePanelUrl);
  const dispatch = useAppDispatch();
  const [sidePanelPosition, setSidePanelPosition] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    const direction = Object.keys(nodes).includes("left") ? "end" : "start";
    const totalLength = Object.keys(lockerWallData).length;
    const sidePanelData = lockerWallData[lockerwallId]?.sidePanel;
    if (sidePanelData?.position !== "unknown") {
      const selectedPosition = lockerWallData[lockerwallId].position;
      const sortedLockerwall = Object.values(lockerWallData).sort((first, second) => first.position - second.position);
      const findPosition = sortedLockerwall.findIndex((item) => item.position === selectedPosition);
      if ((findPosition === 0 && direction === "end") || (findPosition === totalLength - 1 && direction === "start")) {
        setSidePanelPosition([
          0,
          0,
          direction === "start"
            ? -pivotPosition[modelType] * (scale[2] - 0.01)
            : cabinetWidth - pivotPosition[modelType] * (scale[2] - 0.01),
        ]);
        // setSidePanelPosition([0, 0, direction === "start" ? -0.008 : cabinetWidth + 0.015]);
      } else {
        dispatch(removeSidePanelOfMiddle(lockerwallId));
        dispatch(removeSidePanelOfAccessories(sidePanelData?.id ?? ""));

        // dispatch(resetDefaultSidePanel(name));
        // dispatch(reduceSidePanel(defaultSidePanelUrl ?? lockerWallData?.[name]?.sidePanel?.url ?? ""));
        toast.warning("we can't add side panel between cabinet.");
      }
    } else {
      dispatch(
        addAccessoryData({
          keyniusPIMArticleId: sidePanelData?.id ?? "",
          articleName: sidePanelData?.articleName ?? "",
          price: sidePanelData?.price ?? 0,
          quantity: 1,
        }),
      );
      dispatch(
        addSidePanelToLockerWall({
          lockerwallId: lockerwallId,
          position: direction,
          url: defaultSidePanelUrl,
        }),
      );
    }
  }, [nodes, lockerWallData]);

  return (
    <group name="sidePanel" position={sidePanelPosition} dispose={null} scale={[0.01, 0.01, 0.01]}>
      {Object.keys(nodes).map((key) =>
        materials[key] ? (
          <mesh key={key} geometry={nodes?.[key]?.geometry} material={materials[key]} />
        ) : (
          <mesh key={key} geometry={nodes?.[key]?.geometry} name="SidePanels">
            <meshStandardMaterial map={texture} roughness={0.1} />
          </mesh>
        ),
      )}
    </group>
  );
};

export default memo(SidePanel);
