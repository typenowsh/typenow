export function requireStorage(bindings: Pick<Cloudflare.Env, 'DB' | 'FILES'>) {
  if (!bindings.DB)
    throw new Error('Missing DB binding: app storage requires D1')
  if (!bindings.FILES)
    throw new Error('Missing FILES binding: app storage requires R2')
  return { db: bindings.DB, files: bindings.FILES }
}
