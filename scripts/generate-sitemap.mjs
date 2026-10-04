import { mkdir, writeFile } from 'node:fs/promises'

const origin = (process.env.PUBLIC_SITE_URL ?? '').trim().replace(/\/$/, '')
const paths = ['/', '/platform', '/outcomes', '/for-providers', '/for-employers', '/for-programmes', '/impact', '/security', '/about', '/contact']

await mkdir('dist', { recursive: true })
if (origin) {
  const urls = paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`)
} else {
  await writeFile('dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" />\n')
  await writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\nDisallow: /api/\n')
}
