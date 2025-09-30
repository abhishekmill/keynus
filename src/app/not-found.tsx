"use client";
import dynamic from "next/dynamic";
const NotFoundComponent = dynamic(() => import("../components/module/notFound"), {
  ssr: false,
});

const NotFound = () => {
  return <NotFoundComponent />;
};

export default NotFound;
