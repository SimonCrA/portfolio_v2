import { test, expect } from '@playwright/test'
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// No stubs ship (#28). Each case builds a copy of the site in a temp folder, so it never touches the
// output the rest of the suite is serving, with E2E_PLACEHOLDER adding the offending entry.
const FILES = ['src', 'public', 'astro.config.mjs', 'package.json', 'pnpm-lock.yaml', 'tsconfig.json']

function buildWith(placeholder: string) {
  const dir = mkdtempSync(join(tmpdir(), 'simonctech-guard-'))
  try {
    for (const f of FILES) cpSync(f, join(dir, f), { recursive: true })
    // A real install from the local pnpm store (hardlinks, under a second): Vite cannot resolve a
    // symlinked node_modules. pnpm may exit non-zero over build-script approvals, so check the result.
    spawnSync('pnpm', ['install', '--offline', '--frozen-lockfile'], { cwd: dir, encoding: 'utf8' })
    const astro = join(dir, 'node_modules/astro/astro.js')
    if (!existsSync(astro)) throw new Error(`offline install failed in ${dir}`)
    const run = spawnSync(process.execPath, [astro, 'build'], { cwd: dir, env: { ...process.env, E2E_PLACEHOLDER: placeholder }, encoding: 'utf8' })
    return { status: run.status, output: `${run.stdout}\n${run.stderr}` }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

test.describe('placeholder guard', () => {
  test.skip(({ isMobile }) => !!isMobile, 'one build per case is enough')
  test.describe.configure({ mode: 'serial', timeout: 240_000 })

  test('a Project with placeholder text fails the build, naming the file', () => {
    const { status, output } = buildWith('project')
    expect(status).not.toBe(0)
    expect(output).toContain('src/content/placeholderFixtures/proyecto-stub.md')
  })

  test('a Sobre mí body that repeats the intro fails the build, naming the file', () => {
    const { status, output } = buildWith('about')
    expect(status).not.toBe(0)
    expect(output).toContain('src/content/aboutFixtures/sobre-mi.md')
    expect(output).toContain('repite la intro')
  })
})
