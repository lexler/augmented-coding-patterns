export type PatternCategory = 'patterns' | 'anti-patterns' | 'obstacles'

export interface Author {
  name: string
  github: string
  url?: string
}

export interface RelatedPattern {
  slug: string
  type: RelationshipType
  direction: 'outgoing' | 'incoming' // outgoing = we point to them, incoming = they point to us
}

export interface PatternMetadata {
  title: string
  category: PatternCategory
  slug: string
  emojiIndicator?: string
  authors?: string[]
  alternativeTitles?: string[]
  synonyms?: string[]
  video?: string
  videoTitle?: string
  relatedPatterns?: RelatedPattern[]
  relatedAntiPatterns?: RelatedPattern[]
  relatedObstacles?: RelatedPattern[]
}

export interface PatternContent extends PatternMetadata {
  content: string
  rawContent: string
}

export interface PatternData {
  metadata: PatternMetadata
  content: string
}

export type RelationshipType =
  | 'related'
  | 'solves'
  | 'similar'
  | 'enables'
  | 'uses'
  | 'causes'
  | 'alternative'
  | 'extends'

export interface Relationship {
  from: string
  to: string
  type: RelationshipType
  bidirectional: boolean
}

export interface RelationshipGraph {
  relationships: Relationship[]
}
