"use client";

import dynamic from "next/dynamic";
const ErrorPage = dynamic(() => import("../../components/pages/error"), {
  ssr: false,
});

const Page = ({ error, reset }: { error: Error & { digest?: string } & any; reset: () => void }) => {
  console.log("error: ", error);
  return <ErrorPage message={error ?? error?.errors?.[0] ?? error?.message ?? "Something went wrong"} reset={reset} />;
};

export default Page;
