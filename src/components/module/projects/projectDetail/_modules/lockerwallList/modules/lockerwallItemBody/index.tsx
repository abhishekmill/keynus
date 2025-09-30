"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useRouter } from "nextjs-toploader/app";

import Button from "@/components/ui/button";
import { ICurrency, ILockerwall, INumbering } from "@/utils/types";
import { usePathname } from "@/navigation";
import callServerAction from "../../../../../../../../utils/callServerAction";
import { deleteLockerwall } from "../../../../../../../../app/actions/lockerwall";
import { useAppDispatch, useAppSelector } from "../../../../../../../../utils/hooks/store";
import { resetLockerWall } from "../../../../../../../../store/configurator";
import ProjectArticleList from "../../../articleList";
import { revalidatePath } from "../../../../../../../../utils/cookie";
import {
  configuratorControlSelector,
  setConfigurationMode,
  setMethod,
} from "../../../../../../../../store/configuratorControl";
const AppConfirmModal = dynamic(() => import("@/components/module/_basic/confirmModal"), { ssr: false });
const NumberingModal = dynamic(() => import("./modals/numberingModal"), { ssr: false });
const NotesModal = dynamic(() => import("./modals/notesModal"), { ssr: false });

import styles from "./style.module.scss";

type Props = {
  lockerwall: ILockerwall;
  numberingArticleList: INumbering[];
  lockerSumPrice: number;
  currency?: ICurrency;
  transText: { [key: string]: string };
};

const LockerwallItemBody: React.FC<Props> = ({
  transText,
  lockerwall,
  numberingArticleList,
  lockerSumPrice,
  currency,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { configurationMode } = useAppSelector(configuratorControlSelector);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showNumberingModal, setShowNumberingModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onDeleteLockerWall = async () => {
    setDeleteLoading(true);
    try {
      await callServerAction(deleteLockerwall, lockerwall.id);
      revalidatePath(pathname);
      toast.success("Lockerwall deleted successfully");
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.error ?? "Something went wrong");
    }
    setDeleteLoading(false);
  };

  const onEdit = ({ feature }: { feature: "edit" | "copy" }) => {
    dispatch(resetLockerWall({}));
    dispatch(setMethod("reset"));
    if (feature === "edit" && configurationMode !== "edit") {
      dispatch(setConfigurationMode("edit"));
    } else if (feature === "copy" && configurationMode !== "copy") {
      dispatch(setConfigurationMode("copy"));
    }
    router.push(`${pathname}/lockerwall/${lockerwall?.id}/configurator`);
  };

  return (
    <div className={styles.wrapper}>
      <ProjectArticleList
        lockerwallId={lockerwall.id}
        articleList={lockerwall?.articles}
        totalPrice={lockerSumPrice}
        currency={currency}
        articleType="lockerwallArticle"
        projectId={lockerwall?.keyniusProjectId ?? ""}
        transText={transText}
      />
      <div className={styles.actionsWrapper}>
        <div className={styles.buttons}>
          <Button
            label={transText?.copyDesign}
            icon="DocumentDuplicate"
            isPrefix
            onClick={() => onEdit({ feature: "copy" })}
          />
          <Button
            label={transText?.editLockerwall}
            icon="Pencil"
            isPrefix
            onClick={() => onEdit({ feature: "edit" })}
          />
          <Button
            icon="List"
            isPrefix
            onClick={() => {
              router.push(`${pathname}/lockerwall/${lockerwall?.id}/list`);
            }}
          />
          <Button icon="Document" isPrefix className={styles.editButton} onClick={() => setShowNotesModal(true)} />
          <Button label="123" onClick={() => setShowNumberingModal(true)} />
        </div>
        <div className={styles.trashWrapper}>
          <Button icon="Trash" className={styles.trashButton} onClick={() => setShowConfirmModal(true)} />
        </div>
      </div>
      <AppConfirmModal
        isOpen={showConfirmModal}
        setIsOpen={setShowConfirmModal}
        title="Are you sure?"
        message="Are you sure you want to delete this lockerwall?"
        transText={{
          yes: "OK",
          no: "Cancel",
        }}
        onOk={onDeleteLockerWall}
        confirmLoading={deleteLoading}
      />
      <NotesModal setIsOpen={setShowNotesModal} isOpen={showNotesModal} lockerwall={lockerwall} transText={transText} />
      {showNumberingModal && (
        <NumberingModal
          setIsOpen={setShowNumberingModal}
          isOpen={showNumberingModal}
          lockerwallId={lockerwall.id}
          lockerwallArticle={lockerwall?.articles}
          numberingArticleList={numberingArticleList}
          transText={transText}
        />
      )}
    </div>
  );
};

export default LockerwallItemBody;
