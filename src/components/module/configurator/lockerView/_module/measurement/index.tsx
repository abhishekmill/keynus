"use client";

import React from "react";
import { Line } from "@react-three/drei";
import { Text } from "@react-three/drei";

import { configuratorControlSelector } from "../../../../../../store/configuratorControl";
import { useAppSelector } from "@/utils/hooks/store";

type Props = {
  color?: string;
  lineWidth?: number;
  depth: number;
  height: number;
  widthPoint: { start: number; end: number };
  measureValues?: {
    height: number;
    width: number;
    depth: number;
  };
  activeDepthHeightMeasure: boolean;
  lockerPosition: number;
  halfWidth: number;
};

const Measurement: React.FC<Props> = ({
  height,
  depth,
  color = "green",
  lineWidth = 1.5,
  measureValues = { height: 0, width: 0, depth: 0 },
  widthPoint,
  activeDepthHeightMeasure = false,
  lockerPosition,
  halfWidth,
}) => {
  const { dimensions } = useAppSelector(configuratorControlSelector);

  return (
    <group position={[0.1, -0.1, 0]}>
      {/* Width measurement */}
      <group>
        <Line
          points={[0.04, 0, widthPoint.start, 0.04, 0, widthPoint.end]}
          color={color}
          lineWidth={lineWidth}
          segments
        />
        {activeDepthHeightMeasure && (
          <Line
            points={[-0.09, 0, widthPoint.start, 0.07, 0, widthPoint.start]}
            color={color}
            lineWidth={lineWidth}
            dashSize={0.03}
            gapSize={0.005}
            dashed
          />
        )}
        {lockerPosition === 0 && (
          <Line
            points={[-0.09, 0, widthPoint.end, 0.07, 0, widthPoint.end]}
            color={color}
            lineWidth={lineWidth}
            dashSize={0.03}
            gapSize={0.005}
            dashed
          />
        )}
        {activeDepthHeightMeasure && (
          <Text
            name="Text"
            position={[-0.01, 0, halfWidth]}
            scale={[0.08, 0.08, 0.08]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            color={color}
          >
            {dimensions == "metric" ? `${measureValues.width} mm` : `${(measureValues.width / 25.4).toFixed(2)} in`}
          </Text>
        )}
      </group>

      {/* Depth measurement */}
      {lockerPosition === 0 && (
        <group>
          <Line
            points={[-0.09, 0, 0.13 + widthPoint.end, -depth, 0, 0.13 + widthPoint.end]}
            color={color}
            lineWidth={lineWidth}
            segments
          />
          <Line
            points={[-0.09, 0, widthPoint.end, -0.09, 0, 0.15 + widthPoint.end]}
            color={color}
            lineWidth={lineWidth}
            dashSize={0.03}
            gapSize={0.005}
            dashed
          />
          <Line
            points={[-depth, 0, widthPoint.end, -depth, 0, 0.15 + widthPoint.end]}
            color={color}
            lineWidth={lineWidth}
            dashSize={0.03}
            gapSize={0.005}
            dashed
          />
          <Text
            name="Text"
            position={[-depth / 2 - 0.05, 0, widthPoint.end - widthPoint.start + 0.06]}
            scale={[0.08, 0.08, 0.04]}
            rotation={[-Math.PI / 2, 0, 0]}
            color={color}
          >
            {dimensions == "metric" ? `${measureValues.depth} mm` : `${(measureValues.depth / 25.4).toFixed(2)} in`}
          </Text>
        </group>
      )}

      {/* Height measurement */}
      {activeDepthHeightMeasure && (
        <group>
          <Line
            points={[-0.09, 0, widthPoint.start - 0.13, -0.09, height, widthPoint.start - 0.13]}
            color={color}
            lineWidth={lineWidth}
            segments
          />
          <Line
            points={[-0.09, 0, widthPoint.start, -0.09, 0, widthPoint.start - 0.15]}
            color={color}
            lineWidth={lineWidth}
            dashSize={0.03}
            gapSize={0.005}
            dashed
          />
          <Line
            points={[-0.09, height, widthPoint.start, -0.09, height, widthPoint.start - 0.15]}
            color={color}
            lineWidth={lineWidth}
            dashSize={0.03}
            gapSize={0.005}
            dashed
          />
          <Text
            name="Text"
            position={[-0.1, height / 2, -0.08]}
            scale={[0.08, 0.08, 0.04]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
            color={color}
          >
            {dimensions == "metric" ? `${measureValues.height} mm` : `${(measureValues.height / 25.4).toFixed(2)} in`}
          </Text>
        </group>
      )}
    </group>
  );
};

export default Measurement;
