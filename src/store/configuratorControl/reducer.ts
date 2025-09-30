import { createReducer } from "@reduxjs/toolkit";

import {
  saveImageAction,
  setCamera,
  setShowCameraControlPanel,
  setCenterView,
  setDimensions,
  setSelectedCabinets,
  setSelectionControl,
  unsetSelectedCabinets,
  setSelectedDoors,
  unsetSelectedDoors,
  setAddNewHistory,
  resetHistory,
  unsetSelectedObjects,
  addCabinet,
  updateHistory,
  setConfigurationMode,
  setMethod,
  updateIsSaveSeveralImage,
  updateIsGoToLockerwallPage,
} from "./action";
import { ICameraControl, ILockerWallItem, ISelectionControl } from "@/utils/types";

type TConfiguratorState = {
  ambientLight: number;
  cameraValue: ICameraControl;
  isCenterView: boolean;
  showCameraControlPanel: boolean;
  imageDownloadType?: "png" | "jpg";
  roughness: number;
  selectionControl: ISelectionControl;
  dimensions: "metric" | "imperial";
  selectedCabinets: string[];
  selectedDoors: string[];
  history: { data: { [key: string]: ILockerWallItem }; timeStamp: number }[];
  position: "left" | "right" | "none";
  method: "reset" | "add";
  configurationMode: "edit" | "copy";
  isGoToLockerwallPage: boolean;
  isSaveSeveralImage: boolean;
};

const initialState: TConfiguratorState = {
  ambientLight: 1.5,
  cameraValue: { position: [1, 0, 0], near: 0.1, fov: 60 },
  isCenterView: false,
  showCameraControlPanel: true,
  imageDownloadType: undefined,
  roughness: 0.05,
  dimensions: "metric",
  selectionControl: {
    isGroupSelection: false,
    selectionMode: "drag",
    selectionType: "cabinet",
  },
  selectedCabinets: [],
  selectedDoors: [],
  history: [],
  position: "none",
  method: "reset",
  configurationMode: "edit",
  isGoToLockerwallPage: false,
  isSaveSeveralImage: false,
};

export const appControlReducer = createReducer(initialState, (builder) => {
  builder.addCase(saveImageAction, (state, { payload }) => {
    state.imageDownloadType = payload;
  });
  builder.addCase(setCamera, (state, { payload }) => {
    state.cameraValue = payload;
  });
  builder.addCase(setSelectionControl, (state, { payload }) => {
    state.selectionControl = payload;
  });
  builder.addCase(setCenterView, (state, { payload }) => {
    state.isCenterView = payload;
  });
  builder.addCase(setShowCameraControlPanel, (state, { payload }) => {
    state.showCameraControlPanel = payload;
  });
  builder.addCase(setDimensions, (state, { payload }) => {
    state.dimensions = payload;
  });
  builder.addCase(setSelectedCabinets, (state, { payload }) => {
    state.selectedCabinets = payload;
    state.selectedDoors = [];
  });
  builder.addCase(unsetSelectedCabinets, (state) => {
    state.selectedCabinets = [];
  });
  builder.addCase(setSelectedDoors, (state, { payload }) => {
    state.selectedDoors = payload;
    state.selectedCabinets = [];
  });
  builder.addCase(unsetSelectedDoors, (state) => {
    state.selectedDoors = [];
  });
  builder.addCase(unsetSelectedObjects, (state) => {
    state.selectedCabinets = [];
    state.selectedDoors = [];
  });
  builder.addCase(setAddNewHistory, (state, { payload }) => {
    const histories = state.history.length > 20 ? state.history.slice(1) : state.history;
    state.history = [...histories, { data: payload, timeStamp: Date.now() }];
  });
  builder.addCase(resetHistory, (state) => {
    state.history = [];
  });
  builder.addCase(updateHistory, (state, { payload }) => {
    state.history = payload;
  });
  builder.addCase(addCabinet, (state, { payload }) => {
    state.position = payload.position;
    state.method = payload.method;
  });
  builder.addCase(setConfigurationMode, (state, { payload }) => {
    state.configurationMode = payload;
  });
  builder.addCase(setMethod, (state, { payload }) => {
    state.method = payload;
  });
  builder.addCase(updateIsSaveSeveralImage, (state, { payload }) => {
    state.isSaveSeveralImage = payload;
  });
  builder.addCase(updateIsGoToLockerwallPage, (state, { payload }) => {
    state.isGoToLockerwallPage = payload;
  });
});
