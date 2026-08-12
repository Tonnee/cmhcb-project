"use client";

import * as React from "react";
import { useEffect } from "react";
import { Container } from "@/components/layout/container";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  useEffect(() => {
    console.error("CMHCB Application Error:", error);
  }, [error]);

  return (
    <main className="flex-1 bg-page-bg py-24 min-h-[60vh] flex items-center">
      <Container className="text-center">
        <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-muted shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 text-2xl font-bold">
            !
          </div>
          <h1 className="font-marcellus text-3xl md:text-4xl text-dark mb-4">
            Something Went Wrong
          </h1>
          <p className="font-sans text-light-ash mb-8 text-base md:text-lg leading-relaxed">
            We encountered an unexpected error while loading this page. Please try refreshing or returning to the homepage.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-primary-dark hover:bg-primary-dark/90 text-white rounded-full font-sans font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-6 py-3 bg-white border border-muted hover:border-accent text-dark rounded-full font-sans font-medium text-sm transition-all"
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
}
