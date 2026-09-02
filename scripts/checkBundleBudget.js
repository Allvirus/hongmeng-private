const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const distDir = path.resolve(__dirname, '..', 'dist')
const htmlPath = path.join(distDir, 'index.html')
const budgets = {
  script: 320 * 1024,
  style: 45 * 1024,
}

if (!fs.existsSync(htmlPath)) {
  console.error('Missing dist/index.html. Run npm run build first.')
  process.exit(1)
}

const html = fs.readFileSync(htmlPath, 'utf8')
const linkTags = html.match(/<link\b[^>]*>/gi) || []

function getAttribute (tag, name) {
  const pattern = new RegExp('(?:^|\\s)' + name + '=(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i')
  const match = tag.match(pattern)
  return match ? (match[1] || match[2] || match[3] || '') : ''
}

function resolveAsset (href) {
  const pathname = decodeURIComponent(href.split(/[?#]/)[0]).replace(/^\.?\//, '')
  const assetPath = path.resolve(distDir, pathname)
  if (assetPath !== distDir && !assetPath.startsWith(distDir + path.sep)) {
    throw new Error('Asset resolves outside dist: ' + href)
  }
  if (!fs.existsSync(assetPath)) {
    throw new Error('Missing entry asset: ' + href)
  }
  return assetPath
}

const entryAssets = new Map()
let prefetchCount = 0

for (const tag of linkTags) {
  const rel = getAttribute(tag, 'rel').toLowerCase().split(/\s+/)
  if (rel.includes('prefetch')) prefetchCount += 1
  if (!rel.includes('preload')) continue

  const type = getAttribute(tag, 'as').toLowerCase()
  if (type !== 'script' && type !== 'style') continue

  const href = getAttribute(tag, 'href')
  if (href) entryAssets.set(type + ':' + href, { type, href })
}

if (entryAssets.size === 0) {
  console.error('No entry preload assets found in dist/index.html.')
  process.exit(1)
}

const totals = { script: 0, style: 0 }
for (const asset of entryAssets.values()) {
  const source = fs.readFileSync(resolveAsset(asset.href))
  totals[asset.type] += zlib.gzipSync(source).length
}

function kib (bytes) {
  return (bytes / 1024).toFixed(1)
}

console.log('Initial JS gzip: ' + kib(totals.script) + ' KiB / 320.0 KiB')
console.log('Initial CSS gzip: ' + kib(totals.style) + ' KiB / 45.0 KiB')
console.log('Prefetch links: ' + prefetchCount)

const failures = []
if (totals.script > budgets.script) failures.push('Initial JS exceeds 320 KiB gzip')
if (totals.style > budgets.style) failures.push('Initial CSS exceeds 45 KiB gzip')
if (prefetchCount > 0) failures.push('Entry HTML contains generated prefetch links')

if (failures.length > 0) {
  for (const failure of failures) console.error('Budget failure: ' + failure)
  process.exitCode = 1
}
