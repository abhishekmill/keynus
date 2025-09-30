import { Metadata } from "next";
import { useTranslations } from "next-intl";

import PricePanel from "../../../../../../../components/module/configurator/pricePanel";
import PropertyControlPanel from "../../../../../../../components/module/configurator/propertyControlPanel";
import SelectionManagePanel from "../../../../../../../components/module/configurator/selectionManagePanel";

export const metadata: Metadata = {
  title: "Configurator",
};

export default function ConfiguratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations();

  return (
    <>
      <div>
        {children}
        <PricePanel
          transText={{
            price: t("Price"),
            total: t("Total"),
          }}
        />
        <SelectionManagePanel
          transText={{
            groupSelection: t("Group selection"),
            off: t("Off"),
            on: t("On"),
            drag: t("Drag"),
            click: t("Click"),
            cabinets: t("Cabinets"),
            doors: t("Doors"),
            selectAll: t("Select all"),
            columns: t("Columns"),
          }}
        />
        <PropertyControlPanel
          transText={{
            cabinet: t("Cabinet"),
            accessories: t("Accessories"),
            openDoor: t("Open door"),
            no: t("No"),
            yes: t("Yes"),
            cabinetConfiguration: t("Cabinet configuration"),
            columns: t("Columns"),
            compartments: t("Compartments"),
            cabinetColor: t("Cabinet color"),
            doorType: t("Door type"),
            doorColor: t("Door color"),
            sidePanels: t("Side panels"),
            roof: t("Roof"),
            plinths: t("Plinths"),
            bench: t("Bench"),
            legs: t("Legs"),
            smartyType: t("Smarty type"),
            smartyLocation: t("Smarty location"),
            smartyLocationDescription: t("Click ‘Place Smarty’ and select a locker in the lockerwall"),
            placeSmarty: t("Place Smarty"),
            identificationType: t("Identification type"),
            identificationLocation: t("Identification location"),
            identificationLocationDescription: t("Click ‘Place identification’ and select a locker in the lockerwall"),
            placeIdentification: t("Place identification"),
            paymentType: t("Payment type"),
            paymentLocation: t("Payment location"),
            paymentLocationDescription: t("Click ‘Place payment’ and select a locker in the lockerwall"),
            placePayment: t("Place payment"),
            wrapFoil: t("Wrap/foil"),
            wrapFoilDescription: t("Start by uploading a image"),
            placeWrapFoil: t("Place wrap/foil"),
            startBySelectingCabinet: t("Start by selecting a cabinet"),
            column: t("Columns"),
            compartment: t("Compartments"),
          }}
        />
      </div>
    </>
  );
}
