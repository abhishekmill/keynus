// FunctionalErrorBoundary.tsx
"use client";
import { ErrorBoundary } from "react-error-boundary";
import React from "react";
import ErrorScreen from "./module/error";

function ErrorFallback({ error }: { error: Error }) {
  console.error("GLTF Load Error:", error);
  return <ErrorScreen message={error.message} />;
}

export function ErrorBoundaryComponent({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
}
