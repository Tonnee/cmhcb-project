import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound(): React.JSX.Element {
  return (
    <main className="flex-1 bg-page-bg py-24 min-h-[60vh] flex items-center">
      <Container className="text-center">
        <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-muted shadow-sm flex flex-col items-center">
          <span className="font-marcellus text-6xl text-primary font-bold mb-4">404</span>
          <h1 className="font-marcellus text-3xl md:text-4xl text-dark mb-4">
            Page Not Found
          </h1>
          <p className="font-sans text-light-ash mb-8 text-base md:text-lg leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-primary-dark hover:bg-primary-dark/90 text-white rounded-full font-sans font-medium text-sm transition-all shadow-sm"
          >
            Return to Home
          </Link>
        </div>
      </Container>
    </main>
  );
}
