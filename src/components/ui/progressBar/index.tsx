"use client";
import React from "react";
import classNames from "classnames";

type Props = {
  percent: number;
  className?: string;
};

const ProgressBar: React.FC<Props> = ({ percent, className }) => {
  return (
    <div className={classNames("w-full", className)}>
      <div className="h-12 relative w-full rounded-full overflow-hidden">
        <div className="w-full h-full bg-gray absolute"></div>
        <div
          className="transition-all ease-out duration-1000 h-full bg-primary relative"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
