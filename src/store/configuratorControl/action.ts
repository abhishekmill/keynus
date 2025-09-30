import { createAction } from "@reduxjs/toolkit";
import { ICameraControl, ILockerWallItem, ISelectionControl } from "@/utils/types";

export const saveImageAction = createAction("configuratorControl/saveImageAction", (payload?: "png" | "jpg") => ({
  payload,
}));

export const setCamera = createAction("configuratorControl/setCamera", (payload: ICameraControl) => ({
  payload,
}));

export const setSelectionControl = createAction(
  "configuratorControl/setSelectionControl",
  (payload: ISelectionControl) => ({
    payload,
  }),
);

export const setCenterView = createAction("configuratorControl/setCenterView", (payload: boolean) => ({
  payload,
}));

export const setDimensions = createAction("configuratorControl/setDimensions", (payload: "metric" | "imperial") => ({
  payload,
}));

export const setShowCameraControlPanel = createAction(
  "configuratorControl/setShowCameraControlPanel",
  (payload: boolean) => ({
    payload,
  }),
);

export const setSelectedCabinets = createAction("configuratorControl/setSelectedCabinets", (payload: string[]) => ({
  payload,
}));

export const unsetSelectedCabinets = createAction("configuratorControl/unsetSelectedCabinets");

export const setSelectedDoors = createAction("configuratorControl/setSelectedDoors", (payload: string[]) => ({
  payload,
}));

export const unsetSelectedDoors = createAction("configuratorControl/unsetSelectedDoors");

export const unsetSelectedObjects = createAction("configuratorControl/unsetSelectedObjects");

export const setAddNewHistory = createAction(
  "configuratorControl/setAddNewHistory",
  (payload: { [key: string]: ILockerWallItem }) => ({
    payload,
  }),
);

export const resetHistory = createAction("configuratorControl/resetHistory");

export const updateHistory = createAction(
  "configuratorControl/updateHistory",
  (payload: { data: { [key: string]: ILockerWallItem }; timeStamp: number }[]) => ({
    payload,
  }),
);

export const addCabinet = createAction(
  "configurator/addCabinet",
  (payload: { method: "add" | "reset"; position: "none" | "left" | "right" }) => ({
    payload,
  }),
);

export const setConfigurationMode = createAction("configurator/setConfigurationMode", (payload: "copy" | "edit") => ({
  payload,
}));

export const setMethod = createAction("configurator/setMethod", (payload: "reset" | "add") => ({
  payload,
}));

export const updateIsSaveSeveralImage = createAction("configurator/updateIsSaveSeveralImage", (payload: boolean) => ({
  payload,
}));

export const updateIsGoToLockerwallPage = createAction(
  "configurator/updateIsGoToLockerwallPage",
  (payload: boolean) => ({
    payload,
  }),
);
