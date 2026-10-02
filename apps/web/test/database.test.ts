import { applyD1Migrations, reset } from 'cloudflare:test'
import { env } from 'cloudflare:workers'
import { beforeEach, describe, expect, it } from 'vitest'
import { requireStorage } from '../src/server/bindings'

const { db } = requireStorage(env)

async function seed() {
  const queries = env.TEST_FIXTURES.flatMap((fixture) => fixture.queries)
  if (queries.length) await db.batch(queries.map((query) => db.prepare(query)))
}

beforeEach(async () => {
  await reset()
  await applyD1Migrations(db, env.TEST_MIGRATIONS)
  await seed()
})

describe('D1 foundation', () => {
  it('creates two independent workspaces with their own support inbox', async () => {
    const { results } = await db
      .prepare(
        `
      SELECT w.slug AS workspace_slug, i.slug AS inbox_slug
      FROM workspaces w JOIN inboxes i ON i.workspace_id = w.id
      ORDER BY w.slug
    `,
      )
      .all()
    expect(results).toEqual([
      { workspace_slug: 'demo-acme', inbox_slug: 'support' },
      { workspace_slug: 'demo-orbit', inbox_slug: 'support' },
    ])
  })

  it('can apply migrations and fixtures again without losing edits or duplicating rows', async () => {
    await db
      .prepare(
        "UPDATE workspaces SET name = 'Edited name' WHERE id = 'ws_demo_acme'",
      )
      .run()
    await applyD1Migrations(db, env.TEST_MIGRATIONS)
    await seed()
    expect(
      await db
        .prepare('SELECT COUNT(*) AS count FROM workspaces')
        .first('count'),
    ).toBe(2)
    expect(
      await db.prepare('SELECT COUNT(*) AS count FROM inboxes').first('count'),
    ).toBe(2)
    expect(
      await db
        .prepare("SELECT name FROM workspaces WHERE id = 'ws_demo_acme'")
        .first('name'),
    ).toBe('Edited name')
  })

  it('rejects an inbox for a workspace that does not exist', async () => {
    await expect(
      db
        .prepare(
          "INSERT INTO inboxes (id, workspace_id, slug, name) VALUES ('inbox_orphan', 'missing', 'support', 'Support')",
        )
        .run(),
    ).rejects.toThrow('FOREIGN KEY')
  })

  it('rejects duplicate inbox slugs within one workspace', async () => {
    await expect(
      db
        .prepare(
          "INSERT INTO inboxes (id, workspace_id, slug, name) VALUES ('inbox_duplicate', 'ws_demo_acme', 'support', 'Another support')",
        )
        .run(),
    ).rejects.toThrow('UNIQUE')
  })

  it('does not silently delete inboxes when a workspace is deleted', async () => {
    await expect(
      db.prepare("DELETE FROM workspaces WHERE id = 'ws_demo_acme'").run(),
    ).rejects.toThrow('FOREIGN KEY')
    expect(
      await db.prepare('SELECT COUNT(*) AS count FROM inboxes').first('count'),
    ).toBe(2)
  })

  it.each(['', '   '])('rejects a blank workspace name: %j', async (name) => {
    await expect(
      db
        .prepare(
          "INSERT INTO workspaces (id, slug, name) VALUES ('ws_invalid', 'invalid', ?)",
        )
        .bind(name)
        .run(),
    ).rejects.toThrow('CHECK')
  })
})
