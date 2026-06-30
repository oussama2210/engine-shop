"use client";
import { useEffect } from "react";
import { logError } from "@/lib/logger";

export default function StoreError({ error, reset }) {
  useEffect(() => {
    logError(error, { context: "StoreErrorBoundary" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-5xl font-bold text-gray-200">!</p>
      <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
      <p className="text-sm text-gray-500">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="rounded-full bg-[#2a5b46] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1e4433] transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
