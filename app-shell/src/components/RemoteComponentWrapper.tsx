import React, { Suspense } from "react";
import ErrorBoundary from "./ErrorBoundary";

const RemoteHeader = React.lazy(() => import("react_remote_app/Header"));
const RemoteButton = React.lazy(() => import("react_remote_app/Button"));

const LoadingSpinner = () => (
  <div className="flex justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

export const RemoteComponentWrapper = () => {
  return (
    <ErrorBoundary fallback={<div>React remote unavailable</div>}>
      <div className="p-4">
        <Suspense fallback={<LoadingSpinner />}>
          <RemoteHeader />
        </Suspense>

        <div className="mt-4">
          <Suspense fallback={<LoadingSpinner />}>
            <RemoteButton
              text="Remote Button"
              onClick={() =>
                alert(
                  "Well done you've imported the MF remote component successfully",
                )
              }
            />
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
};
