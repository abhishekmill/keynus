import { createAction } from "@reduxjs/toolkit";
import { IAccessories } from "../../utils/types";

export const setAccessoriesData = createAction("configurator/setAccessoriesData", (payload: IAccessories[]) => ({
  payload,
}));

export const addAccessoryData = createAction("configurator/addAccessoryData", (payload: IAccessories) => ({
  payload,
}));

export const reduceSidePanel = createAction("configurator/reduceSidePanel", (payload?: string) => ({
  payload,
}));

export const removeSidePanelOfAccessories = createAction(
  "configurator/removeSidePanelOfAccessories",
  (payload: string) => ({
    payload,
  }),
);
