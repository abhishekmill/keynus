import React from "react";

import { IArticleColors } from "../../../../../utils/types";
import ArticleMaterialPicker from "@/components/module/_basic/materialPicker/articleMaterialPicker";

type Props = {
  transText?: { [key: string]: string };
  colorList: IArticleColors[];
  setSelectedColorId: React.Dispatch<React.SetStateAction<string>>;
  selectedColorId: string;
};

const ArticleColorPanel: React.FC<Props> = ({ colorList, setSelectedColorId, selectedColorId }) => {
  const handleColorChange = (val: string) => {
    setSelectedColorId(colorList.find((item) => item.textureUrl === val)?.id ?? "");
  };

  return (
    <div>
      <ArticleMaterialPicker
        materials={colorList?.map((item: IArticleColors) => ({
          textureUrl: item.textureUrl,
        }))}
        onChange={handleColorChange}
        activeMaterials={[colorList.find((item) => item.id === selectedColorId)?.textureUrl.replace(/ /g, "%20") ?? ""]}
      />
    </div>
  );
};

export default ArticleColorPanel;
