import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { industries, getIndustry } from "@/content/industries";
import { Landing } from "@/components/Landing";
export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const i = getIndustry((await params).industry);
  return i
    ? {
        title: `AI automation for ${i.name.toLowerCase()}`,
        description: i.description,
        alternates: { canonical: `/for/${i.slug}` },
        openGraph: {
          title: i.headline,
          description: i.description,
          images: [`/for/${i.slug}/opengraph-image`],
        },
      }
    : {};
}
export default async function IndustryPage({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const i = getIndustry((await params).industry);
  if (!i) notFound();
  return <Landing industry={i} />;
}
