import { createAction } from "@reduxjs/toolkit";
import {
  ICurrency,
  IKeyniusPIMArticle,
  ILockerWallItem,
  ISideAccessoriesType,
  IUpdateLockerItem,
} from "../../utils/types";

export const resetLockerWall = createAction(
  "configurator/resetLockerWall",
  (payload: { [key: string]: ILockerWallItem }) => ({
    payload,
  }),
);

export const setHistoricalTimestamp = createAction("configurator/setHistoricalTimestamp", (payload: number) => ({
  payload,
}));

export const updateMultiLockerData = createAction(
  "configurator/updateMultiLockerData",
  (payload: IUpdateLockerItem, names: string[]) => ({
    payload: {
      payload,
      names,
    },
  }),
);

export const updateMultiModelColor = createAction(
  "configurator/updateMultiModelColor",
  (payload: IUpdateLockerItem, lockerwallData: { [key: string]: ILockerWallItem }) => ({
    payload: {
      payload,
      lockerwallData,
    },
  }),
);

export const appendLockerData = createAction(
  "configurator/appendLockerData",
  (lockerWallData: ILockerWallItem, newPosition: number, direction: "left" | "right" | "none") => ({
    payload: {
      lockerWallData,
      newPosition,
      direction,
    },
  }),
);

export const removeLockerData = createAction("configurator/removeLockerData", (name: string) => ({
  payload: {
    name,
  },
}));

export const updateLockerColumnData = createAction(
  "configurator/updateLockerColumnData",
  (lockerWallData: ILockerWallItem, newCount: number, position: number) => ({
    payload: {
      lockerWallData,
      newCount,
      position,
    },
  }),
);

export const openCloseDoor = createAction("configurator/openCloseDoor", (lockerIds: string[], isOpen: boolean) => ({
  payload: {
    lockerIds,
    isOpen,
  },
}));

export const openCloseMultiDoor = createAction(
  "configurator/openCloseMultiDoor",
  (doors: { lockerId: string; doorId: string; idx: number }[], isOpen: boolean) => ({
    payload: {
      doors,
      isOpen,
    },
  }),
);

export const changeDoorMaterial = createAction(
  "configurator/changeDoorMaterial",
  (lockerId: string, doorId: string, material: string) => ({
    payload: {
      lockerId,
      doorId,
      material,
    },
  }),
);

export const changeMultiDoorMaterial = createAction(
  "configurator/changeMultiDoorMaterial",
  (
    doors: {
      idx: any;
      lockerId: string;
      doorId: string;
    }[],
    material: string,
  ) => ({
    payload: {
      doors,
      material,
    },
  }),
);

export const setDefaultCabinet = createAction(
  "configurator/setDefaultCabinet",
  (payload: { data: IKeyniusPIMArticle[] }) => ({
    payload,
  }),
);

export const addDefaultCabinet = createAction("configurator/addDefaultCabinet", (payload: IKeyniusPIMArticle) => ({
  payload,
}));

export const updateLockerwallArticleId = createAction("configurator/updateLockerwallArticleId", (payload: string) => ({
  payload,
}));

export const updateAvailableImageSave = createAction("configurator/updateAvailableImageSave", (payload: boolean) => ({
  payload,
}));

export const setLockerWallImage = createAction("configurator/setLockerWallImage", (payload: string) => ({
  payload,
}));

export const setLockerwallSaved = createAction("configurator/setLockerwallSaved", (payload: boolean) => ({
  payload,
}));

export const updateLockerwallModelUrl = createAction("configurator/updateLockerwallModelUrl", (payload: string) => ({
  payload,
}));

export const updateLockerColumn = createAction(
  "configurator/updateLockerColumn",
  (payload: { id: string; column: number }) => ({
    payload,
  }),
);

export const updateSideAccessoriesData = createAction(
  "configurator/updateSideAccessoriesData",
  (payload: { type: ISideAccessoriesType; accessoryId: string; url: string; price: number }) => ({
    payload,
  }),
);

export const addSmarty = createAction(
  "configurator/addSmarty",
  (payload: {
    cabinetId: string;
    compartmentPosition: string;
    url: string;
    accessoryId: string;
    type: string;
    columnPosition: number;
  }) => ({
    payload,
  }),
);

export const addPayment = createAction(
  "configurator/addPayment",
  (payload: {
    cabinetId: string;
    compartmentPosition: string;
    url: string;
    accessoryId: string;
    type: string;
    columnPosition: number;
  }) => ({
    payload,
  }),
);

export const addIdentification = createAction(
  "configurator/addIdentification",
  (payload: {
    cabinetId: string;
    accessoryId: string;
    compartmentPosition: string;
    url: string;
    type: string;
    columnPosition: number;
  }) => ({
    payload,
  }),
);

export const addWallSmarty = createAction(
  "configurator/addWallSmarty",
  (payload: {
    url: string;
    accessoryId: string;
    type: string;
    targetCabinetId: string;
    compartmentPosition: string;
    columnPosition: number;
  }) => ({
    payload,
  }),
);

export const removeDirectionSmarty = createAction("configurator/removeDirectionSmarty", (payload: string) => ({
  payload,
}));

export const resetAccessories = createAction("configurator/resetAccessories", (payload: string) => ({
  payload,
}));

export const updateLastCabinetId = createAction("configurator/updateLastCabinetId", (payload: string) => ({
  payload,
}));

export const setCurrency = createAction("configurator/setCurrency", (payload: ICurrency) => ({
  payload,
}));

export const setSelectedCabinetColumnCount = createAction(
  "configurator/setSelectedCabinetColumnCount",
  (payload: number) => ({
    payload,
  }),
);

export const addSidePanelToLockerWall = createAction(
  "configurator/addSidePanelToLockerWall",
  (payload: {
    id?: string;
    url: string;
    lockerwallId: string;
    position: "start" | "end" | "unknown";
    articleName?: string;
    price?: number;
  }) => ({
    payload,
  }),
);

export const removeSidePanelOfMiddle = createAction("configurator/removeSidePanelOfMiddle", (payload: string) => ({
  payload,
}));

export const resetDefaultSidePanel = createAction("configurator/resetDefaultSidePanel", (payload: string) => ({
  payload,
}));

export const updateRealModalWidth = createAction(
  "configurator/updateRealModalWidth",
  (payload: { id: string; width: number }) => ({
    payload,
  }),
);

export const removeIdentification = createAction("configurator/removeIdentification", (payload: string) => ({
  payload,
}));

export const removePayment = createAction("configurator/removePayment", (payload: string) => ({
  payload,
}));

export const removeSidePanel = createAction("configurator/removeSidePanel", (payload: string) => ({
  payload,
}));
