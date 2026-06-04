import PatternMap from "./PatternMap";
import MapTabs from "./MapTabs";
import StaticMap from "./StaticMap";
import { getAllPatterns } from "@/lib/markdown";
import { PatternContent } from "@/lib/types";
import mapIndex from "@/public/maps/map-index.json";
import mapIndexV2 from "@/public/maps/map-index-v2.json";

type PatternData = PatternContent & {
  name: string;
  category: string;
};

type MapIndex = Record<string, { name: string; category: string; slug: string }>;

function buildDataByNumber(index: MapIndex, allPatterns: PatternData[]): Record<string, PatternData> {
  const byNumber: Record<string, PatternData> = {};
  Object.entries(index).forEach(([number, info]) => {
    const pattern = allPatterns.find(p => p.slug === info.slug);
    if (pattern) {
      byNumber[number] = { ...info, ...pattern };
    }
  });
  return byNumber;
}

export default function TalkPage() {
  const allPatterns = [
    ...getAllPatterns("patterns"),
    ...getAllPatterns("anti-patterns"),
    ...getAllPatterns("obstacles")
  ] as PatternData[];

  const patternDataByNumber = buildDataByNumber(mapIndex, allPatterns);
  const patternDataByNumberV2 = buildDataByNumber(mapIndexV2, allPatterns);
  const patternDataByLabel: Record<string, PatternContent> = {};

  allPatterns.forEach(pattern => {
    patternDataByLabel[pattern.title] = pattern;
  });

  return (
    <div>
      <MapTabs
        tabs={[
          {
            id: 'v1',
            label: 'v1',
            title: 'Augmented Coding: Mapping the Uncharted Territory',
            content: (
              <PatternMap
                patternDataByNumber={patternDataByNumber}
                patternDataByLabel={patternDataByLabel}
              />
            ),
          },
          {
            id: 'v2',
            label: 'v2',
            title: 'Emerging Patterns for Coding with Generative AI',
            content: (
              <PatternMap
                patternDataByNumber={patternDataByNumberV2}
                patternDataByLabel={patternDataByLabel}
                mapFile="semantic_map_v2.svg"
              />
            ),
          },
          {
            id: 'v3',
            label: 'v3',
            title: 'Patterns for Coding with AI',
            content: <StaticMap version="v3" alt="Patterns for Coding with AI map" />,
          },
        ]}
      />
      <div style={{ padding: '1rem 2rem 2rem', textAlign: 'center' }}>
        <p>
          Explore the interactive map above, or{' '}
          <a
            href="https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=5301s"
            target="_blank"
            rel="noopener noreferrer"
          >
            watch the guided walkthrough
          </a>
          {' '}on YouTube.
        </p>
      </div>
    </div>
  );
}
