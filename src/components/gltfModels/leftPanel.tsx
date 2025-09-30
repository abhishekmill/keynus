"use client";
import React, { Fragment, memo, useLayoutEffect, useMemo, useRef } from "react";
import { Base, Geometry, Subtraction } from "@react-three/csg";
import * as THREE from "three";

import { ICompartmentPosition, INodes } from "@/utils/types";
import { leftPanelHoleAdditionalPosition, pivotPosition } from "../../utils/constant";

type Props = {
  nodes: INodes;
  scale: [number, number, number];
  texture: THREE.Texture;
  roughness?: number;
  name: string;
  modelType: string;
  leftPanelPosition: number;
  leftPanelZPosition: number;
  modelMiddlePosition: number;
  compartmentMiddlePosition: ICompartmentPosition[];
  doorHeight: number;
  materials: {
    [name: string]: THREE.Material;
  };
};

const LeftPanel: React.FC<Props> = ({
  nodes,
  scale,
  texture,
  roughness = 0.1,
  name,
  leftPanelZPosition,
  leftPanelPosition,
  modelMiddlePosition = 0,
  modelType,
  compartmentMiddlePosition,
  doorHeight,
  materials,
}) => {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  //?const zPosition = (((bottomBounding?.max?.z ?? 0) - (bottomBounding?.min?.z ?? 0)) / 100) * scale[2] * 100 - doorWidth * calIdx;
  const isNeedHole = compartmentMiddlePosition.some((item) => !!item.isOpened);
  //  we don't need hole when door closed, only need opened.
  const defaultScale: [number, number, number] = [0.01, 0.01, 0.01];
  const scaledCabinetWidth = leftPanelPosition * scale[2] * 100;
  const scaledPivotWidth = pivotPosition?.[modelType] * scale[2] + leftPanelHoleAdditionalPosition[modelType];
  const leftHoleZPosition =
    name === "Body_Main_LockProfileRight"
      ? scaledCabinetWidth / 2 - scaledPivotWidth
      : scaledCabinetWidth - scaledPivotWidth;

  return (
    <mesh material={materials[name]}>
      {!isNeedHole && (
        <mesh
          name={name}
          geometry={nodes?.[name]?.geometry}
          material={materials[name]}
          scale={defaultScale}
          position={[
            0,
            0,
            name === "Body_Main_LockProfileLeft" ? leftPanelZPosition : modelMiddlePosition,
            //? 0.319533 = Body_Main_LockProfileRight + cabinetWidth/2
          ]}
        >
          {!modelType.includes("solid") && (
            <meshStandardMaterial envMapIntensity={0.25} map={texture} roughness={roughness} />
          )}
        </mesh>
      )}
      <Geometry>
        {!!isNeedHole && (
          <Base
            name={name}
            geometry={nodes?.[name]?.geometry}
            scale={[0.01, 0.01, 0.01]}
            position={[
              0,
              0,
              name === "Body_Main_LockProfileLeft" ? leftPanelZPosition : modelMiddlePosition,
              // : 0.2539 * (scale[2] - 0.01) * 100 + (0.0651 * (scale[2] - 0.01) * 100) / 2,
            ]}
          />
        )}
        {compartmentMiddlePosition.map((item: ICompartmentPosition, index: number) => (
          <Fragment key={index}>
            {!!isNeedHole && (
              <Subtraction
                position={[-0.02, item.position + 0.002 + (modelType.includes("wood") ? 0.101 : 0), leftHoleZPosition]}
                //hole vertex point is the same at the two column
              >
                <HoleGeometry />
              </Subtraction>
            )}
            {[`${name}_LockPlate`, `${name}_LockPlate_Lockbody`, `${name}_LockPlate_HookInside`].map(
              (key) =>
                nodes?.[key]?.geometry && (
                  <mesh
                    key={key}
                    geometry={nodes?.[key]?.geometry}
                    position={[
                      -0.001,
                      item.position - doorHeight / 2 + 0.001,
                      name === "Body_Main_LockProfileLeft" ? leftPanelZPosition : modelMiddlePosition,
                    ]}
                    scale={defaultScale}
                  >
                    {key === `${name}_LockPlate_Lockbody` ? (
                      <meshStandardMaterial
                        envMapIntensity={0.25}
                        color={"#DEDEDE"}
                        metalness={0.1}
                        roughness={roughness}
                      />
                    ) : key === `${name}_LockPlate_HookInside` ? (
                      <meshStandardMaterial
                        envMapIntensity={0.25}
                        color={"#E2E2E2"}
                        metalness={0.8}
                        roughness={roughness}
                      />
                    ) : (
                      <meshStandardMaterial envMapIntensity={0.25} map={texture} roughness={roughness} />
                    )}
                  </mesh>
                ),
            )}
            {/* <mesh
              geometry={nodes?.[`${name}_LockPlate_Lockbody`]?.geometry}
              position={[
                -0.001,
                item.position - doorHeight / 2 + 0.001,
                name === "Body_Main_LockProfileLeft" ? leftPanelZPosition : modelMiddlePosition,
              ]}
              scale={defaultScale}
            >
              <meshStandardMaterial envMapIntensity={0.25} color={"#DEDEDE"} metalness={0.1} roughness={roughness} />
            </mesh>
            <mesh
              geometry={nodes?.[`${name}_LockPlate_HookInside`]?.geometry}
              position={[
                -0.001,
                item.position - doorHeight / 2 + 0.001,
                name === "Body_Main_LockProfileLeft" ? leftPanelZPosition : modelMiddlePosition,
              ]}
              scale={defaultScale}
            >
              <meshStandardMaterial envMapIntensity={0.25} color={"#E2E2E2"} metalness={0.8} roughness={roughness} />
            </mesh> */}
          </Fragment>
        ))}
      </Geometry>
      {(modelType.includes("steel") || modelType.includes("wood")) && (
        <meshStandardMaterial envMapIntensity={0.25} map={texture} roughness={roughness} />
      )}
    </mesh>
  );
};

export default memo(LeftPanel);

export const HoleGeometry = ({ radius = 1, depth = 1 }: { radius?: number; depth?: number }) => {
  const geometry = useRef<any>();
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const x = -0.5;
    const y = 0;
    s.absarc(x, y, radius * 0.5, Math.PI / 2, (3 * Math.PI) / 2, false);
    s.lineTo(radius * 2, -radius * 0.5);
    s.lineTo(radius * 2, radius * 0.5);
    return new THREE.Shape(s.getPoints(10));
  }, [radius, depth]);
  const config = useMemo(() => ({ depth: depth * 5, bevelEnabled: false }), [depth]);
  useLayoutEffect(() => {
    geometry.current.translate(0, 0, (-depth * 5) / 2);

    const position = geometry.current.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const z = position.getZ(i);
      const scale = 1 - z / (depth * 3);
      // position.setX(i, position.getX(i) * scale);
      position.setY(i, position.getY(i) * scale);
    }
    geometry.current.scale(radius / 100, radius / 100, radius / 100);
    geometry.current.rotateY(Math.PI / 2);
    geometry.current.rotateZ(Math.PI);
    position.needsUpdate = true;
    geometry.current.computeVertexNormals();
  }, [shape]);
  return <extrudeGeometry ref={geometry} args={[shape, config]} />;
};
