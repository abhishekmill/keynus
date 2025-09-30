import { createAction } from "@reduxjs/toolkit";

export const setLockerwallPrice = createAction("configurator/setLockerwallPrice", (payload: number) => ({
  payload,
}));

export const setArticlePrice = createAction("configurator/setArticlePrice", (payload: number) => ({
  payload,
}));

export const setProjectPrice = createAction(
  "configurator/setProjectPrice",
  (payload: { lockerwall: number; article: number }) => ({
    payload,
  }),
);

export const setDiscountStatus = createAction("configurator/setDiscountStatus", (payload: boolean) => ({
  payload,
}));

export const setUserRole = createAction("configurator/setUserRole", (payload: string) => ({
  payload,
}));
