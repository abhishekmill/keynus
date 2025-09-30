"use client";
import React, { memo, useEffect, useMemo, useState, useCallback } from "react";
import { Select } from "@react-three/postprocessing";
import { Vector3 } from "@react-three/fiber";
import { useGLTF, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import dynamic from "next/dynamic";

import { ICompartmentPosition, ILockerWallItem, INodes } from "../../../../../../utils/types";
import {
  modelBackPanelWidth,
  modelCabinetWidth,
  modelRightPanelWidth,
  modelTotalHeight,
  staticCabinetScale,
} from "../../../../../../utils/constant";
import { materialMap } from "../../../../../../utils/materialMap";
import { updateLockerColumn, updateRealModalWidth } from "../../../../../../store/configurator";
import { useAppDispatch, useAppSelector } from "../../../../../../utils/hooks/store";
import { configuratorControlSelector } from "@/store/configuratorControl";
import { toast } from "react-toastify";
import { ErrorBoundaryComponent } from "../../../../../ErrorBoundary";
import { degToRad } from "three/src/math/MathUtils.js";
import StandardDoor from "@/components/gltfModels/standardDoor";

const Cabinet = dynamic(() => import("../../../../../gltfModels/cabinet"), {
  ssr: false,
});
const Door = dynamic(() => import("../../../../../gltfModels/door"), {
  ssr: false,
});

const Measurement = dynamic(() => import("../../_module/measurement"), {
  ssr: false,
});
const Shelf = dynamic(() => import("../../../../../gltfModels/shelf"), {
  ssr: false,
});
const SidePanel = dynamic(() => import("../../../../../gltfModels/sidePanel"), {
  ssr: false,
});

// Security Utility Functions
const createDefaultBoundingBox = () => ({
  min: { x: 0, y: 0, z: 0 },
  max: { x: 100, y: 180, z: 50 },
});

const calculateDimension = (boundingBox: any, axis: "x" | "y" | "z", defaultValue: number = 0) => {
  try {
    if (!boundingBox?.min || !boundingBox?.max) {
      return defaultValue;
    }
    const min = boundingBox.min[axis] ?? 0;
    const max = boundingBox.max[axis] ?? 0;
    const result = (max - min) / 100;
    return isNaN(result) ? defaultValue : result;
  } catch (error) {
    console.error(`Error calculating dimension for axis '${axis}':`, error);
    return defaultValue;
  }
};

const getSafeBoundingBox = (nodes: any, nodeName: string, isCloned: boolean = false) => {
  try {
    const node = nodes?.[nodeName];
    if (!node?.geometry) {
      return createDefaultBoundingBox();
    }

    // For cloned models or missing bounding boxes, compute them
    if (isCloned || !node.geometry.boundingBox) {
      try {
        node.geometry.computeBoundingBox();
      } catch (computeError) {
        console.error(`Failed to compute bounding box for '${nodeName}':`, computeError);
        return createDefaultBoundingBox();
      }
    }

    const boundingBox = node.geometry.boundingBox;
    if (!boundingBox?.min || !boundingBox?.max) {
      return createDefaultBoundingBox();
    }

    return boundingBox;
  } catch (error) {
    console.error(`Error getting bounding box for '${nodeName}':`, error);
    return createDefaultBoundingBox();
  }
};

// Simplified secure GLTF hook
const useSecureGLTF = (modelUrl: string, isCloned: boolean = false) => {
  const [isModelReady, setIsModelReady] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const gltf = useGLTF(modelUrl);

  const computeAllBoundingBoxes = useCallback(
    (nodes: any) => {
      try {
        Object.values(nodes).forEach((node: any) => {
          if (node?.geometry) {
            try {
              if (isCloned || !node.geometry.boundingBox) {
                node.geometry.computeBoundingBox();
              }
              if (isCloned || !node.geometry.boundingSphere) {
                node.geometry.computeBoundingSphere();
              }
            } catch (error) {
              // Create fallback for failed nodes
              node.geometry.boundingBox = createDefaultBoundingBox();
              node.geometry.boundingSphere = {
                center: new THREE.Vector3(0, 0, 0),
                radius: 1,
              };
            }
          }
        });
        return true;
      } catch (error) {
        console.error("Error computing bounding boxes:", error);
        return false;
      }
    },
    [isCloned],
  );

  useEffect(() => {
    if (!gltf?.nodes) {
      setIsModelReady(false);
      return;
    }

    // Check for critical nodes
    const criticalNodes = ["Door_Main_Front", "Body_Main_RightPanel", "Body_Main_BottomPanel"];
    const hasRequiredNodes = criticalNodes.some((nodeName) =>
      Object.keys(gltf.nodes).some((key) => key.includes(nodeName)),
    );

    if (!hasRequiredNodes) {
      setModelError("Model missing critical nodes");
      setIsModelReady(false);
      return;
    }

    const processModel = () => {
      const success = computeAllBoundingBoxes(gltf.nodes);
      if (success) {
        setIsModelReady(true);
        setModelError(null);
      } else {
        setModelError("Model geometry processing failed");
        setIsModelReady(false);
      }
    };

    // Add delay for cloned models to ensure proper processing
    if (isCloned) {
      setTimeout(processModel, 100);
    } else {
      processModel();
    }
  }, [gltf, computeAllBoundingBoxes, isCloned]);

  return {
    ...gltf,
    isModelReady,
    modelError,
  };
};

type TProps = {
  name: string;
  onLockerClick?: (point: Vector3) => void;
  data: ILockerWallItem;
  roughness?: number;
  selected?: boolean;
  modelUrl: string;
  lockerPosition: number;
  lockerWallData: {
    [key: string]: ILockerWallItem;
  };
  lockerWallDataLength: number;
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
  isNeedMeasureValues?: boolean;
  kLogoNodes: INodes;
  availableAddAccessories?: boolean;
  setAvailableAddAccessories?: React.Dispatch<React.SetStateAction<boolean>>;
  isClonedModel?: boolean;
};

const Locker: React.FC<TProps> = ({
  name,
  onLockerClick = () => {},
  data,
  roughness = 0.1,
  selected = false,
  modelUrl,
  lockerPosition,
  lockerWallData,
  lockerWallDataLength = 0,
  beforeCabinetWidth = { current: [] },
  measureValues = {
    height: 0,
    width: 0,
    depth: 0,
  },
  isNeedMeasureValues = true,
  kLogoNodes,
  availableAddAccessories = true,
  setAvailableAddAccessories = () => {},
  isClonedModel = false,
}) => {
  const { nodes, materials, scene, isModelReady, modelError } = useSecureGLTF(modelUrl, isClonedModel);
  const dispatch = useAppDispatch();
  const texture = useTexture(data.cabinet.texture);
  const { selectionControl } = useAppSelector(configuratorControlSelector);

  // Show error notification
  useEffect(() => {
    if (modelError) {
      toast.error(`3D Model Error: ${modelError}`, {
        toastId: `model-error-${name}`,
        autoClose: 5000,
      });
    }
  }, [modelError, name]);

  // Extract door data safely
  const DoorData = useMemo(() => {
    if (!nodes || !isModelReady) return [];
    try {
      return Object.keys(nodes)
        .filter((key) => key.includes("Door_Main_Front") && !key.includes("Nosepin") && !key.includes("Solid"))
        .sort((first, second) => second.localeCompare(first));
    } catch (error) {
      console.error("Error extracting door data:", error);
      return [];
    }
  }, [nodes, isModelReady]);

  // Safe bounding box calculations
  const doorBounding = useMemo(() => {
    if (!nodes || !isModelReady || !DoorData?.[0]) return createDefaultBoundingBox();
    return getSafeBoundingBox(nodes, DoorData[0], isClonedModel);
  }, [nodes, DoorData, isModelReady, isClonedModel]);

  const rightBound = useMemo(() => {
    if (!nodes || !isModelReady) return createDefaultBoundingBox();
    return getSafeBoundingBox(nodes, "Body_Main_RightPanel", isClonedModel);
  }, [nodes, isModelReady, isClonedModel]);

  const topPanelBound = useMemo(() => {
    if (!nodes || !isModelReady) return createDefaultBoundingBox();
    return getSafeBoundingBox(nodes, "Door_Main_Top", isClonedModel);
  }, [nodes, isModelReady, isClonedModel]);

  const bottomBound = useMemo(() => {
    if (!nodes || !isModelReady) return createDefaultBoundingBox();
    return getSafeBoundingBox(nodes, "Body_Main_BottomPanel", isClonedModel);
  }, [nodes, isModelReady, isClonedModel]);

  // Safe dimension calculations
  const doorHeight = useMemo(() => calculateDimension(doorBounding, "y", 1.8), [doorBounding]);
  const cabinetWidth = useMemo(() => calculateDimension(doorBounding, "z", 0.3), [doorBounding]);
  const totalDepth = useMemo(() => calculateDimension(rightBound, "x", 0.5), [rightBound]);
  const topPanelWidth = useMemo(() => calculateDimension(topPanelBound, "z", 0.3), [topPanelBound]);

  // Model type detection
  const modelType = useMemo(() => {
    if (!nodes || !isModelReady) return "default";
    try {
      return Object.keys(nodes).find((item) => item.includes("0type")) ?? "default";
    } catch (error) {
      console.error("Error detecting model type:", error);
      return "default";
    }
  }, [nodes, isModelReady]);

  const doorCount = Math.max(1, DoorData.length);
  const compartment = Math.max(1, Object.keys(data.doors).length);

  const scale: [number, number, number] = [
    0.01,
    0.01,
    lockerWallData?.[name]?.width < 300 ? 0.01 : (0.01 * lockerWallData?.[name]?.width) / (300 * doorCount),
  ];

  // Shelf data
  const selfData = useMemo(() => {
    if (!nodes || !isModelReady) return [];
    try {
      return Object.keys(nodes).filter((key) => key.includes("Shelf_Main") && !key.includes("HingePlate"));
    } catch (error) {
      console.error("Error extracting shelf data:", error);
      return [];
    }
  }, [nodes, isModelReady]);

  // Cabinet calculations
  const cabinetBottomWidth = useMemo(() => {
    try {
      const defaultWidth = 300;
      const baseWidth = (modelCabinetWidth[modelType] ?? defaultWidth) * scale[2] * 100;
      return data?.hasCabinetStandardAttribute ? baseWidth * doorCount - 0.6 : baseWidth;
    } catch (error) {
      console.error("Error calculating cabinet bottom width:", error);
      return 30;
    }
  }, [modelType, scale, data?.hasCabinetStandardAttribute, doorCount]);

  const halfWidth = useMemo(
    () => Object.values(lockerWallData).reduce((acc, curr) => acc + (curr?.modalWidth ?? 0), 0) / 2,
    [lockerWallData],
  );

  const zPosition = useMemo(() => {
    try {
      const totalWidth = cabinetBottomWidth + (beforeCabinetWidth.current[lockerPosition - 1]?.totalWidth ?? 0);
      beforeCabinetWidth.current[lockerPosition] = {
        totalWidth,
        id: name,
      };
      const position =
        (halfWidth - totalWidth) / 3.33 + (scale[2] !== 0.01 ? (1.07799 * (scale[2] - 0.01) * 100) / 333 : 0);
      return isNaN(position) ? 0 : position;
    } catch (error) {
      console.error("Error calculating zPosition:", error);
      return 0;
    }
  }, [halfWidth, cabinetBottomWidth, beforeCabinetWidth, lockerPosition, name, scale]);

  const backPanelZScale = useMemo(() => {
    try {
      const defaultBackPanelWidth = 300;
      const backPanelWidth = modelBackPanelWidth[modelType] ?? defaultBackPanelWidth;
      const cabinetWidthValue = modelCabinetWidth[modelType] ?? 300;
      const scale_value =
        (cabinetWidthValue * scale[2] * 100 - (modelType.includes("wood") ? 0.018 * 2 : 0.0100444 * 2)) /
        (backPanelWidth * 100);
      return isNaN(scale_value) ? 1 : scale_value;
    } catch (error) {
      console.error("Error calculating backPanelZScale:", error);
      return 1;
    }
  }, [modelType, scale]);

  const backPanelZPosition = useMemo(() => {
    try {
      const rightPanelWidth = modelRightPanelWidth[modelType] ?? 0;
      const position = -rightPanelWidth * (scale[2] - 0.01) * 100;
      return isNaN(position) ? 0 : position;
    } catch (error) {
      console.error("Error calculating backPanelZPosition:", error);
      return 0;
    }
  }, [modelType, scale]);

  // Update effects
  useEffect(() => {
    try {
      if (lockerWallData && name && lockerWallData?.[name]?.column !== doorCount) {
        dispatch(updateLockerColumn({ id: name, column: doorCount }));
      }
      if (!lockerWallData?.[name]?.modalWidth) {
        dispatch(updateRealModalWidth({ id: name, width: cabinetBottomWidth }));
      }
    } catch (error) {
      console.error("Error updating locker data:", error);
      toast.error("Failed to update locker configuration", {
        toastId: `locker-update-error-${name}`,
        autoClose: 3000,
      });
    }
  }, [name, doorCount, dispatch, cabinetBottomWidth, lockerWallData]);

  // Loading state
  if (!isModelReady || !nodes) {
    return (
      <ErrorBoundaryComponent>
        <group name={name} position={[0, 0, zPosition || 0]} scale={0.3}>
          <mesh>
            <boxGeometry args={[1, 6, 1.67]} />
            <meshStandardMaterial color={modelError ? "#ff6b6b" : "#e0e0e0"} transparent opacity={0.7} />
          </mesh>
          <Html center>
            <div
              style={{
                background: "rgba(0,0,0,0.8)",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {modelError ? "⚠️ Model Error" : isClonedModel ? "⏳ Loading Clone..." : "⏳ Loading..."}
            </div>
          </Html>
        </group>
      </ErrorBoundaryComponent>
    );
  }

  // Main render
  let doorStartPosition = 0;
  let compartmentMiddlePosition: ICompartmentPosition[] = [];
  let hplCompartmentHolePosition: number[] = [];

  console.log("start", nodes, "end");
  return (
    <ErrorBoundaryComponent>
      {isModelReady && (
        <group
          scale={0.3}
          name={name}
          rotation={[0, 0, 0]}
          position={[0, 0, zPosition]}
          onClick={(e) => {
            e.stopPropagation();
            onLockerClick(e.point);
          }}
        >
          <Select enabled={selected}>
            {data?.hasCabinetStandardAttribute ? (
              <group position={[0, 0, 0]} rotation={[0, degToRad(90), 0]}>
                {/* Clone all non-door nodes (cabinet body, shelves, etc.) */}
                {Object.keys(nodes).map((key, i) => {
                  if (key.includes("Door") || key.includes("body")) {
                    return null;
                  } else if (key.includes("Body") || key.includes("Shelf") || key.includes("Lock")) {
                    // Clone the object
                    const clonedObject = nodes[key].clone();

                    // Apply texture to all meshes in the cloned object
                    clonedObject.traverse((child) => {
                      if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;
                        // Clone the texture to avoid modifying the original
                        const repeatedTexture = texture.clone();

                        // Set texture repeat values (adjust these values as needed)
                        repeatedTexture.wrapS = THREE.RepeatWrapping;
                        repeatedTexture.wrapT = THREE.RepeatWrapping;
                        repeatedTexture.repeat.set(2, 2); // Repeat 2x horizontally and 2x vertically
                        repeatedTexture.needsUpdate = true;

                        // Create new material with repeated texture
                        mesh.material = new THREE.MeshStandardMaterial({
                          map: repeatedTexture,
                          roughness: modelType.includes("wood") ? 0.6 : roughness,
                        });
                      }
                    });

                    return <primitive key={i} object={clonedObject} />;
                  }

                  return null;
                })}
                {/* Doors with StandardDoor component */}

                <group name="Doors" rotation={[0, degToRad(0), 0]}>
                  {(() => {
                    const doorKeys = Object.keys(nodes).filter((key) => key.includes("Door"));
                    const doorDataEntries = Object.entries(data.doors);

                    // Group doors by their number suffix
                    const doorGroups: { [key: number]: string[] } = {};
                    doorKeys.forEach((key) => {
                      const match = key.match(/-(\d+)$/);
                      if (match) {
                        const groupNumber = parseInt(match[1]);
                        if (!doorGroups[groupNumber]) {
                          doorGroups[groupNumber] = [];
                        }
                        doorGroups[groupNumber].push(key);
                      }
                    });

                    return Object.entries(doorGroups).map(([groupNumber, groupDoors], doorIndex) => {
                      // Get the corresponding door data for this group
                      const doorDataEntry = doorDataEntries[doorIndex];
                      if (!doorDataEntry) return null;

                      const [doorId, doorData] = doorDataEntry;
                      console.log(doorData.isOpened);

                      return (
                        <StandardDoor
                          isOpened={doorData.isOpened}
                          key={doorId}
                          doorId={doorId}
                          doorData={doorData}
                          nodes={nodes}
                          groupNumber={groupNumber}
                          groupDoors={groupDoors}
                          doorIndex={doorIndex}
                          modelType={modelType}
                          roughness={modelType.includes("wood") ? 0.6 : roughness}
                          name={`${doorId}_${name.split("_")[1]}_door_${doorIndex}`}
                          onDoorClick={(doorId, doorIndex, subDoorIndex) => {
                            console.log(`Door clicked: ${doorId}, Door Index: ${doorIndex}, Sub-door: ${subDoorIndex}`);
                          }}
                        />
                      );
                    });
                  })()}
                </group>
              </group>
            ) : (
              <Cabinet
                nodes={nodes}
                scale={scale}
                materials={materials}
                kLogoNodes={kLogoNodes}
                texture={texture}
                roughness={modelType.includes("wood") ? 0.6 : roughness}
                name={`Cabinet_${name.split("_")[1]}`}
                columnCount={doorCount}
                compartmentMiddlePosition={compartmentMiddlePosition}
                hplCompartmentHolePosition={hplCompartmentHolePosition}
                doorHeight={doorHeight}
                topPanelWidth={topPanelWidth}
                cabinetBottomWidth={cabinetBottomWidth / scale[2] / 100}
                backPanelZScale={backPanelZScale}
                backPanelZPosition={backPanelZPosition}
                modelType={modelType}
              />
            )}

            {!data?.hasCabinetStandardAttribute && lockerWallData?.[name]?.sidePanel && (
              <SidePanel
                lockerwallId={name}
                texture={texture}
                scale={scale}
                lockerWallData={lockerWallData}
                modelType={modelType}
                defaultSidePanelUrl={lockerWallData?.[name]?.sidePanel?.url}
                cabinetWidth={cabinetBottomWidth ?? 0}
              />
            )}

            {Object.keys(data.doors)
              .reverse()
              .map((key, i) => {
                let doorYScale = 0,
                  yPosDiff = 0,
                  doorYPosDiff = 0,
                  yEndPos = 0,
                  doorYPos = 0;

                if (data?.isCustom && data?.doors?.[key]?.height) {
                  doorYScale =
                    (0.01 /
                      (data.height + (i === compartment - 1 ? 0.002 * i : 0.1 / compartment) * (compartment - 1))) *
                    (data?.doors?.[key]?.height ?? 0);
                  yPosDiff = (doorHeight / data.height) * (data?.doors?.[key]?.height ?? 0);
                  doorYPosDiff = (doorHeight / data.height) * doorStartPosition;
                  yEndPos = (doorHeight / data.height) * (doorStartPosition + (data?.doors?.[key]?.height ?? 0));
                  doorYPos = doorYPosDiff;
                  doorStartPosition += data?.doors?.[key]?.height ?? 0;
                } else {
                  doorYScale = staticCabinetScale?.[compartment] ?? 0.01 / compartment;
                  yPosDiff = doorHeight / compartment;
                  doorYPosDiff = yPosDiff * i;
                  yEndPos = doorYPosDiff + yPosDiff;
                  doorYPos = ((doorHeight + 0.01) * i) / compartment;
                }

                compartmentMiddlePosition.push({
                  position: doorYPosDiff + yPosDiff / 2 + 0.005,
                  isOpened: data?.doors[key]?.isOpened ?? false,
                });

                if (modelType.includes("solid")) hplCompartmentHolePosition.push(doorYPosDiff + yPosDiff);

                return (
                  <group key={i}>
                    {DoorData.map((doorName: string, index) => {
                      const uniqueDoorName = `${key}_${name.split("_")[1]}_door_${index}`;

                      let isOpen;
                      let textureUrl;

                      if (
                        data?.doors[key]?.separateDoors &&
                        selectionControl.isGroupSelection &&
                        selectionControl.selectionType === "door"
                      ) {
                        isOpen = data?.doors[key]?.separateDoors[index]?.isOpened;
                      } else {
                        isOpen = data?.doors[key]?.isOpened;
                      }

                      if (data?.doors[key]?.separateDoors && data?.doors[key]?.separateDoors?.[index]?.texture) {
                        textureUrl = data?.doors[key]?.separateDoors[index]?.texture;
                      } else {
                        textureUrl = data?.doors[key]?.texture ?? materialMap.egger_mfc[2];
                      }
                      console.log(doorName);

                      return (
                        <Door
                          key={index}
                          rotation={isOpen}
                          doorName={doorName}
                          modelType={modelType}
                          name={uniqueDoorName}
                          nodes={nodes}
                          scale={[0.01, doorYScale, scale[2]]}
                          position={[
                            0,
                            doorYPos + (modelType.includes("wood") ? 0.1 : modelType.includes("solid") ? 0.015 : 0),
                            cabinetWidth * scale[2] * 100 * index,
                          ]}
                          textureUrl={textureUrl}
                          roughness={modelType.includes("wood") ? 0.6 : roughness}
                          pinPosition={(yPosDiff - doorHeight) / 2}
                          doorData={data?.doors[key]}
                          availableAddAccessories={availableAddAccessories}
                          setAvailableAddAccessories={setAvailableAddAccessories}
                          yStartPos={doorYPosDiff}
                          yEndPos={yEndPos}
                          materials={materials}
                          cabinetBottomWidth={
                            (DoorData.length > 1 && cabinetBottomWidth === 0.4983333333333333) ||
                            cabinetBottomWidth === 0.598
                              ? cabinetBottomWidth / 2
                              : cabinetBottomWidth
                          }
                          cabinetWidth={cabinetWidth}
                        />
                      );
                    })}

                    {!data?.hasCabinetStandardAttribute &&
                      i > 0 &&
                      selfData.map((selfItem: string, index) => (
                        <Shelf
                          key={index}
                          nodes={nodes}
                          name={selfItem}
                          scale={scale}
                          position={[
                            0,
                            doorYPos +
                              (doorCount === 1 ? 0.015 : 0.02) +
                              (modelType.includes("solid") ? -0.002 : modelType.includes("wood") ? -0.01 : 0),
                            0,
                          ]}
                          solidZScale={backPanelZScale}
                          solidZPosition={backPanelZPosition}
                          texture={texture}
                          roughness={modelType.includes("wood") ? 0.6 : roughness}
                          materials={materials}
                          modelType={modelType}
                        />
                      ))}
                  </group>
                );
              })}
          </Select>

          {isNeedMeasureValues &&
            (data?.hasCabinetStandardAttribute ? (
              <Measurement
                height={data.height / 1000}
                depth={data.depth / 500}
                widthPoint={{
                  start: 0,
                  end: (data.width / 1000) * scale[2] * 45,
                }}
                halfWidth={beforeCabinetWidth.current[lockerPosition]?.totalWidth / 2 || 0}
                activeDepthHeightMeasure={lockerWallDataLength === lockerPosition + 1}
                lockerPosition={lockerPosition}
                measureValues={{
                  height: data.height / 100,
                  width: data.width / 1000,
                  depth: data.depth / 100,
                }}
              />
            ) : (
              <Measurement
                height={modelTotalHeight[modelType] ?? 1.8}
                depth={totalDepth + 0.09}
                activeDepthHeightMeasure={lockerWallDataLength === lockerPosition + 1}
                lockerPosition={lockerPosition}
                widthPoint={{
                  start:
                    ((bottomBound?.min?.z ?? 0) / 100 +
                      (lockerWallData[name]?.sidePanel?.position === "start" ? -0.02 : 0)) *
                    scale[2] *
                    100,
                  end:
                    ((bottomBound?.max?.z ?? 0) / 100 +
                      (lockerWallData[name]?.sidePanel?.position === "end" ? 0.02 : 0)) *
                    scale[2] *
                    100,
                }}
                halfWidth={beforeCabinetWidth.current[lockerPosition]?.totalWidth / 2 || 0}
                measureValues={measureValues}
              />
            ))}
        </group>
      )}
    </ErrorBoundaryComponent>
  );
};

export default memo(Locker);
