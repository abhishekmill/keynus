import React, { useMemo } from "react";
import { Select } from "@react-three/postprocessing";
import { Material, Texture } from "three";

import { ICompartmentPosition, INodes } from "@/utils/types";
import LeftPanel from "./leftPanel";
import BackPanel from "./backPanel";
import {
  lockerPosition,
  modelRightPanelWidth,
  nodeList,
  rightPanelPosition,
  steelCabinetTopPanelPositionVariable,
  steelCabinetTopPanelSpace,
} from "../../utils/constant";
import SolidCabinetPanels from "./solidCabinetPanels";
import WoodCabinetPanels from "./woodCabinetPanels";

type TProps = {
  name: string;
  nodes: INodes;
  scale: [number, number, number];
  materials: {
    [name: string]: Material;
  };
  kLogoNodes: INodes;
  texture: Texture;
  roughness?: number;
  columnCount: number;
  compartmentMiddlePosition: ICompartmentPosition[];
  hplCompartmentHolePosition: number[];
  doorHeight: number;
  cabinetBottomWidth: number;
  topPanelWidth: number;
  backPanelZScale: number;
  backPanelZPosition: number;
  modelType: string;
};

const Cabinet: React.FC<TProps> = ({
  name,
  nodes,
  scale,
  materials,
  kLogoNodes,
  texture,
  roughness = 0.1,
  columnCount = 1,
  compartmentMiddlePosition,
  hplCompartmentHolePosition,
  doorHeight,
  cabinetBottomWidth,
  topPanelWidth,
  backPanelZScale,
  backPanelZPosition,
  modelType,
}) => {
  const defaultScale: [number, number, number] = [0.01, 0.01, 0.01];

  const rightSidePosition = useMemo(() => -rightPanelPosition[modelType] * (scale[2] - 0.01) * 100, [modelType, scale]);
  const leftPanelZPosition = useMemo(
    () => cabinetBottomWidth * (scale[2] - 0.01) * 100 + rightSidePosition,
    [rightSidePosition, scale],
  );
  // left panel z position is the same bottom panel width
  const middlePosition = (scale[2] * 100 - 1) * lockerPosition?.[modelType] * columnCount;

  const leftPanelNodes = useMemo(
    () => Object.keys(nodes).filter((key) => key.includes("Body_Main_LockProfile") && !key.includes("LockPlate")),
    [nodes],
  );

  return (
    <Select>
      {!!nodes && (
        <group dispose={null} name={name}>
          <group name="Body" scale={scale}>
            {nodeList[modelType]?.map((key) =>
              materials[key] ? (
                <mesh key={key} geometry={nodes?.[key]?.geometry} material={materials[key]} />
              ) : (
                <mesh key={key} geometry={nodes?.[key]?.geometry} name="SidePanels">
                  <meshStandardMaterial map={texture} roughness={roughness} />
                </mesh>
              ),
            )}
          </group>
          <group>
            <mesh
              geometry={nodes?.["Body_Main_RightPanel"]?.geometry}
              name="rightPanel"
              scale={[0.01, 0.01, 0.01]}
              position={[0, 0, rightSidePosition]}
            >
              <meshStandardMaterial map={texture} roughness={roughness} />
            </mesh>
            {!!nodes?.["Body_Solid_RightPanel"] && (
              <mesh
                geometry={nodes?.["Body_Solid_RightPanel"]?.geometry}
                name="rightPanel"
                scale={[0.01, 0.01, 0.01]}
                position={[0, 0, rightSidePosition]}
                material={materials["Body_Solid_RightPanel"]}
              />
            )}
            <mesh
              geometry={nodes?.["Body_Main_LeftPanel"]?.geometry}
              name="leftPanel"
              scale={[0.01, 0.01, 0.01]}
              position={[0, 0, leftPanelZPosition]}
            >
              <meshStandardMaterial map={texture} roughness={roughness} />
            </mesh>
            {modelType.includes("steel") && (
              <mesh
                geometry={nodes?.["Door_Main_Top"]?.geometry}
                name="cabinetLid"
                scale={[
                  0.01,
                  0.01,
                  (cabinetBottomWidth * scale[2] * 100 -
                    modelRightPanelWidth[modelType] * 2 -
                    steelCabinetTopPanelSpace * 2) /
                    topPanelWidth /
                    100,
                ]}
                position={[0, 0, -steelCabinetTopPanelPositionVariable[modelType] * (scale[2] - 0.01)]}
              >
                <meshStandardMaterial map={texture} roughness={roughness} />
              </mesh>
            )}
            <mesh
              geometry={nodes?.["Door_Steel_TopLock"]?.geometry}
              material={materials["Door_Steel_TopLock"]}
              scale={[0.01, 0.01, 0.01]}
              position={[0, 0, middlePosition]}
            />
            <mesh
              geometry={nodes?.["Body_Main_ReinforcementRight"]?.geometry}
              name="reinforcementRight"
              scale={defaultScale}
              position={[0, 0, -scale[2] + 0.01]}
            >
              <meshStandardMaterial map={texture} roughness={roughness} />
            </mesh>
            <mesh
              geometry={nodes?.["Body_Main_ReinforcementLeft"]?.geometry}
              name="reinforcementLeft"
              scale={defaultScale}
              position={[0, 0, (scale[2] - 0.01) * 100 * 0.288 * columnCount]}
            >
              <meshStandardMaterial map={texture} roughness={roughness} />
            </mesh>
            <mesh
              geometry={nodes?.["Body_Main_Divider"]?.geometry}
              name="reinforcementLeft"
              scale={defaultScale}
              position={[0, 0, middlePosition]}
            >
              <meshStandardMaterial map={texture} roughness={roughness} />
            </mesh>
            {nodes?.["Body_Solid_Divider"]?.geometry && (
              <mesh
                geometry={nodes?.["Body_Solid_Divider"]?.geometry}
                material={materials["Body_Solid_Divider"]}
                name="solid divider"
                scale={defaultScale}
                position={[0, 0, middlePosition]}
              />
            )}

            {/* feet section */}
            {["feet1", "feet2", "feet3", "feet4"]?.map((feet) => (
              <mesh
                key={feet}
                geometry={nodes?.[feet]?.geometry}
                material={materials[feet]}
                scale={defaultScale}
                position={[0, 0, feet === "feet1" || feet === "feet2" ? leftPanelZPosition : rightSidePosition]}
              />
            ))}
            <mesh
              geometry={nodes?.["Body_Steel_HingeBearingBottom"]?.geometry}
              scale={defaultScale}
              position={[0, 0, 0]}
            >
              <meshStandardMaterial map={texture} roughness={roughness} />
            </mesh>
          </group>
          {leftPanelNodes.map((panelName, index) => (
            <LeftPanel
              key={index}
              name={panelName}
              nodes={nodes}
              scale={scale}
              leftPanelPosition={cabinetBottomWidth}
              leftPanelZPosition={leftPanelZPosition}
              texture={texture}
              modelType={modelType}
              roughness={roughness}
              compartmentMiddlePosition={compartmentMiddlePosition}
              modelMiddlePosition={middlePosition}
              doorHeight={doorHeight}
              materials={materials}
            />
          ))}
          <BackPanel
            panelNodes={nodes}
            kLogoNodes={kLogoNodes}
            scale={scale}
            texture={texture}
            roughness={roughness}
            compartmentMiddlePosition={compartmentMiddlePosition}
            hplCompartmentHolePosition={hplCompartmentHolePosition}
            columnCount={columnCount}
            materials={materials}
            backPanelZScale={backPanelZScale}
            backPanelZPosition={backPanelZPosition}
            modelType={modelType}
          />
          {modelType.includes("solid") && (
            <SolidCabinetPanels
              nodes={nodes}
              scale={scale}
              materials={materials}
              texture={texture}
              modelType={modelType}
              defaultScale={defaultScale}
              leftPanelZPosition={leftPanelZPosition}
              backPanelZScale={backPanelZScale}
              backPanelZPosition={backPanelZPosition}
            />
          )}
          {modelType.includes("wood") && (
            <WoodCabinetPanels
              nodes={nodes}
              scale={scale}
              materials={materials}
              texture={texture}
              roughness={roughness}
              defaultScale={defaultScale}
              rightSidePosition={rightSidePosition}
              leftPanelZPosition={leftPanelZPosition}
              backPanelZScale={backPanelZScale}
              backPanelZPosition={backPanelZPosition}
            />
          )}
        </group>
      )}
    </Select>
  );
};

export default Cabinet;
