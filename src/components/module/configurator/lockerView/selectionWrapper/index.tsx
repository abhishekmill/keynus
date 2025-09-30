import React from "react";

import { EffectComposer, Outline, SMAA, Selection } from "@react-three/postprocessing";

type Props = {
  children: React.ReactNode;
};

const SelectWrapper: React.FC<Props> = ({ children }) => (
  <Selection>
    <EffectComposer multisampling={0} autoClear={false}>
      <Outline visibleEdgeColor={0x00ff00} hiddenEdgeColor={0x00ff00} blur width={5000} edgeStrength={100} />
      <SMAA />
    </EffectComposer>
    {children}
  </Selection>
);

export default SelectWrapper;
