import { reset } from 'cloudflare:test'
import { env } from 'cloudflare:workers'
import { beforeEach, expect, it } from 'vitest'
import { requireStorage } from '../src/server/bindings'

const { files } = requireStorage(env)

beforeEach(reset)

it('stores and retrieves separate objects for two workspace prefixes', async () => {
  await files.put('workspaces/ws_demo_acme/sample.txt', 'Acme file')
  await files.put('workspaces/ws_demo_orbit/sample.txt', 'Orbit file')
  const acme = await files.get('workspaces/ws_demo_acme/sample.txt')
  const orbit = await files.get('workspaces/ws_demo_orbit/sample.txt')
  expect(await acme?.text()).toBe('Acme file')
  expect(await orbit?.text()).toBe('Orbit file')
  expect(await files.get('workspaces/ws_missing/sample.txt')).toBeNull()
})

it('starts with empty R2 storage rather than previous test or developer data', async () => {
  expect((await files.list()).objects).toEqual([])
})
