"use client";
import React, { Fragment, useLayoutEffect, useMemo, useRef } from "react";
import { Texture } from "three";

import * as THREE from "three";

import { ICompartmentPosition, INodes } from "@/utils/types";
import { Base, Geometry, Subtraction } from "@react-three/csg";
import { modelCabinetDepth, modelCabinetWidth, pivotPosition } from "../../utils/constant";

type Props = {
  panelNodes: INodes;
  kLogoNodes: INodes;
  scale: [number, number, number];
  texture: Texture;
  roughness?: number;
  columnCount: number;
  compartmentMiddlePosition: ICompartmentPosition[];
  hplCompartmentHolePosition: number[];
  materials: {
    [name: string]: THREE.Material;
  };
  backPanelZScale: number;
  backPanelZPosition: number;
  modelType: string;
};

const BackPanel: React.FC<Props> = ({
  panelNodes,
  kLogoNodes,
  scale,
  texture,
  roughness = 0.1,
  columnCount = 1,
  compartmentMiddlePosition,
  hplCompartmentHolePosition,
  materials,
  backPanelZScale,
  backPanelZPosition,
  modelType,
}) => {
  const xPosition = modelCabinetDepth[modelType];
  // const xPosition = ((boundingBox?.max?.x ?? 0) - (boundingBox?.min?.x ?? 0)) / 100;
  // const logoWidth = (logoBoundingBox?.max.z ?? 0) - (logoBoundingBox?.min.z ?? 0);
  const logoWidth = 0.050856;
  const backPanelWidth = modelCabinetWidth[modelType] * scale[2] * 100;
  const zPosition = (backPanelWidth - logoWidth) / 2 - pivotPosition[modelType] * scale[2];
  const holeZPosition = (backPanelWidth * 100 + 15) / (2 * 100);

  return (
    <group>
      {modelType.includes("0type_steel") ? (
        <>
          <mesh geometry={panelNodes?.["Body_Main_BackPanel"]?.geometry} scale={scale}>
            <meshStandardMaterial envMapIntensity={0.25} map={texture} roughness={roughness} />
          </mesh>
          {compartmentMiddlePosition.map((yPos: ICompartmentPosition, key: number) => {
            return (
              <Fragment key={key}>
                {Array.from({ length: columnCount }, (_, index) => index).map((count, i) => {
                  return (
                    <Fragment key={i}>
                      <mesh
                        geometry={kLogoNodes?.["K_logo"]?.geometry}
                        position={[-xPosition, yPos.position - 0.04, (zPosition * (2 * count + 1)) / columnCount]}
                        scale={[0.01, 0.01, 0.01]}
                      >
                        <meshStandardMaterial envMapIntensity={0.25} map={texture} roughness={roughness} />
                      </mesh>
                      <mesh
                        geometry={kLogoNodes?.["K_logo"]?.geometry}
                        position={[
                          -xPosition + 0.02,
                          yPos.position - 0.04,
                          (zPosition * (2 * count + 1)) / columnCount,
                        ]}
                        scale={[0.01, 0.01, 0.01]}
                      >
                        <meshStandardMaterial envMapIntensity={0.25} map={texture} roughness={roughness} />
                      </mesh>
                    </Fragment>
                  );
                })}
              </Fragment>
            );
          })}
        </>
      ) : !!modelType.includes("solid") ? (
        <>
          <mesh>
            <Geometry>
              <Base
                geometry={panelNodes?.["Body_Main_BackPanel"]?.geometry}
                scale={[0.01, 0.01, backPanelZScale]}
                position={[0, 0, backPanelZPosition]}
                name="BackPanel"
              />
              {hplCompartmentHolePosition.map((yPos: any, key: number) => (
                <Fragment key={key}>
                  {Array.from({ length: columnCount }, (_, index) => index).map((count, i) => {
                    return (
                      <Fragment key={i}>
                        <Subtraction
                          position={[
                            -xPosition + 0.05,
                            yPos - 0.04,
                            ((holeZPosition - 0.03) * (2 * count + 1)) / columnCount,
                          ]}
                        >
                          <HoleGeometry />
                        </Subtraction>
                      </Fragment>
                    );
                  })}
                </Fragment>
              ))}
            </Geometry>
            <meshStandardMaterial envMapIntensity={0.25} map={texture} roughness={roughness} />
          </mesh>
          <mesh material={materials["Base_Solid_HPL"]}>
            <Geometry>
              <Base
                geometry={panelNodes?.["Base_Solid_HPL"]?.geometry}
                scale={!!modelType.includes("solid") ? [0.01, 0.01, backPanelZScale] : scale}
                position={!!modelType.includes("solid") ? [0, 0, backPanelZPosition] : [0, 0, 0]}
                name="BackPanel"
                material={materials["Base_Solid_HPL"]}
              />
              {hplCompartmentHolePosition.map((yPos: any, key: number) => (
                <Fragment key={key}>
                  {Array.from({ length: columnCount }, (_, index) => index).map((count, i) => {
                    return (
                      <Fragment key={i}>
                        <Subtraction
                          position={[
                            -xPosition + 0.05,
                            yPos - 0.04,
                            ((holeZPosition - 0.03) * (2 * count + 1)) / columnCount,
                          ]}
                        >
                          <HoleGeometry />
                        </Subtraction>
                      </Fragment>
                    );
                  })}
                </Fragment>
              ))}
            </Geometry>
          </mesh>
        </>
      ) : (
        <>
          <mesh geometry={panelNodes?.["Body_Main_BackPanel"]?.geometry} scale={scale} name="BackPanel">
            <meshStandardMaterial envMapIntensity={0.25} map={texture} roughness={roughness} />
          </mesh>
        </>
      )}
    </group>
  );
};

export default BackPanel;

export const HoleGeometry = ({ radius = 1, depth = 1 }) => {
  const geometry = useRef<any>();
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const x = -0.5;
    const y = 0;
    const width = radius * 1.5;
    const height = radius * 0.03;
    s.absarc(x, y, height, Math.PI / 2, (3 * Math.PI) / 2, false);
    s.lineTo(width, -height);
    s.lineTo(width, -height);
    s.absarc(width, y, height, (3 * Math.PI) / 2, Math.PI / 2, false);
    return new THREE.Shape(s.getPoints(10));
  }, [radius, depth]);
  const config = useMemo(() => ({ depth: depth * 5, bevelEnabled: false }), [depth]);
  useLayoutEffect(() => {
    geometry.current.scale(radius / 10, radius / 10, radius / 60);
    geometry.current.rotateY(Math.PI / 2);
    geometry.current.rotateZ(Math.PI);
    geometry.current.computeVertexNormals();
  }, [shape]);
  return <extrudeGeometry ref={geometry} args={[shape, config]} />;
};
