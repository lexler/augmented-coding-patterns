const repositoryUrl = 'https://github.com/lexler/augmented-coding-patterns'

export const siteConfig = {
  name: 'Augmented Coding Patterns',
  description: 'A collection of emerging patterns, anti-patterns, and obstacles for effective AI-augmented software development',
  author: {
    name: 'Lada Kesseler',
    github: 'lexler'
  },
  repository: {
    owner: 'lexler',
    name: 'augmented-coding-patterns',
    url: repositoryUrl
  },
  tagline: 'Patterns for building software with AI',
  links: {
    github: repositoryUrl,
    contribute: `${repositoryUrl}/blob/main/CONTRIBUTE.md`
  },
  licenses: {
    content: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/'
    },
    code: {
      name: 'MIT',
      url: `${repositoryUrl}/blob/main/LICENSE-CODE`
    }
  }
} as const

export type SiteConfig = typeof siteConfig
