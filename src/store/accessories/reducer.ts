import { createReducer } from "@reduxjs/toolkit";
import { addAccessoryData, reduceSidePanel, removeSidePanelOfAccessories, setAccessoriesData } from "./action";
import { IAccessories } from "../../utils/types";

type TConfiguratorState = {
  accessoriesData: IAccessories[];
};

const initialState: TConfiguratorState = {
  accessoriesData: [],
};

export const accessoriesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setAccessoriesData, (state, { payload }) => {
      state.accessoriesData = payload;
    })
    .addCase(addAccessoryData, (state, { payload }) => {
      const findItem = state.accessoriesData.findIndex(
        (item) => item.keyniusPIMArticleId === payload.keyniusPIMArticleId,
      );
      if (findItem !== -1) {
        state.accessoriesData[findItem] = {
          ...state.accessoriesData[findItem],
          quantity: state.accessoriesData[findItem].quantity + 1,
        };
      } else {
        state.accessoriesData = [...state.accessoriesData, payload];
      }
    })
    .addCase(removeSidePanelOfAccessories, (state, { payload }) => {
      state.accessoriesData = state.accessoriesData.filter((item) => item.keyniusPIMArticleId !== payload);
    })
    .addCase(reduceSidePanel, (state, { payload }) => {
      state.accessoriesData = state.accessoriesData.filter((item) => item.url !== payload);
    });
});
