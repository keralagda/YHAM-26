import { cpSync, existsSync } from 'fs'
import { join } from 'path'

const root = process.cwd()
const standalone = join(root, '.next', 'standalone')

if (!existsSync(standalone)) {
  console.log('No standalone output found, skipping copy.')
  process.exit(0)
}

// Copy static assets
const staticSrc = join(root, '.next', 'static')
const staticDest = join(standalone, '.next', 'static')
if (existsSync(staticSrc)) {
  cpSync(staticSrc, staticDest, { recursive: true })
  console.log('Copied .next/static → standalone/.next/static')
}

// Copy public folder
const publicSrc = join(root, 'public')
const publicDest = join(standalone, 'public')
if (existsSync(publicSrc)) {
  cpSync(publicSrc, publicDest, { recursive: true })
  console.log('Copied public → standalone/public')
}

console.log('Standalone build ready.')
