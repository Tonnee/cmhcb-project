import * as React from "react";

export default function Loading(): React.JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-page-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary-dark rounded-full animate-spin" />
        <p className="font-sans text-sm text-light-ash">Loading CMHCB...</p>
      </div>
    </div>
  );
}
