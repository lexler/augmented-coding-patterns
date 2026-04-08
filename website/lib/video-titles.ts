import videoTitlesJson from './video-titles.json'

const videoTitles: Record<string, string> = videoTitlesJson

export function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1) || null
    }
    if (parsed.hostname.endsWith('youtube.com')) {
      return parsed.searchParams.get('v')
    }
    return null
  } catch {
    return null
  }
}

export function getVideoTitle(videoUrl: string): string | undefined {
  const id = getYouTubeId(videoUrl)
  if (!id) return undefined
  return videoTitles[id]
}
