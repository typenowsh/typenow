import { fileURLToPath } from 'node:url'
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    cloudflareTest(async () => ({
      main: './test/worker.ts',
      remoteBindings: false,
      wrangler: { configPath: './wrangler.jsonc' },
      miniflare: {
        bindings: {
          TEST_MIGRATIONS: await readD1Migrations(
            fileURLToPath(new URL('./migrations', import.meta.url)),
          ),
          TEST_FIXTURES: await readD1Migrations(
            fileURLToPath(new URL('./fixtures', import.meta.url)),
          ),
        },
      },
    })),
  ],
  test: { include: ['test/**/*.test.ts'] },
})
