"use client";

import React from "react";
import { useTexture } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import * as THREE from "three";

import { IDoor } from "@/utils/types";
import { configuratorControlSelector, setSelectedDoors } from "@/store/configuratorControl";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/store";

interface StandardDoorProps {
  doorId: string;
  doorData: IDoor;
  isSelected?: boolean;
  isOpened?: boolean;
  onDoorStateChange?: (doorId: string, state: any) => void;
  nodes: any;
  groupNumber: string;
  groupDoors: string[];
  doorIndex: number;
  modelType: string;
  roughness: number;
  onDoorClick?: (doorId: string, doorIndex: number, subDoorIndex: number) => void;

  name: string; // The door name identifier for selection (required)
}

const StandardDoor: React.FC<StandardDoorProps> = ({
  doorId,
  doorData,
  nodes,
  groupNumber,
  groupDoors,
  doorIndex,
  modelType,
  roughness,
  onDoorClick = () => {},
  name,
}) => {
  const dispatch = useAppDispatch();
  const { selectedDoors, selectionControl } = useAppSelector(configuratorControlSelector);
  // Load texture for this specific door
  const doorTexture = useTexture(doorData.texture);
  console.log(doorData.texture);

  // Configure texture for repeating
  const configuredTexture = doorTexture.clone();
  configuredTexture.wrapS = THREE.RepeatWrapping;
  configuredTexture.wrapT = THREE.RepeatWrapping;
  configuredTexture.repeat.set(1, 1);
  configuredTexture.needsUpdate = true;

  const groupMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: configuredTexture,
    roughness: modelType.includes("wood") ? 0.6 : roughness,
  });

  const handleClickDoorForGroupSelection = () => {
    if (
      selectionControl?.isGroupSelection &&
      selectionControl?.selectionMode === "click" &&
      selectionControl?.selectionType === "door"
    ) {
      const newSelectedDoors = selectedDoors.includes(name)
        ? selectedDoors.filter((item) => item !== name)
        : [...selectedDoors, name];
      console.log("selectedDoors", selectedDoors);

      dispatch(setSelectedDoors(newSelectedDoors));
    }
  };

  console.log("doorData", doorData);

  return (
    <Select enabled={selectedDoors.includes(name)}>
      <group
        rotation={[0, 0, 0]}
        key={groupNumber}
        name={`DoorGroup-${groupNumber}`}
        userData={{ doorId }}
        onClick={handleClickDoorForGroupSelection}
      >
        {groupDoors.map((doorKey, i) => {
          const doorObject = nodes[doorKey].clone();

          // Create door ID in same format as Door component: Door_uuid_uuid_door_index
          const standardDoorId = `${name}_${i}`;
          doorObject.name = standardDoorId;
          doorObject.userData = {
            doorId: doorId,
            doorIndex: doorIndex,
            subDoorIndex: i,
            doorData: doorData,
          };

          doorObject.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.material = groupMaterial;
              // Also set userData for mesh children
              mesh.userData = {
                doorId: doorId,
                doorIndex: doorIndex,
                subDoorIndex: i,
              };
            }
          });

          return (
            <primitive
              key={`${doorId}_${i}`}
              object={doorObject}
              onClick={(e: any) => {
                if (
                  selectionControl?.isGroupSelection &&
                  selectionControl?.selectionMode === "click" &&
                  selectionControl?.selectionType === "door"
                ) {
                  e.stopPropagation();
                }

                handleClickDoorForGroupSelection();

                onDoorClick(doorId, doorIndex, i);
              }}
            />
          );
        })}
      </group>
    </Select>
  );
};

export default StandardDoor;
