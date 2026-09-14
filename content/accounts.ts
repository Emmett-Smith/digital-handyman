export type Account = { name: string; problem: string; industry?: string };
// Populate only with researched, approved account-specific facts.
export const accounts: Record<string, Account> = {};
export function getAccount(slug: string): Account | undefined {
  return Object.hasOwn(accounts, slug) ? accounts[slug] : undefined;
}
