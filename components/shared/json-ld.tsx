import * as React from "react";

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
}

/**
 * Clean Server Component for safely injecting JSON-LD structured data into the head/page.
 */
export function JsonLd({ data }: JsonLdProps): React.JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
