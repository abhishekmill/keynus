"use client";

import React, { memo, useEffect, useState } from "react";
import classNames from "classnames";
import dynamic from "next/dynamic";

const AccessoriesIdentificationLocationPanel = dynamic(() => import("./accessories/identificationLocationPanel"), {
  ssr: false,
});
const AccessoriesIdentificationTypePanels = dynamic(() => import("./accessories/identificationTypePanel"), {
  ssr: false,
});
const AccessoriesSidePanels = dynamic(() => import("./accessories/sidePanels"), {
  ssr: false,
});
const AccessoriesPlinthsPanels = dynamic(() => import("./accessories/plinthsPanel"), {
  ssr: false,
});
const AccessoriesSmartyLocationPanel = dynamic(() => import("./accessories/smartyLocationPanel"), {
  ssr: false,
});
const AccessoriesSmartyTypePanels = dynamic(() => import("./accessories/smartyTypePanel"), {
  ssr: false,
});
const AccessoriesWrapFoilPanel = dynamic(() => import("./accessories/wrapFoilPanel"), {
  ssr: false,
});
const AccessoriesPaymentLocationPanel = dynamic(() => import("./accessories/paymentLocationPanel"), {
  ssr: false,
});
const AccessoriesPaymentTypePanels = dynamic(() => import("./accessories/paymentTypePanel"), {
  ssr: false,
});
const CabinetConfigurationPanel = dynamic(() => import("./cabinet/cabinetConfigurationPanel"), {
  ssr: false,
});
const CabinetColorPanel = dynamic(() => import("./cabinet/cabinetColorPanel"), {
  ssr: false,
});
const CabinetDoorColorPanel = dynamic(() => import("./cabinet/doorColorPanel"), {
  ssr: false,
});
const CabinetDoorTypePanel = dynamic(() => import("./cabinet/doorTypePanel"), {
  ssr: false,
});
const CustomAccordion = dynamic(() => import("../../../ui/accordion"), {
  ssr: false,
});
const AppTabs = dynamic(() => import("../../../ui/tabs"), {
  ssr: false,
});
const OpenCloseDoorController = dynamic(() => import("./cabinet/openCloseDoorController"), {
  ssr: false,
});
const Icon = dynamic(() => import("../../../ui/Icon"), {
  ssr: false,
});
import { configuratorControlSelector } from "../../../../store/configuratorControl";
import { useAppSelector } from "../../../../utils/hooks/store";
import { configuratorSelector } from "../../../../store/configurator";
import { IKeyniusPIMArticle } from "../../../../utils/types";

import styles from "./style.module.scss";

const cabinetItems = (
  selectionType: "door" | "cabinet",
  transText?: { [key: string]: string },
  articleData?: IKeyniusPIMArticle,
) => {
  return selectionType === "cabinet"
    ? [
        // {
        //   header: <p className="text-12">{transText?.cabinetConfiguration}</p>,
        //   content: <CabinetConfigurationPanel transText={transText} />,
        // },
        {
          header: <p className="text-16">{transText?.cabinetColor}</p>,
          content: <CabinetColorPanel transText={transText} articleData={articleData} />,
        },
        // {
        //   header: <p className="text-12">{transText?.doorType}</p>,
        //   content: <CabinetDoorTypePanel transText={transText} />,
        // },
        {
          header: <p className="text-16">{transText?.doorColor}</p>,
          content: <CabinetDoorColorPanel transText={transText} articleData={articleData} />,
        },
      ]
    : [
        {
          header: <p className="text-12">{transText?.doorType}</p>,
          content: <CabinetDoorTypePanel transText={transText} />,
        },
        {
          header: <p className="text-12">{transText?.doorColor}</p>,
          content: <CabinetDoorColorPanel transText={transText} articleData={articleData} />,
        },
      ];
};

const accessoriesItems = (transText?: { [key: string]: string }, articleData?: IKeyniusPIMArticle) => [
  {
    header: <p className="text-12">{transText?.sidePanels}</p>,
    content: <AccessoriesSidePanels transText={transText} sidePanelData={articleData?.sidePanelReferences} />,
  },
  // {
  //   header: <p className="text-12">{transText?.plinths}</p>,
  //   content: <AccessoriesPlinthsPanels transText={transText} />,
  // },
  // {
  //   header: <div>{transText?.bench}</div>,
  //   content: <AccessoriesBenchPanels transText={transText} />,
  // },
  // {
  //   header: <div>{transText?.legs}</div>,
  //   content: <AccessoriesLegsPanels transText={transText} />,
  // },
  {
    header: <p className="text-12">{transText?.smartyType}</p>,
    content: <AccessoriesSmartyTypePanels transText={transText} smartyData={articleData?.smartyReferences} />,
  },
  {
    header: <p className="text-12">{transText?.smartyLocation}</p>,
    content: <AccessoriesSmartyLocationPanel transText={transText} />,
  },
  // {
  //   header: <p className="text-12">{transText?.identificationType}</p>,
  //   content: (
  //     <AccessoriesIdentificationTypePanels transText={transText} identificationData={articleData?.qrReaderReferences} />
  //   ),
  // },
  // {
  //   header: <p className="text-12">{transText?.identificationLocation}</p>,
  //   content: <AccessoriesIdentificationLocationPanel transText={transText} />,
  // },
  {
    header: <p className="text-12">{transText?.paymentType}</p>,
    content: <AccessoriesPaymentTypePanels transText={transText} paymentData={articleData?.paymentTypeReferences} />,
  },
  {
    header: <p className="text-12">{transText?.paymentLocation}</p>,
    content: <AccessoriesPaymentLocationPanel transText={transText} />,
  },
  // {
  //   header: <p className="text-12">{transText?.wrapFoil}</p>,
  //   content: <AccessoriesWrapFoilPanel transText={transText} />,
  // },
];

type Props = {
  transText?: { [key: string]: string };
};

const PropertyControlPanel: React.FC<Props> = ({ transText }) => {
  const [showPanel, setShowPanel] = useState(true);
  const [cabinetInfo, setCabinetInfo] = useState<IKeyniusPIMArticle>();
  const { lockerWallData, articleData } = useAppSelector(configuratorSelector);
  const { selectedCabinets, selectedDoors, selectionControl } = useAppSelector(configuratorControlSelector);

  useEffect(() => {
    const hasArticleId = lockerWallData[selectedCabinets?.[0]]?.articleId;
    if (!!hasArticleId) {
      setCabinetInfo(articleData?.find((item) => item.id === hasArticleId));
    } else {
      setCabinetInfo(articleData?.[0]);
    }
  }, [selectedCabinets]);

  useEffect(() => {
    if (selectedDoors.length > 0) {
      let selectedCabinetId = "";
      const selectedDoorId = selectedDoors?.[0]?.split("_")?.slice(0, -1)?.join("_");
      console.log("selectedDoorId", selectedDoorId);

      Object.keys(lockerWallData).forEach((key) => {
        const isSelectedDoor = Object.keys(lockerWallData[key].doors).findIndex((row) => row === selectedDoorId);
        if (isSelectedDoor !== -1) {
          selectedCabinetId = key;
        }
      });
      if (!!selectedCabinetId && !!lockerWallData[selectedCabinetId]?.articleId) {
        setCabinetInfo(articleData?.find((item) => item.id === lockerWallData[selectedCabinetId]?.articleId));
      } else {
        setCabinetInfo(articleData?.[0]);
      }
    }
  }, [selectedDoors]);

  return (
    <div className={classNames(styles.wrapper, { [styles.open]: showPanel })}>
      <div className={styles.content}>
        <AppTabs
          tabs={[transText?.cabinet ?? "Cabinet", transText?.accessories ?? "Accessories"]}
          panels={[
            <>
              {selectedCabinets?.length > 0 || selectedDoors.length > 0 ? (
                <>
                  <OpenCloseDoorController transText={transText} />
                  <CustomAccordion
                    items={cabinetItems(
                      selectionControl.isGroupSelection && selectionControl.selectionType === "door"
                        ? "door"
                        : "cabinet",
                      transText,
                      cabinetInfo,
                    )}
                    allowMultiple
                    expandAll
                  />
                </>
              ) : (
                <div className={styles.placeholderMessageWrapper}>
                  <span>{transText?.startBySelectingCabinet}</span>
                </div>
              )}
            </>,
            <>
              {selectedCabinets?.length > 0 || selectedDoors.length > 0 ? (
                <CustomAccordion items={accessoriesItems(transText, cabinetInfo)} allowMultiple expandAll />
              ) : (
                <div className={styles.placeholderMessageWrapper}>
                  <span>{transText?.startBySelectingCabinet}</span>
                </div>
              )}
            </>,
          ]}
        />
      </div>
      <button
        className={styles.hideButton}
        onClick={() => {
          setShowPanel((prev) => !prev);
        }}
        aria-label="hide button"
      >
        <Icon name="ChevronUp" className={styles.icon} />
      </button>
    </div>
  );
};

export default memo(PropertyControlPanel);
