"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import classNames from "classnames";

const ArrowCircle = dynamic<{ className?: string }>(() => import("./icons/arrow_circle.svg"));
const ArrowCurveLeft = dynamic<{ className?: string }>(() => import("./icons/arrow_curve_left.svg"));
const ArrowCurveRight = dynamic<{ className?: string }>(() => import("./icons/arrow_curve_right.svg"));
const ArrowLeft = dynamic<{ className?: string }>(() => import("./icons/arrow_left.svg"));
const ArrowRight = dynamic<{ className?: string }>(() => import("./icons/arrow_right.svg"));
const ArrowUpDown = dynamic<{ className?: string }>(() => import("./icons/arrow_up_down.svg"));
const ArrowUpOnSquare = dynamic<{ className?: string }>(() => import("./icons/arrow_up_on_square.svg"));
const ArrowUturnDown = dynamic<{ className?: string }>(() => import("./icons/arrow_uturn_down.svg"));
const ArrowUturnLeft = dynamic<{ className?: string }>(() => import("./icons/arrow_uturn_left.svg"));
const ArrowUturnRight = dynamic<{ className?: string }>(() => import("./icons/arrow_uturn_right.svg"));
const ArrowsPointingIn = dynamic<{ className?: string }>(() => import("./icons/arrows_pointing_in.svg"));
const ArrowsPointingOut = dynamic<{ className?: string }>(() => import("./icons/arrows_pointing_out.svg"));
const Camera = dynamic<{ className?: string }>(() => import("./icons/camera.svg"));
const CheckCircle = dynamic<{ className?: string }>(() => import("./icons/check_circle.svg"));
const ChevronDown = dynamic<{ className?: string }>(() => import("./icons/chevron_down.svg"));
const ChevronUp = dynamic<{ className?: string }>(() => import("./icons/chevron_up.svg"));
const Cog6Tooth = dynamic<{ className?: string }>(() => import("./icons/cog_6_tooth.svg"));
const CogPlus = dynamic<{ className?: string }>(() => import("./icons/cog_plus.svg"));
const ComputerDesktop = dynamic<{ className?: string }>(() => import("./icons/computer_desktop.svg"));
const CubeTransparent = dynamic<{ className?: string }>(() => import("./icons/cube_transparent.svg"));
const DocumentDuplicate = dynamic<{ className?: string }>(() => import("./icons/document_duplicate.svg"));
const DocumentText = dynamic<{ className?: string }>(() => import("./icons/document_text.svg"));
const Eye = dynamic<{ className?: string }>(() => import("./icons/eye.svg"));
const List = dynamic<{ className?: string }>(() => import("./icons/list.svg"));
const MagnifyingGlass = dynamic<{ className?: string }>(() => import("./icons/magnifying_glass.svg"));
const Minus = dynamic<{ className?: string }>(() => import("./icons/minus.svg"));
const Pencil = dynamic<{ className?: string }>(() => import("./icons/pencil.svg"));
const Photo = dynamic<{ className?: string }>(() => import("./icons/photo.svg"));
const Plus = dynamic<{ className?: string }>(() => import("./icons/plus.svg"));
const PlusCircle = dynamic<{ className?: string }>(() => import("./icons/plus_circle.svg"));
const Printer = dynamic<{ className?: string }>(() => import("./icons/printer.svg"));
const ServerStack = dynamic<{ className?: string }>(() => import("./icons/server_stack.svg"));
const ShoppingBag = dynamic<{ className?: string }>(() => import("./icons/shopping_bag.svg"));
const Trash = dynamic<{ className?: string }>(() => import("./icons/trash.svg"));
const User = dynamic<{ className?: string }>(() => import("./icons/user.svg"));
const ViewfinderCircle = dynamic<{ className?: string }>(() => import("./icons/viewfinder_circle.svg"));
const Window = dynamic<{ className?: string }>(() => import("./icons/window.svg"));
const WrenchScrewdriver = dynamic<{ className?: string }>(() => import("./icons/wrench_screwdriver.svg"));
const XMark = dynamic<{ className?: string }>(() => import("./icons/x_mark.svg"));
const Document = dynamic<{ className?: string }>(() => import("./icons/document.svg"));
const Download = dynamic<{ className?: string }>(() => import("./icons/download.svg"));
const Print = dynamic<{ className?: string }>(() => import("./icons/print.svg"));
const Save = dynamic<{ className?: string }>(() => import("./icons/save.svg"));
const FileDownload = dynamic<{ className?: string }>(() => import("./icons/file_download.svg"));
const Box = dynamic<{ className?: string }>(() => import("./icons/box.svg"));
const Filter = dynamic<{ className?: string }>(() => import("./icons/filter.svg"));

export type IconType =
  | "ArrowCircle"
  | "ArrowCurveLeft"
  | "ArrowCurveRight"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUpDown"
  | "ArrowUpOnSquare"
  | "ArrowUturnDown"
  | "ArrowUturnLeft"
  | "ArrowUturnRight"
  | "ArrowsPointingIn"
  | "ArrowsPointingOut"
  | "Camera"
  | "CheckCircle"
  | "ChevronDown"
  | "ChevronUp"
  | "Cog6Tooth"
  | "CogPlus"
  | "ComputerDesktop"
  | "CubeTransparent"
  | "DocumentDuplicate"
  | "DocumentText"
  | "Eye"
  | "List"
  | "MagnifyingGlass"
  | "Minus"
  | "Pencil"
  | "Photo"
  | "Plus"
  | "PlusCircle"
  | "Printer"
  | "ServerStack"
  | "ShoppingBag"
  | "Trash"
  | "User"
  | "ViewfinderCircle"
  | "Window"
  | "WrenchScrewdriver"
  | "XMark"
  | "Document"
  | "Download"
  | "Print"
  | "FileDownload"
  | "Box"
  | "Filter"
  | "Save";

type IconProps = {
  name: IconType | undefined;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
};

const Icon: React.FC<IconProps> = ({ name, className }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!name || !isClient) {
    // Return a placeholder div with same dimensions during SSR
    return <div className={classNames("w-6 h-6", className)} />;
  }

  const icons = {
    ArrowCircle,
    ArrowCurveLeft,
    ArrowCurveRight,
    ArrowLeft,
    ArrowRight,
    ArrowUpDown,
    ArrowUpOnSquare,
    ArrowUturnDown,
    ArrowUturnLeft,
    ArrowUturnRight,
    ArrowsPointingIn,
    ArrowsPointingOut,
    Camera,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Cog6Tooth,
    CogPlus,
    ComputerDesktop,
    CubeTransparent,
    DocumentDuplicate,
    DocumentText,
    Eye,
    List,
    MagnifyingGlass,
    Minus,
    Pencil,
    Photo,
    Plus,
    PlusCircle,
    Printer,
    ServerStack,
    ShoppingBag,
    Trash,
    User,
    ViewfinderCircle,
    Window,
    WrenchScrewdriver,
    XMark,
    Document,
    Download,
    Print,
    Save,
    FileDownload,
    Box,
    Filter,
  };

  const CurrentIcon = icons[name];

  return <CurrentIcon className={classNames("w-auto h-auto", className)} />;
};

export default Icon;
