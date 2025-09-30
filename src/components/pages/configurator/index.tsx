import React from "react";

import LockerView from "../../module/configurator/lockerView";
import { getTranslations } from "next-intl/server";
import { IGetLockerWall } from "../../../utils/types";
import ConfiguratorHeader from "../../module/configurator/configuratorHeader";

type Props = {
  lockerwallData: IGetLockerWall;
  lockerWallId: string;
};

const ConfiguratorPage: React.FC<Props> = async ({ lockerwallData, lockerWallId }) => {
  const t = await getTranslations();
  return (
    <>
      <p className="fixed top-20 z-50 text-white left-1/2 -translate-x-1/2 text-[17px]">
        {lockerwallData?.lockerWallName}
      </p>

      <div className="w-screen h-[calc(100vh-54px)] z-10 ">
        <ConfiguratorHeader
          lockerWallId={lockerWallId}
          serverLockerwallData={lockerwallData}
          transText={{
            saveImage: t("Save image"),
            save: t("Save"),
            toggleDimensions: t("Toggle dimensions"),
            resetLockerwall: t("Reset lockerwall"),
            saveLockerwall: t("Save lockerwall"),
            wantToSaveLockerWall: t("Do you want to save this lockerwall?"),
            yes: t("Yes"),
            no: t("No"),
            nameLabel: t("What's the name of this lockerwall"),
            lockerwallName: t("Lockerwall name"),
            floorLabel: t("Which location is this lockerwall on"),
            location: t("Location"),
            typeLabel: t("What is the lock type of this lockerwall"),
            lockerCategory: t("Locker category"),
            lockerType: t("Locker type"),
            notesLabel: t("Any notes on this lockerwall"),
            lockerwallNotes: t("Lockerwall notes"),
            editLockerWall: t("Edit lockerwall"),
            saveLockerWall: t("Save lockerwall"),
            backToProjectPage: t("Back to project page"),
            unDo: t("Undo"),
            reDo: t("Redo"),
            reset: t("Reset"),
            turnLeft: t("Turn left"),
            turnRight: t("Turn right"),
            zoomOut: t("Zoom out"),
            zoomIn: t("Zoom in"),
            resetView: t("Reset View"),
            dimension: t("Dimensions"),
            export: t("Export"),
            showAllAngles: t("show all angles"),
            chooseFormat: t("Choose format"),
          }}
        />
        <LockerView
          serverLockerwallData={lockerwallData}
          transText={{
            addStandardCabinetToLeft: t("Add standard cabinet to left"),
            duplicateCurrentCabinetToLeft: t("Duplicate current cabinet to left"),
            addCustomCabinetToLeft: t("Add custom cabinet to left"),
            addStandardCabinetToRight: t("Add standard cabinet to right"),
            duplicateCurrentCabinetToRight: t("Duplicate current cabinet to right"),
            addCustomCabinetToRight: t("Add custom cabinet to right"),
            removeCabinet: t("Remove cabinet"),
            "Project subtotal": t("Project subtotal"),
            backToProjectPage: t("Back to project page"),
            undo: t("Undo"),
            redo: t("Redo"),
            reset: t("Reset"),
            turnLeft: t("Turn left"),
            turnRight: t("Turn right"),
            zoomOut: t("Zoom out"),
            zoomIn: t("Zoom in"),
            resetView: t("Reset View"),
            nothingHereYet: t("There’s nothing here yet"),
            addingColumn: t("Start by adding a column"),
            selectColumn: t("select column"),
            startConfiguration: t("startConfiguration"),
          }}
        />
      </div>
    </>
  );
};

export default ConfiguratorPage;
