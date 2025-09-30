import { createReducer } from "@reduxjs/toolkit";
import { setArticlePrice, setDiscountStatus, setLockerwallPrice, setProjectPrice, setUserRole } from "./action";

type TConfiguratorState = {
  lockerWallPrice: number;
  articlePrice: number;
  discountStatus: boolean;
  userRole?: string;
};

const initialState: TConfiguratorState = {
  lockerWallPrice: 0,
  articlePrice: 0,
  discountStatus: false,
};

export const projectReducer = createReducer(initialState, (builder) => {
  builder.addCase(setProjectPrice, (state, { payload }) => {
    state.lockerWallPrice = payload.lockerwall;
    state.articlePrice = payload.article;
  });
  builder.addCase(setLockerwallPrice, (state, { payload }) => {
    state.lockerWallPrice = payload;
  });
  builder.addCase(setArticlePrice, (state, { payload }) => {
    state.lockerWallPrice = payload;
  });
  builder.addCase(setDiscountStatus, (state, { payload }) => {
    state.discountStatus = payload;
  });
  builder.addCase(setUserRole, (state, { payload }) => {
    state.userRole = payload;
  });
});
