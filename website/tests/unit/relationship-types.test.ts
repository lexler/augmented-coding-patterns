import config from '@/config/relationship-types.json'
import { RelationshipType } from '@/lib/types'

describe('relationship-types config', () => {
  it('JSON validTypes is in sync with the RelationshipType TS union', () => {
    const exhaustiveness: Record<RelationshipType, true> = {
      related: true,
      solves: true,
      similar: true,
      enables: true,
      uses: true,
      causes: true,
      alternative: true,
      extends: true,
    }
    expect(new Set(config.validTypes)).toEqual(new Set(Object.keys(exhaustiveness)))
  })
})
