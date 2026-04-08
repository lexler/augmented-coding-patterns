#!/usr/bin/env node
// Scans documents/**/*.md frontmatter for `video:` URLs, fetches video titles
// from YouTube's public oEmbed endpoint, and writes the result to
// website/lib/video-titles.json. The JSON maps a YouTube video id to its title.
//
// Run manually after adding or updating a video link:
//   npm run fetch:videos
//
// Existing entries are preserved on network failure so the build remains
// reproducible offline.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(REPO_ROOT, 'documents');
const OUTPUT_PATH = path.join(REPO_ROOT, 'website', 'lib', 'video-titles.json');

function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1) || null;
    }
    if (parsed.hostname.endsWith('youtube.com')) {
      return parsed.searchParams.get('v');
    }
  } catch {
    return null;
  }
  return null;
}

function extractVideoUrl(fileContents) {
  // Match `video:` line in frontmatter, capture the URL
  const match = fileContents.match(/^video:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

function collectVideoIds() {
  const ids = new Set();
  const categories = ['patterns', 'anti-patterns', 'obstacles'];
  for (const category of categories) {
    const dir = path.join(DOCS_DIR, category);
    if (!fs.existsSync(dir)) continue;
    for (const filename of fs.readdirSync(dir)) {
      if (!filename.endsWith('.md')) continue;
      const contents = fs.readFileSync(path.join(dir, filename), 'utf-8');
      const url = extractVideoUrl(contents);
      if (!url) continue;
      const id = getYouTubeId(url);
      if (id) ids.add(id);
    }
  }
  return Array.from(ids);
}

async function fetchTitle(videoId) {
  // Use the canonical watch URL (no timestamp) for oEmbed lookup
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;
  const res = await fetch(oembedUrl);
  if (!res.ok) {
    throw new Error(`oEmbed ${res.status} for ${videoId}`);
  }
  const data = await res.json();
  return data.title;
}

function loadExisting() {
  try {
    return JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

async function main() {
  const ids = collectVideoIds();
  console.log(`Found ${ids.length} unique video id(s) in documents/`);

  const existing = loadExisting();
  const result = { ...existing };
  let fetched = 0;
  let failed = 0;

  for (const id of ids) {
    try {
      const title = await fetchTitle(id);
      result[id] = title;
      fetched += 1;
      console.log(`  ${id} → ${title}`);
    } catch (err) {
      failed += 1;
      const cached = existing[id];
      if (cached) {
        console.warn(`  ${id} fetch failed (${err.message}); keeping cached title: ${cached}`);
      } else {
        console.warn(`  ${id} fetch failed (${err.message}); no cached value`);
      }
    }
  }

  // Drop entries for video ids that are no longer referenced
  for (const id of Object.keys(result)) {
    if (!ids.includes(id)) {
      delete result[id];
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2) + '\n');
  console.log(`Wrote ${Object.keys(result).length} title(s) to ${path.relative(REPO_ROOT, OUTPUT_PATH)}`);
  console.log(`Fetched: ${fetched}, failed: ${failed}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
