"use client";
import React from "react";
import { InfinitySpin } from "react-loader-spinner";

const AppLoadingScreen = () => {
  return (
    <div className="w-screen h-[calc(100vh-54px)] flex items-center justify-center bg-white bg-opacity-20">
      <InfinitySpin width="200" color="#4fa94d" />
    </div>
  );
};

export default AppLoadingScreen;
