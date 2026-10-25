// Test-only content (spec #20). The E2E build sets E2E_FIXTURES=1 and the fixture entries join
// their collections; any other build never lists or renders them.
export const FIXTURES = process.env.E2E_FIXTURES === '1'

export async function withFixtures<T>(entries: T[], fixtures: () => Promise<unknown[]>): Promise<T[]> {
  return FIXTURES ? [...entries, ...((await fixtures()) as T[])] : entries
}
