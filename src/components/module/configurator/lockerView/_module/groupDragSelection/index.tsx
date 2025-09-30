/* eslint-disable no-unused-vars */
"use client";

import React, { CSSProperties, FC, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Object3D, Vector2 } from "three";
import { SelectionBox } from "three/examples/jsm/interactive/SelectionBox.js";
import { useEvent } from "react-use";
import { useThree } from "@react-three/fiber";
import useTouch from "../../../../../../utils/hooks/useTouch";

const getCoords = (clientX: number, clientY: number) => [
  (clientX / window.innerWidth) * 2 - 1,
  -(clientY / window.innerHeight) * 2 + 1,
];

const setSelectedStyle = (collection: any[], selected: boolean) => {
  for (const item of collection) {
    if (item.material) {
      // @ts-ignore
      item.material.linewidth = selected ? 3 : 1;
    }
  }
};

interface SelectionProps {
  onSelectionChanged?(objects: Object3D[]): void;
  style?: CSSProperties;
}

const GroupDragSelection: FC<SelectionProps> = ({
  style = { border: "1px dashed #54CA70", backgroundColor: "#54CA7022", position: "fixed" },
  onSelectionChanged,
}) => {
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [mouse, setMouse] = useState<[number, number]>();
  const [selection, setSelection] = useState<Object3D[]>([]);
  const [start, setStart] = useState<Vector2>();
  const isTouchDevice = useTouch();
  const selectRectangle = useRef(document.createElement("div"));
  const { camera, scene, gl } = useThree();

  useEffect(() => {
    onSelectionChanged?.(selection);
  }, [selection]);

  useEffect(() => {
    selectRectangle.current.classList.add("selectBox");
    selectRectangle.current.style.pointerEvents = "none";
    for (const key in style) {
      const val = (style as any)[key];
      selectRectangle.current.style.setProperty(
        key
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .replace(/[\s_]+/g, "-")
          .toLowerCase(),
        val,
      );
    }
  }, [selectRectangle, style]);

  useEffect(() => {
    if (isSelecting && start && mouse) {
      gl.domElement.parentElement?.append(selectRectangle.current);

      const topLeft = {
        x: Math.min(start.x, mouse[0]),
        y: Math.min(start.y, mouse[1]),
      };
      const bottomRight = {
        x: Math.max(start.x, mouse[0]),
        y: Math.max(start.y, mouse[1]),
      };

      selectRectangle.current.style.left = `${topLeft.x}px`;
      selectRectangle.current.style.top = `${topLeft.y}px`;
      selectRectangle.current.style.width = `${bottomRight.x - topLeft.x}px`;
      selectRectangle.current.style.height = `${bottomRight.y - topLeft.y}px`;
    } else {
      selectRectangle.current.parentElement?.removeChild(selectRectangle.current);
    }
  }, [isSelecting, gl, start, mouse, selectRectangle]);

  const selectionBox = useMemo(() => new SelectionBox(camera, scene), [scene, camera]);

  const appendSelection = useCallback(
    (toAppend: any[]) => {
      setSelection([...selection, ...toAppend]);
    },
    [selection],
  );

  const onPointerDown = useCallback(
    (e: Event) => {
      const event = isTouchDevice ? (e as TouchEvent)?.touches[0] : (e as PointerEvent);
      const { clientX, clientY } = event;
      const [startX, startY] = getCoords(clientX, clientY);
      setStart(new Vector2(clientX, clientY));
      setIsSelecting(true);
      selectionBox.startPoint.set(startX, startY, 0.5);
      selectionBox.endPoint.set(startX, startY, 0.5);
    },
    [selection],
  );

  const onPointerMove = useCallback(
    (e: Event) => {
      if (!isSelecting) return;
      const { clientX, clientY } = isTouchDevice ? (e as TouchEvent)?.touches[0] : (e as PointerEvent);
      const [endX, endY] = getCoords(clientX, clientY);
      setMouse([clientX, clientY]);
      selectionBox.select();
      setSelectedStyle(selectionBox.collection, false);

      selectionBox.endPoint.set(endX, endY, 0.5);
      selectionBox.select();

      setSelectedStyle(selectionBox.collection, true);
    },
    [isSelecting],
  );

  const onPointerUp = useCallback(
    (e: Event) => {
      const { ctrlKey, clientX, clientY, button } = e as PointerEvent;

      if (isSelecting || !button) {
        setIsSelecting(false);

        const [endX, endY] = getCoords(clientX, clientY);
        selectionBox.endPoint.set(endX, endY, 0.5);
        const curSelected = selectionBox.select();

        setMouse(undefined);
        setStart(undefined);

        if (ctrlKey) {
          appendSelection(curSelected);
        } else {
          setSelection(curSelected);
        }

        setSelectedStyle(selectionBox.collection, true);
      }
    },
    [isSelecting],
  );

  useEvent(isTouchDevice ? "touchstart" : "pointerdown", onPointerDown, gl.domElement);
  useEvent(isTouchDevice ? "touchmove" : "pointermove", onPointerMove, gl.domElement);
  useEvent(isTouchDevice ? "touchend" : "pointerup", onPointerUp, gl.domElement);

  return <></>;
};

export default memo(GroupDragSelection);
