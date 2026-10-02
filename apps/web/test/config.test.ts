import { env } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'
import { parseRuntimeConfig } from '../src/server/config'

describe('runtime configuration', () => {
  it('accepts the configured local Worker environment', () => {
    expect(parseRuntimeConfig(env)).toEqual({
      environment: 'development',
      appUrl: 'http://127.0.0.1:3100',
    })
  })

  it.each(['staging', 'production'])(
    'accepts an HTTPS %s installation',
    (environment) => {
      expect(
        parseRuntimeConfig({
          APP_ENV: environment,
          APP_URL: 'https://support.example/',
        }),
      ).toEqual({ environment, appUrl: 'https://support.example' })
    },
  )

  it.each(['http://127.0.0.1:3100', 'http://[::1]:3100'])(
    'accepts local development at %s',
    (appUrl) => {
      expect(
        parseRuntimeConfig({ APP_ENV: 'development', APP_URL: appUrl }).appUrl,
      ).toBe(appUrl)
    },
  )

  it.each([
    {},
    { APP_ENV: 'preview', APP_URL: 'https://support.example' },
    { APP_ENV: 1 },
  ])('rejects a missing or unknown environment: %j', (input) => {
    expect(() => parseRuntimeConfig(input)).toThrow('APP_ENV')
  })

  it.each([
    undefined,
    '',
    'not a URL',
    42,
    'javascript:alert(1)',
    'https://user:password@support.example',
    'https://support.example/app',
    'https://support.example?token=secret',
    'https://support.example#fragment',
    'http://support.example',
    'http://localhost:3100',
  ])('rejects an unsafe production origin: %s', (appUrl) => {
    expect(() =>
      parseRuntimeConfig({ APP_ENV: 'production', APP_URL: appUrl }),
    ).toThrow('APP_URL')
  })

  it('requires HTTPS on staging too', () => {
    expect(() =>
      parseRuntimeConfig({
        APP_ENV: 'staging',
        APP_URL: 'http://support.example',
      }),
    ).toThrow('APP_URL')
  })

  it('restricts development HTTP to loopback origins', () => {
    expect(() =>
      parseRuntimeConfig({
        APP_ENV: 'development',
        APP_URL: 'http://support.example',
      }),
    ).toThrow('APP_URL')
  })

  it('does not include the supplied URL or credentials in errors', () => {
    expect(() =>
      parseRuntimeConfig({
        APP_ENV: 'production',
        APP_URL: 'https://user:secret@support.example',
      }),
    ).toThrow(
      /^Invalid APP_URL: credentials, paths, queries, and fragments are not allowed$/,
    )
  })
})
