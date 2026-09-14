import { notFound } from "next/navigation";
import { Landing } from "@/components/Landing";
import { getIndustry } from "@/content/industries";
import { cleanCompany, cleanVariant } from "@/lib/personalization";
export { generateMetadata } from "@/app/for/[industry]/page";
export default async function Personalized({
  params,
  searchParams,
}: {
  params: Promise<{ industry: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const i = getIndustry((await params).industry);
  if (!i) notFound();
  const query = await searchParams;
  const company = cleanCompany(query.co);
  const variant = cleanVariant(query.v, i.hooks);
  return <Landing industry={i} company={company} hook={i.hooks[variant]} />;
}
