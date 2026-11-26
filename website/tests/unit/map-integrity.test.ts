import * as fs from 'fs'
import * as path from 'path'
import { getAllPatterns } from '@/lib/markdown'
import { CATEGORY_CONFIGS } from '@/app/lib/category-config'
import { PatternCategory } from '@/lib/types'

type MapIndex = Record<string, { category: string; slug: string }>

const mapsDir = path.join(__dirname, '../..', 'public', 'maps')
const documentsDir = path.join(__dirname, '../../..', 'documents')

function mapFiles(): string[] {
  return fs.readdirSync(mapsDir).filter(file => /^semantic_map(_v\d+)?\.svg$/.test(file))
}

function indexFileFor(mapFile: string): string {
  return mapFile.replace('semantic_map', 'map-index').replace('_v', '-v').replace('.svg', '.json')
}

function interactiveNodes(mapFile: string): Element[] {
  const svg = fs.readFileSync(path.join(mapsDir, mapFile), 'utf8')
  const document = new DOMParser().parseFromString(svg, 'image/svg+xml')
  return Array.from(document.querySelectorAll('.interactive-node'))
}

function documentTitles(): Set<string> {
  const categories = Object.keys(CATEGORY_CONFIGS) as PatternCategory[]
  return new Set(categories.flatMap(category => getAllPatterns(category).map(pattern => pattern.title)))
}

function readIndex(indexPath: string): MapIndex {
  return fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath, 'utf8')) : {}
}

function entriesWithoutDocument(index: MapIndex): string[] {
  return Object.entries(index)
    .filter(([, { category, slug }]) => !fs.existsSync(path.join(documentsDir, category, `${slug}.md`)))
    .map(([number, { category, slug }]) => `#${number} ${category}/${slug}`)
}

function unreachableNodes(mapFile: string, index: MapIndex, titles: Set<string>): string[] {
  return interactiveNodes(mapFile)
    .filter(node => {
      const number = node.getAttribute('data-number')
      const label = node.getAttribute('data-label') ?? ''
      return number ? !index[number] : !titles.has(label)
    })
    .map(node => node.getAttribute('data-number') ?? node.getAttribute('data-label') ?? '(unlabeled)')
}

describe('Interactive Map Integrity', () => {
  const titles = documentTitles()

  describe.each(mapFiles())('%s', mapFile => {
    const indexPath = path.join(mapsDir, indexFileFor(mapFile))

    it('has a map index', () => {
      expect(fs.existsSync(indexPath)).toBe(true)
    })

    it('points every index entry at an existing document', () => {
      expect(entriesWithoutDocument(readIndex(indexPath))).toEqual([])
    })

    it('opens a document from every interactive node', () => {
      expect(unreachableNodes(mapFile, readIndex(indexPath), titles)).toEqual([])
    })
  })
})
