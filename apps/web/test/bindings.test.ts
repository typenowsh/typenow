import { env } from 'cloudflare:workers'
import { expect, it } from 'vitest'
import { requireStorage } from '../src/server/bindings'

it('requires D1 when app storage is requested', () => {
  expect(() => requireStorage({ FILES: env.FILES })).toThrow(
    'Missing DB binding',
  )
})

it('requires R2 when app storage is requested', () => {
  expect(() => requireStorage({ DB: env.DB })).toThrow('Missing FILES binding')
})
