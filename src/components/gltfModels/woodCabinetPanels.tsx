import React from "react";
import { INodes } from "../../utils/types";
import { Material } from "three";

type TProps = {
  nodes: INodes;
  materials: {
    [name: string]: Material;
  };
  texture: any;
  roughness?: number;
  defaultScale: [number, number, number];
  scale: [number, number, number];
  rightSidePosition: number;
  leftPanelZPosition: number;
  backPanelZScale: number;
  backPanelZPosition: number;
};
const WoodCabinetPanels: React.FC<TProps> = ({
  nodes,
  materials,
  texture,
  roughness,
  defaultScale,
  scale,
  rightSidePosition,
  leftPanelZPosition,
  backPanelZScale,
  backPanelZPosition,
}) => {
  // Body_Main_UpCapTop, Body_Solid_UpCapTop
  return (
    <group>
      {[
        "Body_Main_Core_RightPanel",
        "Body_Core_Left",
        "Body_Main_Left",
        "Door_Steel_PlinthLockLeft",
        "Door_Steel_PlinthLockRight",
      ].map((key) =>
        materials[key] ? (
          <mesh
            key={key}
            geometry={nodes?.[key]?.geometry}
            material={materials[key]}
            scale={defaultScale}
            position={[0, 0, !!key.includes("Right") ? rightSidePosition : leftPanelZPosition]}
          />
        ) : (
          <mesh
            key={key}
            geometry={nodes?.[key]?.geometry}
            name="SidePanels"
            scale={defaultScale}
            position={[0, 0, !!key.includes("Right") ? rightSidePosition : leftPanelZPosition]}
          >
            <meshStandardMaterial map={texture} roughness={roughness} />
          </mesh>
        ),
      )}
      {["Body_Core_Bottom", "Shelf_Core"].map((key) => (
        <mesh
          key={key}
          name={key}
          geometry={nodes?.[key]?.geometry}
          material={materials[key]}
          scale={[scale[0], scale[1], backPanelZScale]}
          position={[0, 0, backPanelZPosition]}
        />
      ))}
      {["Body_Main_Bottom", "Body_Solid_Bottom", "Body_Main_UpCapTop", "Shelf_Main_Top"].map((key) => (
        <mesh
          key={key}
          name={key}
          geometry={nodes?.[key]?.geometry}
          scale={[scale[0], scale[1], backPanelZScale]}
          position={[0, 0, backPanelZPosition]}
        >
          <meshStandardMaterial map={texture} roughness={roughness} />
        </mesh>
      ))}
    </group>
  );
};

export default WoodCabinetPanels;
