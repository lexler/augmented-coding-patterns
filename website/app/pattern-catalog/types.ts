import { PatternCategory } from "@/lib/types";

export interface CatalogPreviewItem {
  slug: string;
  title: string;
  emojiIndicator?: string;
  alternativeTitles?: string[];
  synonyms?: string[];
  authorIds: string[];
  authorNames: string[];
  authorGithubs: string[];
  summary?: string;
  content: string;
  video?: string;
  videoTitle?: string;
}

export interface CatalogGroupData {
  category: PatternCategory;
  label: string;
  icon: string;
  styleClass: string;
  items: CatalogPreviewItem[];
}
