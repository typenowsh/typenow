export type RuntimeConfig = {
  environment: 'development' | 'staging' | 'production'
  appUrl: string
}

export function parseRuntimeConfig(input: {
  APP_ENV?: unknown
  APP_URL?: unknown
}): RuntimeConfig {
  const environment = input.APP_ENV
  if (
    environment !== 'development' &&
    environment !== 'staging' &&
    environment !== 'production'
  ) {
    throw new Error(
      'Invalid APP_ENV: expected development, staging, or production',
    )
  }

  if (typeof input.APP_URL !== 'string' || !input.APP_URL) {
    throw new Error('Invalid APP_URL: expected an absolute origin')
  }

  let url: URL
  try {
    url = new URL(input.APP_URL)
  } catch {
    throw new Error('Invalid APP_URL: expected an absolute origin')
  }

  const localHttp =
    environment === 'development' &&
    url.protocol === 'http:' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if (url.protocol !== 'https:' && !localHttp) {
    throw new Error(
      'Invalid APP_URL: HTTPS is required outside local development',
    )
  }
  if (
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'Invalid APP_URL: credentials, paths, queries, and fragments are not allowed',
    )
  }

  return { environment, appUrl: url.origin }
}
