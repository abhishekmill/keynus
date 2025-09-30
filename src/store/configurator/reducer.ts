import { createReducer } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { ICurrency, IKeyniusPIMArticle, ILockerWallItem, ISideAccessoriesType } from "../../utils/types";
import { materialMap } from "../../utils/materialMap";
import {
  appendLockerData,
  changeDoorMaterial,
  changeMultiDoorMaterial,
  openCloseDoor,
  openCloseMultiDoor,
  removeLockerData,
  resetLockerWall,
  setHistoricalTimestamp,
  updateMultiLockerData,
  updateLockerColumnData,
  updateMultiModelColor,
  setDefaultCabinet,
  updateLockerwallArticleId,
  addDefaultCabinet,
  updateAvailableImageSave,
  setLockerwallSaved,
  setLockerWallImage,
  updateLockerwallModelUrl,
  setCurrency,
  updateLockerColumn,
  addSmarty,
  resetAccessories,
  setSelectedCabinetColumnCount,
  addPayment,
  addIdentification,
  updateSideAccessoriesData,
  addSidePanelToLockerWall,
  removeDirectionSmarty,
  updateRealModalWidth,
  removeSidePanelOfMiddle,
  removeIdentification,
  removePayment,
  removeSidePanel,
  addWallSmarty,
} from "./action";

export type TConfiguratorState = {
  lockerWallData: { [key: string]: ILockerWallItem };
  historicalTimestamp?: number;
  articleData?: IKeyniusPIMArticle[];
  lockerWallImage: string;
  imageStored: boolean;
  isLockerWallSaved: boolean;
  currency: ICurrency;
  lastUpdatedCabinetId?: string;
  selectedCabinetColumnCount?: number;
  sideAccessoriesData: {
    type: ISideAccessoriesType;
    accessoryId: string;
    url: string;
    price: number;
  }[];
};

export const initialState: TConfiguratorState = {
  lockerWallData: {},
  historicalTimestamp: undefined,
  articleData: [],
  lockerWallImage: "",
  imageStored: false,
  isLockerWallSaved: false,
  currency: { name: "Euro", symbol: "€", format: "{0} {1:0.00}", code: "EUR" },
  sideAccessoriesData: [],
};

export const defaultLockerWallData: TConfiguratorState = {
  lockerWallData: {
    [`Locker_${uuidv4()}`]: {
      position: 0,
      width: 45,
      height: 120,
      depth: 30,
      cabinet: { texture: materialMap.egger_mfc[9] },
      cabinetUrl: "",
      articleId: "",
      price: 0,
      isCustom: false,
      doors: {
        [`Door_${uuidv4()}`]: {
          type: "Normal",
          isOpened: false,
          texture: materialMap.egger_mfc[9],
          height: 120,
          separateDoors: [
            {
              isOpened: false,
              texture: materialMap.egger_mfc[9],
            },
          ],
          accessories: {},
        },
      },
    },
  },
  historicalTimestamp: undefined,
  articleData: [],
  lockerWallImage: "",
  imageStored: false,
  isLockerWallSaved: false,
  currency: { name: "Euro", symbol: "€", format: "{0} {1:0.00}", code: "EUR" },
  sideAccessoriesData: [],
};

export const configuratorReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(resetLockerWall, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      state.lockerWallData = payload;
    })
    .addCase(setHistoricalTimestamp, (state, { payload }) => {
      state.historicalTimestamp = payload;
    })
    .addCase(updateMultiLockerData, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      payload.names.map((name) => {
        state.lockerWallData[name] = { ...state.lockerWallData[name], ...payload.payload };
      });
    })
    .addCase(updateMultiModelColor, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      const color = payload.payload.cabinet?.texture;
      Object.keys(payload.lockerwallData).forEach((key) => {
        state.lockerWallData[key].cabinet.texture = color ?? "";
        Object.keys(state.lockerWallData[key].doors).forEach((doorKey) => {
          state.lockerWallData[key].doors[doorKey].texture = color ?? "";
        });
      });
    })
    .addCase(appendLockerData, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      const newName = `Locker_${uuidv4()}`;

      Object.keys(state.lockerWallData).map((key) => {
        if (payload.direction === "right" && state.lockerWallData[key].position >= payload.newPosition) {
          state.lockerWallData[key] = {
            ...state.lockerWallData[key],
            position: state.lockerWallData[key].position + 1,
          };
        } else if (payload.direction === "left" && state.lockerWallData[key].position <= payload.newPosition) {
          state.lockerWallData[key] = {
            ...state.lockerWallData[key],
            position: state.lockerWallData[key].position - 1,
          };
        }
      });
      state.lockerWallData[newName] = { ...payload.lockerWallData, position: payload.newPosition };
      state.lastUpdatedCabinetId = newName;
    })
    .addCase(removeLockerData, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      delete state.lockerWallData[payload.name];
    })
    .addCase(updateLockerColumnData, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      const prevLength = Object.keys(state.lockerWallData).length;
      const standardVal = payload.newCount - prevLength;
      if (standardVal > 0) {
        Object.keys(state.lockerWallData).map((key) => {
          if (state.lockerWallData[key].position >= payload.position) {
            state.lockerWallData[key] = {
              ...state.lockerWallData[key],
              position: state.lockerWallData[key].position + 1,
            };
          }
        });
        for (let i = 0; i < standardVal; i++) {
          const newLockerName = `Locker_${uuidv4()}`;
          state.lockerWallData[newLockerName] = { ...payload.lockerWallData, position: payload.position + i + 1 };
        }
      } else if (standardVal < 0) {
        const keys = Object.keys(state.lockerWallData).slice(payload.newCount);
        keys.forEach((key) => delete state.lockerWallData[key]);
      }
    })
    .addCase(openCloseDoor, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      const ids = payload.lockerIds;
      ids.forEach((id) => {
        Object.keys(state.lockerWallData?.[id].doors).forEach((doorId) => {
          state.lockerWallData[id].doors[doorId].isOpened = payload.isOpen;
        });
      });
    })
    .addCase(openCloseMultiDoor, (state, { payload }) => {
      state.historicalTimestamp = undefined;

      payload.doors.forEach((door) => {
        const doorData = state.lockerWallData[door.lockerId].doors[door.doorId];

        if (Array.isArray(doorData?.separateDoors) && doorData.separateDoors.length > -1) {
          if (state.lockerWallData[door.lockerId].hasCabinetStandardAttribute === false) {
            doorData.separateDoors[door.idx].isOpened = payload.isOpen;
          }
        } else {
          doorData.isOpened = payload.isOpen;
        }
      });
    })
    .addCase(changeDoorMaterial, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      state.lockerWallData[payload.lockerId].doors[payload.doorId].texture = payload.material;
      if (state.lockerWallData[payload.lockerId].doors[payload.doorId]?.separateDoors) {
        if (state.lockerWallData[payload.lockerId].hasCabinetStandardAttribute === false) {
          state.lockerWallData[payload.lockerId].doors[payload.doorId]?.separateDoors?.map((item, idx) => {
            // console.log(JSON.parse(JSON.stringify(item)));
            item.texture = payload.material;
          });
        }
        state.lockerWallData[payload.lockerId].doors[payload.doorId]?.separateDoors?.map((item, idx) => {
          // console.log(JSON.parse(JSON.stringify(item)));
          item.texture = payload.material;
        });
      }
    })
    .addCase(changeMultiDoorMaterial, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      payload.doors.map((door) => {
        state.lockerWallData[door.lockerId].doors[door.doorId].texture = payload.material;
        console.log("hasCabinetStandardAttribute", state.lockerWallData[door.lockerId].hasCabinetStandardAttribute);

        if (!state.lockerWallData[door.lockerId].hasCabinetStandardAttribute) {
          if (state.lockerWallData[door.lockerId].doors[door.doorId]?.separateDoors) {
            state.lockerWallData[door.lockerId].doors[door.doorId].separateDoors[door.idx].texture = payload.material;
            return;
          }
        }

        // if (state.lockerWallData[door.lockerId].doors[door.doorId]?.separateDoors) {
        //   state.lockerWallData[door.lockerId].doors[door.doorId].separateDoors[door.idx].texture = payload.material;
        // }
      });
    })
    .addCase(updateLockerwallArticleId, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      Object.keys(state.lockerWallData).forEach((key) => {
        state.lockerWallData[key].articleId =
          state.lockerWallData?.[key]?.articleId?.length > 0 ? state.lockerWallData?.[key]?.articleId : payload;
      });
    })
    .addCase(setDefaultCabinet, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      state.articleData = payload.data;
    })
    .addCase(addDefaultCabinet, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      state.articleData = [...(state?.articleData ?? []), payload];
    })
    .addCase(updateAvailableImageSave, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      state.imageStored = payload;
    })
    .addCase(setLockerWallImage, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      state.lockerWallImage = payload;
    })
    .addCase(setLockerwallSaved, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      state.isLockerWallSaved = payload;
    })
    .addCase(updateLockerwallModelUrl, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      Object.keys(state.lockerWallData).forEach((key) => {
        state.lockerWallData[key].cabinetUrl =
          state.lockerWallData[key].cabinetUrl.length > 0 ? state.lockerWallData[key].cabinetUrl : payload;
      });
    })
    .addCase(updateLockerColumn, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      const findLocker = Object.keys(state.lockerWallData).find((key) => key === payload.id);
      if (findLocker) {
        state.lockerWallData[findLocker].column = payload.column;
      }
    })
    .addCase(updateSideAccessoriesData, (state, { payload }) => {
      //store accessories data to redux and add it when add button click
      state.historicalTimestamp = undefined;
      const findAccessory = state.sideAccessoriesData.findIndex((item) => item.type === payload.type);
      if (findAccessory !== -1) {
        state.sideAccessoriesData[findAccessory] = payload;
      } else {
        state.sideAccessoriesData.push(payload);
      }
    })
    .addCase(addSmarty, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      const findLocker = Object.keys(state.lockerWallData).find((key) => key === payload.cabinetId);
      if (findLocker) {
        Object.keys(state.lockerWallData?.[payload.cabinetId].doors).forEach((doorId) => {
          const beforeData = state.lockerWallData[payload.cabinetId].doors[doorId];
          state.lockerWallData[payload.cabinetId].doors[doorId] = {
            ...beforeData,
            accessories: {
              ...beforeData.accessories,
              ...(doorId === payload.compartmentPosition
                ? {
                    smarty: {
                      id: payload.accessoryId,
                      type: payload.type,
                      url: payload.url,
                      columnPosition: payload.columnPosition,
                      position: 3,
                    },
                  }
                : {}),
            },
          };
          state.lastUpdatedCabinetId = payload.cabinetId;
        });
      }
    })
    .addCase(addPayment, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      const findLocker = Object.keys(state.lockerWallData).find((key) => key === payload.cabinetId);
      if (findLocker) {
        Object.keys(state.lockerWallData?.[payload.cabinetId].doors).forEach((doorId) => {
          const beforeData = state.lockerWallData[payload.cabinetId].doors[doorId];
          state.lockerWallData[payload.cabinetId].doors[doorId] = {
            ...beforeData,
            accessories: {
              ...beforeData.accessories,
              ...(doorId === payload.compartmentPosition
                ? {
                    payment: {
                      id: payload.accessoryId,
                      type: payload.type,
                      url: payload.url,
                      columnPosition: payload.columnPosition,
                      position: 2,
                    },
                  }
                : {}),
            },
          };
          state.lastUpdatedCabinetId = payload.cabinetId;
        });
      }
    })
    .addCase(addIdentification, (state, { payload }) => {
      state.historicalTimestamp = undefined;
      const findLocker = Object.keys(state.lockerWallData).find((key) => key === payload.cabinetId);
      if (findLocker) {
        Object.keys(state.lockerWallData?.[payload.cabinetId].doors).forEach((doorId) => {
          const beforeData = state.lockerWallData[payload.cabinetId].doors[doorId];
          state.lockerWallData[payload.cabinetId].doors[doorId] = {
            ...beforeData,
            accessories: {
              ...beforeData.accessories,
              ...(doorId === payload.compartmentPosition
                ? {
                    qrReader: {
                      id: payload.accessoryId,
                      type: payload.type,
                      url: payload.url,
                      columnPosition: payload.columnPosition,
                      position: 1,
                    },
                  }
                : {}),
            },
          };
          state.lastUpdatedCabinetId = payload.cabinetId;
        });
      }
    })
    .addCase(resetAccessories, (state, { payload }) => {
      Object.keys(state.lockerWallData[payload].doors).forEach((key) => {
        state.lockerWallData[payload].doors[key] = {
          ...state.lockerWallData[payload].doors[key],
          accessories: {},
        };
      });
    })
    .addCase(removeDirectionSmarty, (state, { payload }) => {
      Object.keys(state.lockerWallData[payload].doors).forEach((key) => {
        if (!!state.lockerWallData[payload].doors[key].accessories.smarty) {
          delete state.lockerWallData[payload].doors[key].accessories.smarty;
          return;
        }
      });
    })
    .addCase(removeIdentification, (state, { payload }) => {
      Object.keys(state.lockerWallData[payload].doors).forEach((key) => {
        if (!!state.lockerWallData[payload].doors[key].accessories.qrReader) {
          delete state.lockerWallData[payload].doors[key].accessories.qrReader;
          return;
        }
      });
    })
    .addCase(removePayment, (state, { payload }) => {
      Object.keys(state.lockerWallData[payload].doors).forEach((key) => {
        if (!!state.lockerWallData[payload].doors[key].accessories.payment) {
          delete state.lockerWallData[payload].doors[key].accessories.payment;
          return;
        }
      });
    })
    .addCase(removeSidePanel, (state, { payload }) => {
      delete state.lockerWallData[payload].sidePanel;
    })
    .addCase(setSelectedCabinetColumnCount, (state, { payload }) => {
      state.selectedCabinetColumnCount = payload;
    })
    .addCase(addSidePanelToLockerWall, (state, { payload }) => {
      if (payload.id) {
        state.lockerWallData[payload.lockerwallId].sidePanel = {
          id: payload.id,
          price: payload?.price ?? 0,
          articleName: payload.articleName ?? "",
          url: payload.url,
          position: payload.position,
        };
      } else {
        state.lockerWallData[payload.lockerwallId].sidePanel = {
          id: state.lockerWallData[payload.lockerwallId].sidePanel?.id,
          url: payload.url,
          position: payload.position,
        };
      }
    })
    .addCase(removeSidePanelOfMiddle, (state, { payload }) => {
      delete state.lockerWallData[payload].sidePanel;
    })
    .addCase(updateRealModalWidth, (state, { payload }) => {
      const findLocker = Object.keys(state.lockerWallData).find((key) => key === payload.id);
      if (findLocker) {
        state.lockerWallData[findLocker].modalWidth = payload.width;
      }
    })
    .addCase(setCurrency, (state, { payload }) => {
      if (!!payload) {
        state.historicalTimestamp = undefined;
        state.currency = payload;
      }
    })
    .addCase(addWallSmarty, (state, { payload }) => {
      state.historicalTimestamp = undefined;

      // First, remove any existing smarty accessories from all cabinets
      Object.keys(state.lockerWallData).forEach((cabinetId) => {
        Object.keys(state.lockerWallData[cabinetId].doors).forEach((doorId) => {
          if (state.lockerWallData[cabinetId].doors[doorId].accessories.smarty) {
            delete state.lockerWallData[cabinetId].doors[doorId].accessories.smarty;
          }
        });
      });

      // Then add the smarty to the target cabinet and compartment
      if (state.lockerWallData[payload.targetCabinetId]) {
        const doorId = payload.compartmentPosition;
        const beforeData = state.lockerWallData[payload.targetCabinetId].doors[doorId];

        state.lockerWallData[payload.targetCabinetId].doors[doorId] = {
          ...beforeData,
          accessories: {
            ...beforeData.accessories,
            smarty: {
              id: payload.accessoryId,
              type: payload.type,
              url: payload.url,
              columnPosition: payload.columnPosition,
              position: 3,
            },
          },
        };

        state.lastUpdatedCabinetId = payload.targetCabinetId;
      }
    });
});
