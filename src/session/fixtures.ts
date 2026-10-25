// Test-only content (spec #20). The E2E build sets E2E_FIXTURES=1 and the fixture entries join
// their collections; any other build never lists or renders them.
export const FIXTURES = process.env.E2E_FIXTURES === '1'

// Vercel sets VERCEL=1 on its builds: a test switch left in its environment would publish fake content.
if (process.env.VERCEL && (process.env.E2E_FIXTURES || process.env.E2E_PLACEHOLDER))
  throw new Error('E2E_FIXTURES o E2E_PLACEHOLDER están definidas en Vercel: el sitio publicaría contenido de prueba. Bórralas de las variables de entorno.')

export async function withFixtures<T>(entries: T[], fixtures: () => Promise<unknown[]>): Promise<T[]> {
  return FIXTURES ? [...entries, ...((await fixtures()) as T[])] : entries
}
