import * as React from "react";
import { Button } from "@/components/ui/button";

export function TrainingApproachBlock(): React.JSX.Element {
  return (
    <div className="flex flex-col rounded-3xl bg-dark-green p-10 md:p-12">
      <p className="font-sans font-normal text-xl leading-8 text-white mb-8">
        Customising programs are available for institutions, professionals, families, individuals, and organizations looking to define issues and related issues around mental health knowledge.
      </p>
      <Button href="#" variant="white" className="self-start">
        Download Brochure
      </Button>
    </div>
  );
}
