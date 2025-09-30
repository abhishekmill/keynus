import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectConfigurator = (state: RootState) => state.configurator;

export const configuratorSelector = createSelector(selectConfigurator, (state) => state, {
  devModeChecks: { identityFunctionCheck: "never" },
});
