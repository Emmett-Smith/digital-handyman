import { getIndustry, industries } from "@/content/industries";
import { ogImage } from "@/lib/og";
export const alt = "Practical digital help for your business — Digital Handyman";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}
export default async function Image({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const i = getIndustry((await params).industry);
  return ogImage(i?.headline || "Good people. Less repeat work.", i?.name);
}
