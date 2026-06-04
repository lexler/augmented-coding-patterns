"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import styles from "./PatternMap.module.css";
import PatternModal from "./PatternModal";
import { PatternContent } from "@/lib/types";
import { basePath } from "@/lib/config";

interface PatternMapProps {
  patternDataByNumber: Record<string, PatternContent>;
  patternDataByLabel: Record<string, PatternContent>;
  mapFile?: string;
}

export default function PatternMap({ patternDataByNumber, patternDataByLabel, mapFile = "semantic_map.svg" }: PatternMapProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const [selectedPattern, setSelectedPattern] = useState<PatternContent | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${basePath}/maps/${mapFile}`)
      .then(res => res.text())
      .then(svg => setSvgContent(svg))
      .catch(err => console.error("Failed to load map:", err));
  }, [mapFile]);

  useEffect(() => {
    const container = containerRef.current;
    if (!svgContent || !container) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const node = target.closest('.interactive-node');
      if (node) {
        const number = node.getAttribute('data-number');
        const label = node.getAttribute('data-label');

        if (number && patternDataByNumber[number]) {
          setSelectedPattern(patternDataByNumber[number]);
        } else if (label && patternDataByLabel[label]) {
          setSelectedPattern(patternDataByLabel[label]);
        }
      }
    };

    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [svgContent, patternDataByNumber, patternDataByLabel]);

  const closeModal = useCallback(() => {
    setSelectedPattern(null);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedPattern) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedPattern, closeModal]);

  if (!svgContent) {
    return <div>Loading map...</div>;
  }

  return (
    <>
      <div
        ref={containerRef}
        className={styles.mapContainer}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      {selectedPattern && (
        <PatternModal pattern={selectedPattern} onClose={closeModal} />
      )}
    </>
  );
}
