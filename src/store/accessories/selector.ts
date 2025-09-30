import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectedAccessoriesData = (state: RootState) => state.accessoriesData;

export const accessoriesSelector = createSelector(selectedAccessoriesData, (state) => state, {
  devModeChecks: { identityFunctionCheck: "never" },
});
