import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectedProjectData = (state: RootState) => state.project;

export const projectSelector = createSelector(selectedProjectData, (state) => state, {
  devModeChecks: { identityFunctionCheck: "never" },
});
