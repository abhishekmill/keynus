import React, { memo, useMemo } from "react";
import { INodes } from "../../utils/types";
import { Material } from "three";

type TProps = {
  nodes: INodes;
  scale: number[];
  materials: {
    [name: string]: Material;
  };
  texture: any;
  roughness?: number;
  leftPanelZPosition: number;
  modelType: string;
  backPanelZScale: number;
  backPanelZPosition: number;
  defaultScale: [number, number, number];
};
const SolidCabinetPanels: React.FC<TProps> = ({
  nodes,
  scale,
  materials,
  texture,
  roughness = 0.1,
  leftPanelZPosition,
  modelType,
  backPanelZScale,
  backPanelZPosition,
  defaultScale,
}) => {
  const feet56ZPosition = useMemo(
    () =>
      modelType.includes("0type_solidTwo")
        ? 0.387028 * (scale[2] - 0.01) * 100 + (0.0100668 * (scale[2] - 0.01) * 100) / 2
        : 0,
    [scale, modelType],
  );
  const solidCeilZScale = useMemo(
    () => (modelType.includes("0type_solidTwo") ? backPanelZScale + (1.00668 / 37.9905) * (scale[2] - 0.01) : 0),
    [],
  );

  return (
    <group>
      {modelType.includes("Slop") ? (
        <group scale={[scale[0], scale[1], scale[2]]}>
          <mesh geometry={nodes?.["Body_Main_UpCapTop"]?.geometry} name="SidePanels">
            <meshStandardMaterial map={texture} roughness={roughness} />
          </mesh>
          <mesh
            name="Body_Solid_UpCapTop"
            geometry={nodes?.["Body_Solid_UpCapTop"]?.geometry}
            material={materials["Body_Solid_UpCapTop"]}
          />
        </group>
      ) : (
        <>
          <mesh
            name="Body_Main_UpCapTop"
            geometry={nodes?.["Body_Main_UpCapTop"]?.geometry}
            scale={[scale[0], scale[1], backPanelZScale]}
            position={[0, 0, backPanelZPosition]}
          >
            <meshStandardMaterial map={texture} roughness={roughness} />
          </mesh>
          <mesh
            name="Body_Solid_UpCapTop"
            geometry={nodes?.["Body_Solid_UpCapTop"]?.geometry}
            material={materials["Body_Solid_UpCapTop"]}
            scale={[scale[0], scale[1], backPanelZScale]}
            position={[0, 0, backPanelZPosition]}
          />
        </>
      )}
      {!!nodes?.["Body_Solid_LeftPanel"] && (
        <mesh
          geometry={nodes?.["Body_Solid_LeftPanel"]?.geometry}
          name="rightPanel"
          scale={[0.01, 0.01, 0.01]}
          position={[0, 0, leftPanelZPosition]}
          material={materials["Body_Solid_LeftPanel"]}
        />
      )}
      {modelType.includes("solid") && (
        <>
          {["Body_Solid_BottomPanel", "Body_Solid_UpInsidePanel"]?.map((key) => (
            <mesh
              key={key}
              geometry={nodes?.[key]?.geometry}
              scale={[0.01, 0.01, backPanelZScale]}
              position={[0, 0, backPanelZPosition]}
              material={materials[key]}
            />
          ))}
          <mesh
            geometry={nodes?.["Body_Main_UpInsidePanel"]?.geometry}
            scale={[0.01, 0.01, backPanelZScale]}
            position={[0, 0, backPanelZPosition]}
          >
            <meshStandardMaterial map={texture} roughness={roughness} />
          </mesh>
          {modelType.includes("0type_solidTwo") && (
            <>
              <mesh
                geometry={nodes?.["Body_Solid_UpInsidePanelRight"]?.geometry}
                material={materials["Body_Solid_UpInsidePanelRight"]}
                scale={[scale[0], scale[1], solidCeilZScale]}
                position={[0, 0, backPanelZPosition]}
              />
              <mesh
                geometry={nodes?.["Body_Solid_UpInsidePanelLeft"]?.geometry}
                material={materials["Body_Solid_UpInsidePanelLeft"]}
                scale={[scale[0], scale[1], solidCeilZScale]}
                position={[0, 0, -3.1 * (scale[2] - 0.01)]}
              />
              <mesh
                geometry={nodes?.["Body_Main_UpInsidePanelRight"]?.geometry}
                scale={[scale[0], scale[1], solidCeilZScale]}
                position={[0, 0, backPanelZPosition]}
              >
                <meshStandardMaterial map={texture} roughness={roughness} />
              </mesh>
              <mesh
                geometry={nodes?.["Body_Main_UpInsidePanelLeft"]?.geometry}
                scale={[scale[0], scale[1], solidCeilZScale]}
                position={[0, 0, -3.1 * (scale[2] - 0.01)]}
              >
                <meshStandardMaterial map={texture} roughness={roughness} />
              </mesh>
              {["feet5", "feet6"].map((key) => (
                <mesh
                  key={key}
                  geometry={nodes?.[key]?.geometry}
                  material={materials[key]}
                  scale={defaultScale}
                  position={[0, 0, feet56ZPosition]}
                />
              ))}
            </>
          )}
        </>
      )}
    </group>
  );
};

export default memo(SolidCabinetPanels);
