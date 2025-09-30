import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import { configuratorReducer } from "./configurator";
import { appControlReducer } from "./configuratorControl";
import { accessoriesReducer } from "./accessories";
import { projectReducer } from "./app";

export const store = configureStore({
  reducer: {
    appControl: appControlReducer,
    configurator: configuratorReducer,
    accessoriesData: accessoriesReducer,
    project: projectReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
