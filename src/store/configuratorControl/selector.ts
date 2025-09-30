import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectConfiguratorControl = (state: RootState) => state.appControl;

export const configuratorControlSelector = createSelector(selectConfiguratorControl, (state) => state, {
  devModeChecks: { identityFunctionCheck: "never" },
});
