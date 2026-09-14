import { Landing } from "@/components/Landing";
import { getAccount } from "@/content/accounts";
import { getIndustry } from "@/content/industries";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const a = getAccount((await params).slug);
  return a
    ? {
        title: `A clearer week for ${a.name}`,
        robots: { index: false, follow: false },
      }
    : { robots: { index: false, follow: true } };
}
export default async function AccountPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const a = getAccount((await params).slug);
  return a ? (
    <Landing
      company={a.name}
      accountProblem={a.problem}
      industry={getIndustry(a.industry)}
    />
  ) : (
    <Landing />
  );
}
