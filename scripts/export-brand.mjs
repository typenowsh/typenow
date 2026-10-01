import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const source = new URL('../apps/web/public/brand-mark.svg', import.meta.url)
const directory = new URL('../apps/web/public/brand/', import.meta.url)
const mark = await readFile(source, 'utf8')
const paths = mark.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
const variants = [
  { name: 'citron', background: '#e3edab', foreground: '#20251f' },
  { name: 'cream', background: '#fafbf7', foreground: '#20251f' },
  { name: 'charcoal', background: '#20251f', foreground: '#e3edab' },
  { name: 'transparent', background: null, foreground: '#20251f' },
]

await mkdir(directory, { recursive: true })
for (const { name, background, foreground } of variants) {
  const backdrop = background
    ? `<rect width="1024" height="1024" fill="${background}"/>`
    : ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${backdrop}<g transform="translate(128 112) scale(12)" fill="${foreground}">${paths}</g></svg>\n`
  const output = new URL(`avatar-${name}.svg`, directory)
  await writeFile(output, svg)
  console.log(fileURLToPath(output))
}
