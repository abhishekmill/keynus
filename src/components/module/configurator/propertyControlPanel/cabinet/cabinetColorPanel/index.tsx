"use client";

import React, { useEffect } from "react";
import { useTexture } from "@react-three/drei";

import MaterialPicker from "../../../../_basic/materialPicker";
import { configuratorControlSelector } from "@/store/configuratorControl";
import { configuratorSelector, updateMultiLockerData } from "@/store/configurator";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/store";
import { IArticleColors, IKeyniusPIMArticle } from "../../../../../../utils/types";

type Props = {
  transText?: { [key: string]: string };
  articleData?: IKeyniusPIMArticle;
};

const CabinetColorPanel: React.FC<Props> = ({ articleData }) => {
  const dispatch = useAppDispatch();
  const { lockerWallData } = useAppSelector(configuratorSelector);
  const { selectedCabinets } = useAppSelector(configuratorControlSelector);

  useEffect(() => {
    if (!!articleData) articleData?.colors?.map((item: IArticleColors) => useTexture.preload(item.textureUrl));
  }, [articleData]);

  const handleColorChange = (val: string) => {
    dispatch(
      updateMultiLockerData(
        {
          cabinet: {
            texture: val,
          },
        },
        selectedCabinets,
      ),
    );
  };

  return (
    <div className=" ">
      <MaterialPicker
        materials={articleData?.colors?.filter((row: IArticleColors) => row.colorType === "cabinet") ?? []}
        onChange={handleColorChange}
        activeMaterials={selectedCabinets.map((item) => lockerWallData?.[item]?.cabinet?.texture)}
      />
    </div>
  );
};

export default CabinetColorPanel;
