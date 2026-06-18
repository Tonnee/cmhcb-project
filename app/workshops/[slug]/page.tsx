import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { EVENTS_DATA } from "@/features/events/data/events";
import WorkshopDetail from "@/features/workshops/components/workshop-detail";

export async function generateStaticParams() {
  const workshops = EVENTS_DATA.filter((event) =>
    event.tags.some((tag) => tag.toLowerCase() === "workshop")
  );
  return workshops.map((workshop) => ({
    slug: workshop.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workshop = EVENTS_DATA.find(
    (e) => e.slug === slug && e.tags.some((tag) => tag.toLowerCase() === "workshop")
  );
  if (!workshop) return {};
  return {
    title: `${workshop.title} | Workshop | CMHCB`,
    description: workshop.description,
  };
}

export default async function WorkshopRegistrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;

  // Find the event and make sure it has the "Workshop" tag
  const workshop = EVENTS_DATA.find(
    (e) => e.slug === slug && e.tags.some((tag) => tag.toLowerCase() === "workshop")
  );

  if (!workshop) {
    notFound();
  }

  // Find up to 3 other workshops
  const otherWorkshops = EVENTS_DATA.filter(
    (e) => e.slug !== slug && e.tags.some((tag) => tag.toLowerCase() === "workshop")
  ).slice(0, 3);

  return (
    <WorkshopDetail workshop={workshop} otherWorkshops={otherWorkshops} />
  );
}

