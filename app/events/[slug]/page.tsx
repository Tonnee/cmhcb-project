import { redirect } from "next/navigation";

export default async function EventSlugRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<never> {
  const { slug } = await params;
  redirect(`/events-workshops/${slug}`);
}
