import * as fs from 'fs'
import * as path from 'path'
import { getAllRelationships } from '@/lib/relationships'

describe('Relationship Graph Integrity', () => {
  it('should have markdown files for all nodes referenced in relationships.mmd', () => {
    const { relationships } = getAllRelationships()
    const missingFiles: string[] = []
    const documentsDir = path.join(__dirname, '../../..', 'documents')
    const checkedSlugs = new Set<string>()

    relationships.forEach(rel => {
      [rel.from, rel.to].forEach(fullSlug => {
        if (checkedSlugs.has(fullSlug)) return
        checkedSlugs.add(fullSlug)

        const [category, slug] = fullSlug.split('/')
        const markdownPath = path.join(documentsDir, category, `${slug}.md`)

        if (!fs.existsSync(markdownPath)) {
          missingFiles.push(fullSlug)
        }
      })
    })

    if (missingFiles.length > 0) {
      throw new Error(
        `Relationships reference missing markdown files:\n${missingFiles.map(f => `  - ${f}`).join('\n')}`
      )
    }
  })

  it('should not declare relationships in document frontmatter', () => {
    const documentsDir = path.join(__dirname, '../../..', 'documents')
    const relationshipField = /^related_(patterns|anti_patterns|obstacles):/m
    const offenders: string[] = []

    ;['patterns', 'anti-patterns', 'obstacles'].forEach(category => {
      const categoryDir = path.join(documentsDir, category)

      fs.readdirSync(categoryDir)
        .filter(file => file.endsWith('.md'))
        .forEach(file => {
          const content = fs.readFileSync(path.join(categoryDir, file), 'utf8')
          const frontmatter = content.split('---')[1] ?? ''

          if (relationshipField.test(frontmatter)) {
            offenders.push(`${category}/${file}`)
          }
        })
    })

    if (offenders.length > 0) {
      throw new Error(
        `Relationships belong in documents/relationships.mmd, not in frontmatter:\n${offenders.map(f => `  - ${f}`).join('\n')}`
      )
    }
  })
})
