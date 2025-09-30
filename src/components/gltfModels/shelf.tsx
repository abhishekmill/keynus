import React from "react";
import { Material, Texture } from "three";

import { INodes } from "@/utils/types";

type TProps = {
  nodes: INodes;
  name: string;
  position: [number, number, number];
  texture: Texture;
  roughness?: number;
  scale: [number, number, number];
  materials: {
    [name: string]: Material;
  };
  modelType: string;
  solidZScale: number;
  solidZPosition: number;
};

const Shelf: React.FC<TProps> = ({
  nodes,
  texture,
  position,
  roughness = 0.1,
  scale,
  name,
  materials,
  modelType,
  solidZScale,
  solidZPosition,
}) => {
  const defaultScale: [number, number, number] = [0.01, 0.01, 0.01];

  return (
    <group
      name="Shelf"
      position={
        !!modelType.includes("solid") || !!modelType.includes("wood")
          ? [position[0], position[1] - 0.02, solidZPosition]
          : position
      }
      dispose={null}
    >
      <mesh
        geometry={nodes?.[name]?.geometry}
        name="Shelf"
        scale={
          !!modelType.includes("solid") || !!modelType.includes("wood")
            ? [
                scale[0],
                scale[1],
                solidZScale + (modelType === "0type_solidTwo" ? (1.00668 / 37.9905) * (scale[2] - 0.01) : 0),
              ]
            : scale
        }
        position={[0, 0, modelType === "0type_solidTwo" && name.includes("Left") ? -1.9 * (scale[2] - 0.01) : 0]}
      >
        <meshStandardMaterial map={texture} roughness={roughness} />
      </mesh>
      {/* 0.2934 * (scale[2] - 0.01) * 100 */}
      <mesh
        geometry={nodes?.[`${name}_HingePlate`]?.geometry}
        name="Hinge"
        scale={defaultScale}
        position={[0, 0, name.includes("Right") ? 0 : 0.29 * (scale[2] - 0.01) * 100]}
      >
        <meshStandardMaterial roughness={roughness} metalness={0.7} color={"#D6D6D6"} />
      </mesh>
      <mesh
        geometry={nodes?.[`${name}_HingePlate_Rivet`]?.geometry}
        name="Hinge"
        scale={defaultScale}
        position={[0, 0, name.includes("Right") ? 0 : 0.29 * (scale[2] - 0.01) * 100]}
      >
        <meshStandardMaterial roughness={roughness} metalness={0.7} color={"#D6D6D6"} />
      </mesh>
      {!!modelType.includes("solid") &&
        Object.keys(nodes)
          .filter((key) => key.includes("Shelf_Solid_Main"))
          .map((key) => (
            <mesh
              key={key}
              geometry={nodes?.[key]?.geometry}
              material={materials[key]}
              scale={[
                scale[0],
                scale[1],
                solidZScale + (modelType === "0type_solidTwo" ? (1.00668 / 37.9905) * (scale[2] - 0.01) : 0),
              ]}
              position={[0, 0, key.includes("Left") ? -1.9 * (scale[2] - 0.01) : 0]}
              // ? 1.9 is static value for 0type_solidTwo
              // 1.00668 / 37.9905 divide panel width / shelf panel width for 0type_solidTwo
            />
          ))}
      {!!modelType.includes("wood") &&
        Object.keys(nodes)
          .filter((key) => key.includes("Shelf_Core"))
          .map((key) => (
            <mesh
              key={key}
              geometry={nodes?.[key]?.geometry}
              material={materials[key]}
              scale={[
                scale[0],
                scale[1],
                solidZScale + (modelType === "0type_solidTwo" ? (1.00668 / 37.9905) * (scale[2] - 0.01) : 0),
              ]}
              position={[0, 0, key.includes("Left") ? -1.9 * (scale[2] - 0.01) : 0]}
              // ? 1.9 is static value for 0type_solidTwo
              // 1.00668 / 37.9905 divide panel width / shelf panel width for 0type_solidTwo
            />
          ))}
    </group>
  );
};

export default Shelf;
